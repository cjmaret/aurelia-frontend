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
  const [isTapRecording, setIsTapRecording] = useState<boolean>(false);
  const isTapRecordingRef = useRef<boolean>(false);
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false);
  // prevents duplicate calls when max recording length is reached
  const hasStoppedRef = useRef(false);
  // prevents user from spamming record button
  const [canRecord, setCanRecord] = useState(true);
  const canRecordRef = useRef(true);
  const MAX_RECORDING_SECONDS = 60;
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
      resetButtonState();
      stopRecording();
      showToast(
        'info',
        'Recording Stopped',
        `Maximum recording length of ${MAX_RECORDING_SECONDS} seconds reached.`,
      );
    }
  }, [elapsedTime, isRecording]);

  function resetButtonState() {
    setIsTapRecording(false);
    isTapRecordingRef.current = false;
    setIsButtonPressed(false);
  }

  async function startRecording() {
    if (isAudioPermissionGranted) {
      try {
        if (!canRecordRef.current) return;
        canRecordRef.current = false;
        setCanRecord(false);
        hasStoppedRef.current = false;

        setIsTapRecording(true);
        isTapRecordingRef.current = true;

        try {
          await setAudioModeAsync({
            playsInSilentMode: true,
            allowsRecording: true,
            shouldPlayInBackground: false,
          });

          await audioRecorder.prepareToRecordAsync();
          audioRecorder.record();

          setIsRecording(true);
          setElapsedTime(0);

          // re-enable button to allow stopping
          canRecordRef.current = true;
          setCanRecord(true);

          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          timerRef.current = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
          }, 1000);
        } catch (err) {
          console.error('Failed to start recording', err);
          canRecordRef.current = true;
          setCanRecord(true);
          setIsTapRecording(false);
          isTapRecordingRef.current = false;
        }
      } catch (error) {
        console.error('Error starting recording:', error);
        canRecordRef.current = true;
        setCanRecord(true);
        setIsTapRecording(false);
        isTapRecordingRef.current = false;
      }
    } else {
      showAudioPermissionAlert();
    }
  }

  async function stopRecording() {
    if (hasStoppedRef.current) return;
    hasStoppedRef.current = true;

    setIsRecording(false);
    setIsTapRecording(false);
    isTapRecordingRef.current = false;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    await audioRecorder.stop();
    const uri = audioRecorder.uri;
    if (uri) {
      try {
        const file = new FileSystem.File(uri);
        const exists = file.exists;
        const size = exists ? file.size : 0;

        if (!exists || size < 1000) {
          showToast(
            'error',
            t('errorSendingAudio'),
            t('noSpeechDetectedError'),
          );
          setTimeout(() => {
            canRecordRef.current = true;
            setCanRecord(true);
          }, RECORD_COOLDOWN_MS);
          return;
        }
        addConversation(uri);
      } catch (error) {
        console.error('Error checking file:', error);
        setTimeout(() => {
          canRecordRef.current = true;
          setCanRecord(true);
        }, RECORD_COOLDOWN_MS);
        return;
      }
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
        t('processingRecordingMessage'),
      );

      const response: ConversationResponseType =
        await api.addConversation(audioUri);

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
                (cd) => cd.conversationId === c.conversationId,
              ),
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
      '0',
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
      ],
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
            startRecording={startRecording}
            stopRecording={stopRecording}
            resetButtonState={resetButtonState}
            isTapRecording={isTapRecording}
            isTapRecordingRef={isTapRecordingRef}
            isButtonPressed={isButtonPressed}
            setIsButtonPressed={setIsButtonPressed}
            disabled={!canRecord || hasReachedAnonLimit}
            isVisuallyDisabled={hasReachedAnonLimit}
            setElapsedTime={setElapsedTime}
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
