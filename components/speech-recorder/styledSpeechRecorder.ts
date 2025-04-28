import styled from 'styled-components/native';
import { Animated } from 'react-native';

export const SpeechRecorderGroup = styled.View`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export const UpperContainer = styled.View`
  background-color: ${({ theme }: { theme: any }) => theme.colors.backgroundPrimary};
  height: 55%;
  display: flex;
  justify-content: flex-end;
`;

export const LowerContainer = styled.View`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.backgroundSecondary};
  height: 45%;
`;

export const RecordingGroup = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`;

export const TimerText = styled.Text`
  margin-bottom: 10px;
  font-size: 48px;
  color: ${({ theme }: { theme: any }) => theme.colors.textSecondary};
`;

// export const Transcript = styled.Text`
//   font-size: 16px;
//   color: white;
//   text-align: center;
//   padding: 10px;
// `;

export const WaveformBackground = styled(Animated.View)`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
`;

