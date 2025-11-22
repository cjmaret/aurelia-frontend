import { useState, useEffect, useRef } from 'react';
import { Alert, Animated, AppState, Linking, Platform } from 'react-native';
import {
  RecordingPresets,
  useAudioRecorder,
  setAudioModeAsync,
  requestRecordingPermissionsAsync,
  getRecordingPermissionsAsync,
} from 'expo-audio';
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
import { useTheme } from 'styled-components/native';
import api from '@/lib/api';
import { ConversationDataType, ConversationResponseType } from '@/types/types';
import { useConversationData } from '@/utils/contexts/ConversationsDataContext';
import { showApiErrorToast } from '@/utils/functions/showApiErrorToast';
import { useToastModal } from '@/utils/contexts/ToastModalContext';
import { useTranslation } from 'react-i18next';
import OnboardingBubbles from '../onboarding-bubbles/OnboardingBubbles';
import { useAuth } from '@/utils/contexts/AuthContext';
import LoginButton from '../login-button/LoginButton';
import { useReviewPromptContext } from '@/utils/contexts/ReviewPromptContext';

export default function SpeechRecorder() {
  const theme: any = useTheme();
  const { t } = useTranslation();
  const { showOnboarding, setShowOnboarding } = useAuth();
  const { incrementSuccessfulAction } = useReviewPromptContext();
  const {
    setConversationData,
    setIsProcessingRecording,
    hasReachedAnonLimit,
    setPagination,
  } = useConversationData();
  const { showToast } = useToastModal();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isAudioPermissionGranted, setIsAudioPermissionGranted] =
    useState(false);
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
    // request permission with dialogue
    const requestPermission = async () => {
      const status = await requestRecordingPermissionsAsync();
      setIsAudioPermissionGranted(status.status === 'granted');
      if (status.status === 'granted') {
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
        });
      }
    };

    // silently checks for permission
    const checkPermission = async () => {
      const status = await getRecordingPermissionsAsync();
      setIsAudioPermissionGranted((prev) => {
        const newValue = status.status === 'granted';
        return prev !== newValue ? newValue : prev;
      });
    };

    // request permission on mount
    requestPermission();

    // listen for app coming back to foreground
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        checkPermission();
      }
    });

    return () => {
      subscription.remove();
    };
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
    if (isAudioPermissionGranted) {
      try {
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
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    } else {
      showAudioPermissionAlert();
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
        incrementSuccessfulAction();
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
    return theme.colors.textSecondary;
  }

  function formatElapsedTime(elaspedSeconds: number): string {
    const minutes = Math.floor(elaspedSeconds / 60);
    const seconds = elaspedSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  }

  const showAudioPermissionAlert = () => {
    Alert.alert(
      'Microphone Permission Required',
      'Please enable microphone permissions for Aurelia in your device settings.',
      [
        {
          text: 'Open Settings',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

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
            isAudioPermissionGranted={isAudioPermissionGranted}
            showAudioPermissionAlert={showAudioPermissionAlert}
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
