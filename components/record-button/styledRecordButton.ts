import styled from 'styled-components/native';

export const RecordButton = styled.TouchableHighlight<{ isRecording: boolean }>`
  background-color: black;
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  margin-bottom: 20px;
  box-shadow: ${({ isRecording }: { isRecording: boolean }) =>
    isRecording
      ? `0 0 15px ${({ theme }: { theme: any }) => theme.colors.rippleBorder};`
      : 'none'};
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;
