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

  /* box-shadow: ${({
    isRecordButtonPressed,
  }: {
    isRecordButtonPressed: boolean;
  }) =>
    isRecordButtonPressed
      ? `0 0 15px ${({ theme }: { theme: any }) => theme.colors.rippleBorder};`
      : 'none'}; */
`;

// export const ButtonText = styled.Text`
//   color: white;
//   font-size: 18px;
//   font-weight: bold;
// `;
