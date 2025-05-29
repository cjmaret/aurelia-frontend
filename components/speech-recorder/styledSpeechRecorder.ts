import styled from 'styled-components/native';
import { Animated } from 'react-native';

export const SpeechRecorderGroup = styled.View`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export const UpperContainer = styled.View`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.backgroundPrimary};
  height: 40%;
  display: flex;
  justify-content: flex-end;
`;

export const LowerContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.backgroundSecondary};
  height: 60%;
`;

export const RecordingGroup = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const TimerText = styled.Text<{ color: string }>`
  margin-bottom: 10px;
  font-size: 24px;
  color: ${({ color }: { color: string }) => color};
`;

export const WaveformBackground = styled(Animated.View)`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
`;
