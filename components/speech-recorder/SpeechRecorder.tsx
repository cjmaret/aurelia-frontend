import { useState, useEffect, useContext } from 'react';
import { Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
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
import { produceApiErrorAlert } from '@/utils/functions/handleApiError';
import { useToastModal } from '@/utils/contexts/ToastModalContext';
import { useTranslation } from 'react-i18next';

export default function SpeechRecorder() {
  const theme: any = useTheme();
  const { t } = useTranslation();
  const { setCorrectionData } = useCorrectionsData();
  const { showToast } = useToastModal();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [waveformOpacity] = useState(new Animated.Value(0));
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<ReturnType<
    typeof setInterval
  > | null>(null);
  const MAX_RECORDING_SECONDS = 60;

  useEffect(() => {
    if (!permissionResponse?.granted) {
      requestPermission();
    }
  }, [permissionResponse]);

  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
      // start waveform animation

      setElapsedTime(0); // Reset the timer
      const interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(null);

    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording?.getURI();
    if (uri) {
      addCorrection(uri);
    }
    console.log('Recording stopped and stored at', uri);
    waveformOpacity.setValue(0);
  }

  useEffect(() => {
    if (recording && elapsedTime >= MAX_RECORDING_SECONDS) {
      stopRecording();
      showToast(
        'info',
        'Recording Stopped',
        `Maximum recording length of ${MAX_RECORDING_SECONDS} seconds reached.`
      );
    }
  }, [elapsedTime, recording]);

  async function addCorrection(audioUri: string) {
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      name: 'audioRecording.m4a',
      type: 'audio/m4a',
    } as any);

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
        console.error('Error from server:', response.error);
        showToast('error', 'Error Processing Recording', 'Please try again.');
        return;
      }

      const correctionData = response.data as CorrectionDataType[];
      if (correctionData) {
        setCorrectionData((prevData: CorrectionDataType[]) => [
          ...correctionData,
          ...prevData,
        ]);
        showToast('success', t('recordingProcessed'), t('correctionsReady'));
      }
    } catch (error: any) {
      const { status, message } = error;

      const errorMap: any = {
        'No speech detected in the audio file.': t('noSpeechError'),
      };

      let translatedMessage = t('unexpectedError');

      if (typeof message === 'string') {
        translatedMessage = errorMap[message] || message;

        if (message.toLowerCase().includes('unexpected error')) {
          translatedMessage = t('unexpectedError');
        }
      }

      console.error('Error sending audio:', error);
      showToast('error', t('errorSendingAudio'), translatedMessage);
      produceApiErrorAlert({ status, message, showToast, t });
    }
  }

  function getTimerColor(seconds: number) {
    const percent = seconds / MAX_RECORDING_SECONDS;
    if (percent >= 0.85) return theme.colors.errorText;
    if (percent >= 0.7) return theme.colors.warningText;
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
      <UpperContainer>
        <Waveform recording={true} />
        {/* <NewWaveform recording={true} color={theme.colors.primary} /> */}
      </UpperContainer>
      <LowerContainer>
        <RecordingGroup>
          <TimerText color={getTimerColor(elapsedTime)}>
            {formatElapsedTime(elapsedTime)}
          </TimerText>
          <RecordButtonComponent
            startRecording={startRecording}
            stopRecording={stopRecording}
          />
        </RecordingGroup>
      </LowerContainer>
    </SpeechRecorderGroup>
  );
}

export const RecordButton = styled.View``;
