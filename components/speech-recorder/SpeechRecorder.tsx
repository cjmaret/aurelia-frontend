import { useState, useEffect, useRef } from 'react';
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
import { showApiErrorToast } from '@/utils/functions/showApiErrorToast';
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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

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
    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    await audioRecorder.stop();
    const uri = audioRecorder.uri;
    if (uri) {
      addCorrection(uri);
    }
    waveformOpacity.setValue(0);
  }

  // stop recording if exceeds max length
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
      const response: CorrectionResponseType = await api.addCorrection(
        formData
      );

      showToast(
        'info',
        t('processingRecording'),
        t('processingRecordingMessage')
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
      showApiErrorToast({ error, showToast, t });
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
          />
        </RecordingGroup>
      </LowerContainer>
    </SpeechRecorderGroup>
  );
}

export const RecordButton = styled.View``;
