import { useState, useEffect } from 'react';
import { Alert, Animated } from 'react-native';
import { AudioModule, RecordingPresets, useAudioRecorder } from 'expo-audio';
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
import { showApiErrorToast } from '@/utils/functions/handleApiError';
import { useToastModal } from '@/utils/contexts/ToastModalContext';
import { useTranslation } from 'react-i18next';

export default function SpeechRecorder() {
  const theme: any = useTheme();
  const { t } = useTranslation();
  const { setCorrectionData } = useCorrectionsData();
  const { showToast } = useToastModal();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [waveformOpacity] = useState(new Animated.Value(0));
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<ReturnType<
    typeof setInterval
  > | null>(null);
  const MAX_RECORDING_SECONDS = 60;

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }
    })();
  }, []);

  async function startRecording() {
    try {
      await audioRecorder.prepareToRecordAsync();
      console.log('Starting recording..');

      audioRecorder.record();
      setIsRecording(true);
      console.log('Recording started');

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
    setIsRecording(false);

    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    await audioRecorder.stop();
    const uri = audioRecorder.uri;
    console.log('Recording stopped, URI:', uri);
    if (uri) {
      addCorrection(uri);
    }
    console.log('Recording stopped and stored at', uri);
    waveformOpacity.setValue(0);
  }

  useEffect(() => {
    if (isRecording && elapsedTime >= MAX_RECORDING_SECONDS) {
      stopRecording();
      showToast(
        'info',
        'Recording Stopped',
        `Maximum recording length of ${MAX_RECORDING_SECONDS} seconds reached.`
      );
    }
  }, [elapsedTime, isRecording]);

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
      // TODO: ????
      showToast('error', t('errorSendingAudio'), translatedMessage);
      showApiErrorToast({ status, message, showToast, t });
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
        {/* TODO: add isRecording to prop */}
        <Waveform recording={true} />
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
