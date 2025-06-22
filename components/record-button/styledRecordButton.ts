import styled from 'styled-components/native';

export const RecordButtonContainer = styled.View``;

export const RecordButton = styled.Pressable<{
  theme: any;
  isRecordButtonPressed: boolean;
  isVisuallyDisabled: boolean;
}>`
  background-color: ${({
    theme,
    isVisuallyDisabled,
  }: {
    theme: any;
    isVisuallyDisabled: boolean;
  }) =>
    isVisuallyDisabled
      ? theme.colors.buttonBackgroundDisabled
      : theme.colors.buttonBackgroundPrimary};
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
