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
  color: ${({ theme }: { theme: any }) => theme.colors.textTertiary};
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  margin-bottom: 10px;
  color: ${({ theme }: { theme: any }) => theme.colors.textTertiary};
  text-align: center;
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
  }) =>
    selected
      ? theme.colors.buttonPrimaryBackground
      : theme.colors.greySecondary};
  padding: 10px 20px;
  border-radius: 5px;
  margin-top: 20px;
`;

export const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 50px;
`;

const MoveButton = styled(SetupButton)`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.buttonPrimaryBackground};
  padding: 16px;
  border-radius: 7px;
  width: 130px;
`;

export const SaveButton = styled(MoveButton)``;

export const BackButton = styled(MoveButton)`
`;

export const ButtonText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.buttonPrimaryText};
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;
