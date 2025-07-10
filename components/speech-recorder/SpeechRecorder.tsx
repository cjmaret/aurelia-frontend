import { useState, useEffect, useRef } from 'react';
import { Alert, Animated } from 'react-native';
import { AudioModule, AudioQuality, IOSOutputFormat, useAudioRecorder } from 'expo-audio';
import * as FileSystem from 'expo-file-system';
import {
  LogInToContinueText,
  LowerContainer,
  RecordingGroup,
  SpeechRecorderGroup,
  TimerText,
  UpperContainer,
} from './styledSpeechRecorder';
import Waveform from '../waveform/Waveform';
import RecordButtonComponent from '../record-button/RecordButton';
import styled, { useTheme } from 'styled-components/native';
import api from '@/lib/api';
import { ConversationDataType, ConversationResponseType } from '@/types/types';
import { useConversationData } from '@/utils/contexts/ConversationsDataContext';
import { showApiErrorToast } from '@/utils/functions/showApiErrorToast';
import { useToastModal } from '@/utils/contexts/ToastModalContext';
import { useTranslation } from 'react-i18next';
import OnboardingBubbles from '../onboarding-bubbles/OnboardingBubbles';
import { useAuth } from '@/utils/contexts/AuthContext';
import LoginButton from '../login-button/LoginButton';

export default function SpeechRecorder() {
  const theme: any = useTheme();
  const { t } = useTranslation();
  const { showOnboarding, setShowOnboarding } = useAuth();
  const {
    setConversationData,
    setIsProcessingRecording,
    hasReachedAnonLimit,
    setPagination,
  } = useConversationData();
  const { showToast } = useToastModal();
  // individual audio options to avoid device crashes
  const audioRecorder = useAudioRecorder({
    extension: '.m4a',
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    android: {
      outputFormat: 'mpeg4',
      audioEncoder: 'aac',
    },
    ios: {
      outputFormat: IOSOutputFormat.MPEG4AAC,
      audioQuality: AudioQuality.MAX,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  });
  const [isRecording, setIsRecording] = useState(false);
  const [waveformOpacity] = useState(new Animated.Value(0));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRecordButtonPressed, setIsRecordButtonPressed] =
    useState<boolean>(false);
  // prevents duplicate calls if user holds record button past allotted time
  const hasStoppedRef = useRef(false);
  const MAX_RECORDING_SECONDS = 60;
  // prevents user from spamming record button
  const [canRecord, setCanRecord] = useState(true);
  const canRecordRef = useRef(true);
  const RECORD_COOLDOWN_MS = 1000;

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }
    })();
  }, []);

  // stop recording if exceeds max length
  useEffect(() => {
    if (isRecording && elapsedTime >= MAX_RECORDING_SECONDS) {
      stopRecording();
      setIsRecordButtonPressed(false);
      showToast(
        'info',
        'Recording Stopped',
        `Maximum recording length of ${MAX_RECORDING_SECONDS} seconds reached.`
      );
    }
  }, [elapsedTime, isRecording]);

  async function startRecording() {
    if (!canRecordRef.current) return; // Use ref for instant check
    canRecordRef.current = false;
    setCanRecord(false);
    hasStoppedRef.current = false;
    try {
      await audioRecorder.prepareToRecordAsync();

      audioRecorder.record();
      setIsRecording(true);

      setElapsedTime(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (hasStoppedRef.current) return;
    // prevents race condition from turning off ref
    hasStoppedRef.current = true;

    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    await audioRecorder.stop();
    const uri = audioRecorder.uri;
    if (uri) {
      const info = await FileSystem.getInfoAsync(uri);
      if (!info.exists || info.size < 1000) {
        showToast('error', t('errorSendingAudio'), t('noSpeechDetectedError'));
        setTimeout(() => {
          canRecordRef.current = true;
          setCanRecord(true);
        }, RECORD_COOLDOWN_MS);
        return;
      }
      addConversation(uri);
    }
    waveformOpacity.setValue(0);
    setTimeout(() => {
      canRecordRef.current = true;
      setCanRecord(true);
    }, RECORD_COOLDOWN_MS);
  }

  async function addConversation(audioUri: string) {
    console.log('Adding conversation for audio:', audioUri);
    setIsProcessingRecording(true);
    try {
      showToast(
        'info',
        t('processingRecording'),
        t('processingRecordingMessage')
      );

      const response: ConversationResponseType = await api.addConversation(
        audioUri
      );

      if (!response.success) {
        showToast('error', 'Error Processing Recording', 'Please try again.');
        return;
      }

      const conversationData = response.data as ConversationDataType[];
      if (conversationData) {
        setConversationData((prevData: ConversationDataType[]) => {
          // filter out existing conversations to avoid duplicates
          const filtered = prevData.filter(
            (c) =>
              !conversationData.some(
                (cd) => cd.conversationId === c.conversationId
              )
          );
          return [...conversationData, ...filtered];
        });
        setPagination((prev) => ({
          ...prev,
          total: prev.total + 1,
        }));
        showToast('success', t('recordingProcessed'), t('correctionsReady'));
      }
    } catch (error: any) {
      showApiErrorToast({ error, showToast, t });
    } finally {
      setIsProcessingRecording(false);
    }
  }

  function getTimerColor(seconds: number) {
    const percent = seconds / MAX_RECORDING_SECONDS;
    if (percent >= 0.85) return theme.colors.textError;
    if (percent >= 0.7) return theme.colors.textWarning;
    return theme.colors.primary;
  }

  function formatElapsedTime(elaspedSeconds: number): string {
    const minutes = Math.floor(elaspedSeconds / 60);
    const seconds = elaspedSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  }

  return (
    <SpeechRecorderGroup>
      <LoginButton />
      {showOnboarding && (
        <OnboardingBubbles onFinish={() => setShowOnboarding(false)} />
      )}
      <UpperContainer>
        <Waveform isRecording={isRecording} />
      </UpperContainer>
      <LowerContainer>
        <RecordingGroup>
          <TimerText
            color={getTimerColor(elapsedTime)}
            isVisuallyDisabled={hasReachedAnonLimit}>
            {formatElapsedTime(elapsedTime)}
          </TimerText>
          <RecordButtonComponent
            startRecording={startRecording}
            stopRecording={stopRecording}
            isRecordButtonPressed={isRecordButtonPressed}
            setIsRecordButtonPressed={setIsRecordButtonPressed}
            disabled={!canRecord || hasReachedAnonLimit}
            isVisuallyDisabled={hasReachedAnonLimit}
          />
          {hasReachedAnonLimit && (
            <LogInToContinueText>
              {t('createAccountToContinueRecording')}
            </LogInToContinueText>
          )}
        </RecordingGroup>
      </LowerContainer>
    </SpeechRecorderGroup>
  );
}

export const RecordButton = styled.View``;
