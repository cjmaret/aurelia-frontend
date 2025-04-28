import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.backgroundSecondary};
  padding: 16px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: ${({ theme }: { theme: any }) => theme.colors.greyTertiary};
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  margin-bottom: 10px;
  color: ${({ theme }: { theme: any }) => theme.colors.greyQuarternary};
`;

export const ListContainer = styled.View`
  max-height: 300px;
`;

const SetupButton = styled.TouchableOpacity``;

export const LanguageButton = styled(SetupButton)<{ selected: boolean }>`
  background-color: ${({
    theme,
    selected,
  }: {
    theme: any;
    selected: boolean;
  }) => (selected ? theme.colors.primary : theme.colors.greySecondary)};
  padding: 10px 20px;
  border-radius: 5px;
  margin-top: 20px;
`;

export const SaveButton = styled(SetupButton)`
  background-color: ${({ theme }: { theme: any }) => theme.colors.primary};
  padding: 16px;
  border-radius: 7px;
`;

export const ButtonText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.textPrimary};
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;
