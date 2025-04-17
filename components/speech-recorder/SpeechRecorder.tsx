import { useState, useEffect, useContext } from 'react';
import { Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
import {
  LowerContainer,
  RecordingGroup,
  SpeechRecorderGroup,
  UpperContainer,
} from './styledSpeechRecorder';
import { Button } from 'react-native';
import Waveform from '../waveform/Waveform';
import RecordButtonComponent from '../record-button/RecordButton';
import styled from 'styled-components/native';
import api from '@/lib/api';
import { CorrectionDataType } from '@/types/types';
import { useCorrectionsData } from '@/utils/contexts/CorrectionsDataContext';

export default function SpeechRecorder() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [waveformOpacity] = useState(new Animated.Value(0));

  const { setCorrectionData } = useCorrectionsData();

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
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(null);
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording?.getURI();
    if (uri) {
      sendAudioFile(uri);
    }
    console.log('Recording stopped and stored at', uri);
    waveformOpacity.setValue(0);
  }

  async function sendAudioFile(audioUri: string) {
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      name: 'audioRecording.m4a',
      type: 'audio/m4a',
    } as any);

    api.sendAudioFile(formData).then((response) => {
      if (!response) {
        console.error('No response from server');
        return;
      }

      console.log('Audio file sent successfully:', response);
      setCorrectionData((prevData: CorrectionDataType[]) => {
        // replace object if new object has the same conversationId
        const existingIndex = prevData.findIndex(
          (item) => item.conversationId === response.conversationId
        );

        if (existingIndex !== -1) {
          const updatedData = [...prevData];
          updatedData[existingIndex] = response;
          return updatedData;
        } else {
          return [response, ...prevData];
        }
      });
    });
  }

  return (
    <SpeechRecorderGroup>
      <UpperContainer>
        {/* <Waveform recording={!!recording} /> */}
      </UpperContainer>
      <LowerContainer>
        <RecordingGroup>
          <RecordButtonComponent
            recording={recording}
            startRecording={startRecording}
            stopRecording={stopRecording}
          />
        </RecordingGroup>
      </LowerContainer>
    </SpeechRecorderGroup>
  );
}

export const RecordButton = styled.View``;
