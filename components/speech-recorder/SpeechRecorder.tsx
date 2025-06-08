import { useState, useEffect, useRef } from 'react';
import { Alert, Animated } from 'react-native';
import { AudioModule, RecordingPresets, useAudioRecorder } from 'expo-audio';
import * as FileSystem from 'expo-file-system';
import {
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
import { CorrectionDataType, CorrectionResponseType } from '@/types/types';
import { useCorrectionsData } from '@/utils/contexts/CorrectionsDataContext';
import { showApiErrorToast } from '@/utils/functions/showApiErrorToast';
import { useToastModal } from '@/utils/contexts/ToastModalContext';
import { useTranslation } from 'react-i18next';
import OnboardingBubbles from '../onboarding-bubbles/OnboardingBubbles';
import { useAuth } from '@/utils/contexts/AuthContext';

export default function SpeechRecorder() {
  const theme: any = useTheme();
  const { t } = useTranslation();
  const { showOnboarding, setShowOnboarding } = useAuth();
  const { setCorrectionData, setIsProcessingRecording } = useCorrectionsData();
  const { showToast } = useToastModal();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
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
      addCorrection(uri);
    }
    waveformOpacity.setValue(0);
    setTimeout(() => {
      canRecordRef.current = true;
      setCanRecord(true);
    }, RECORD_COOLDOWN_MS);
  }

  async function addCorrection(audioUri: string) {
    console.log('Adding correction for audio:', audioUri);
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      name: 'audioRecording.m4a',
      type: 'audio/m4a',
    } as any);
    setIsProcessingRecording(true);
    try {
      showToast(
        'info',
        t('processingRecording'),
        t('processingRecordingMessage')
      );

      const response: CorrectionResponseType = await api.addCorrection(
        formData
      );

      if (!response.success) {
        showToast('error', 'Error Processing Recording', 'Please try again.');
        return;
      }

      const correctionData = response.data as CorrectionDataType[];
      if (correctionData) {
        setCorrectionData((prevData: CorrectionDataType[]) => {
          // filter out existing corrections to avoid duplicates
          const filtered = prevData.filter(
            (c) =>
              !correctionData.some(
                (cd) => cd.conversationId === c.conversationId
              )
          );
          return [...correctionData, ...filtered];
        });
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

  function formatElapsedTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}`;
  }

  return (
    <SpeechRecorderGroup>
      {showOnboarding && (
        <OnboardingBubbles onFinish={() => setShowOnboarding(false)} />
      )}
      <UpperContainer>
        <Waveform isRecording={isRecording} />
      </UpperContainer>
      <LowerContainer>
        <RecordingGroup>
          <TimerText color={getTimerColor(elapsedTime)}>
            {formatElapsedTime(elapsedTime)}
          </TimerText>
          <RecordButtonComponent
            startRecording={startRecording}
            stopRecording={stopRecording}
            isRecordButtonPressed={isRecordButtonPressed}
            setIsRecordButtonPressed={setIsRecordButtonPressed}
            disabled={!canRecord}
          />
        </RecordingGroup>
      </LowerContainer>
    </SpeechRecorderGroup>
  );
}

export const RecordButton = styled.View``;
