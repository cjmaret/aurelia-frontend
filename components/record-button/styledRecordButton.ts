import styled from 'styled-components/native';

export const RecordButtonContainer = styled.View``;

export const RecordButton = styled.Pressable<{
  theme: any;
  isRecordButtonPressed: boolean;
}>`
  background-color: ${({
    theme,
    isRecordButtonPressed,
  }: {
    theme: any;
    isRecordButtonPressed: boolean;
  }) => (isRecordButtonPressed ? theme.colors.primary : theme.colors.primary)};
  width: ${({ isRecordButtonPressed }: { isRecordButtonPressed: boolean }) =>
    isRecordButtonPressed ? `145px` : '150px'};
  height: ${({ isRecordButtonPressed }: { isRecordButtonPressed: boolean }) =>
    isRecordButtonPressed ? `145px` : '150px'};
  justify-content: center;
  align-items: center;
  border-radius: 150px;
  border: ${({
    theme,
    isRecordButtonPressed,
  }: {
    theme: any;
    isRecordButtonPressed: boolean;
  }) =>
    isRecordButtonPressed ? `5px solid ${theme.colors.primaryDark}` : 'none'};
`;
