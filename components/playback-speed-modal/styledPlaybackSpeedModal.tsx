import styled from 'styled-components/native';

export const PlaybackSpeedModalContainer = styled.View`
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: row;
  gap: 5px;
  padding: 5px 10px;
`;

export const PlaybackSpeedButton = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})<{
  isSelected?: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-radius: 5px;
  padding: 4px 0;
  width: 35px;
  background-color: ${({
    theme,
    isSelected,
  }: {
    theme: any;
    isSelected: boolean;
  }) =>
    isSelected
      ? theme.colors.buttonBackgroundSecondarySelected
      : theme.colors.buttonBackgroundSecondary};
`;

export const PlaybackSpeedValue = styled.Text.attrs({
  maxFontSizeMultiplier: 2,
})`
  color: ${({ theme }: { theme: any }) => theme.colors.textTertiary};
  font-size: 12px;
  font-weight: ${({ isSelected }: { isSelected: boolean }) =>
    isSelected ? 800 : 600};
`;
