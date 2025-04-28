import styled from 'styled-components/native';

export const ScrollView = styled.ScrollView`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.backgroundSecondary};
`;

export const Container = styled.View`
  flex: 1;
  padding: 25px 0 100px 0;
`;

export const Header = styled.View`
  align-items: center;
  margin-bottom: 24px;
`;

export const ProfilePicture = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 16px;
`;

export const Name = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
`;

export const Section = styled.View`
  margin-bottom: 24px;
`;

export const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

export const Input = styled.TextInput`
  height: 40px;
  border: 1px solid ${({ theme }: { theme: any }) => theme.colors.greySecondary};
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 0 8px;
`;

export const Stat = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const StatLabel = styled.Text`
  font-size: 16px;
  color: ${({ theme }: { theme: any }) => theme.colors.greySecondary};
`;

export const StatValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

export const LanguagePickerWrapper = styled.View`
  height: 40px;
  border: 1px solid ${({ theme }: { theme: any }) => theme.colors.greySecondary};
  border-radius: 8px;
  margin-bottom: 16px;
  justify-content: center;
  padding: 0 8px;
`;

export const DropdownButton = styled.TouchableOpacity`
  height: 100%;
  justify-content: center;
`;

export const DropdownButtonText = styled.Text`
  font-size: 16px;
  color: ${({ theme }: { theme: any }) => theme.colors.textTertiary};
`;

export const SaveButton = styled.Button`
  margin-top: 16px;
`;

export const LogoutButton = styled.TouchableOpacity`
  margin-top: 16px;
  padding: 12px;
  background-color: ${({ theme }: { theme: any }) => theme.colors.primary};
  border-radius: 8px;
  align-items: center;
`;

export const LogoutButtonText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.textPrimary};
  font-size: 16px;
  font-weight: bold;
`;

export const ModalOverlay = styled.TouchableOpacity`
  flex: 1;
  background-color: ${({ theme }: { theme: any }) => theme.colors.modalOverlay};
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  width: 80%;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.backgroundSecondary};
  border-radius: 8px;
  padding: 16px;
`;

export const ModalItem = styled.TouchableOpacity`
  padding: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: { theme: any }) =>
    theme.colors.greySecondary};
`;
