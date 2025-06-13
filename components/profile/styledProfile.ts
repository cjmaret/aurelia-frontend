import { Platform } from 'react-native';
import styled from 'styled-components/native';

const isTablet = Platform.OS === 'ios' && Platform.isPad;

export const ScrollView = styled.ScrollView`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.backgroundSecondary};
`;

export const Container = styled.View`
  flex: 1;
  padding: 25px 0 50px 0;
  margin: ${isTablet ? '0 10%' : '0'};
`;

export const Header = styled.View`
  align-items: center;
  margin-bottom: 24px;
`;

export const ProfilePicture = styled.Image`
  width: 125px;
  height: 125px;
  padding: 5px;
  border-radius: 125px;
  margin-bottom: 16px;

  /* Add shadow for 3D effect */
  shadow-color: #000;
  shadow-offset: 0 4px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
`;

export const UsernameGroup = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  position: relative;
  padding: 0 25px;
`;

export const Name = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }: { theme: any }) => theme.colors.textSecondary};
  justify-self: center;
  flex-wrap: wrap;
`;

export const IconWrapper = styled.View`
  justify-self: flex-end;
  position: absolute;
  right: 0;
`;

export const ProfileInfoSection = styled.View`
  margin-bottom: 24px;
`;

export const SubSection = styled.View``;

export const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin: 24px 0 16px 0;
  color: ${({ theme }: { theme: any }) => theme.colors.primary};
  flex-wrap: wrap;
`;

export const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: ${({ theme }: { theme: any }) => theme.colors.textTertiary};
  flex-wrap: wrap;
`;

export const Input = styled.TextInput<{ disabled?: boolean }>`
  min-height: 40px;
  border: 1px solid ${({ theme }: { theme: any }) => theme.colors.inputBorder};
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 0 8px;
  color: ${({ disabled, theme }: { disabled?: boolean; theme: any }) =>
    disabled ? theme.colors.textDisabled : theme.colors.inputText};
  background-color: ${({
    disabled,
    theme,
  }: {
    disabled?: boolean;
    theme: any;
  }) =>
    disabled ? theme.colors.backgroundDisabled : theme.colors.inputBackground};
  flex-wrap: wrap;
`;

export const Stat = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

export const StatLabel = styled.Text`
  font-size: 16px;
  color: ${({ theme }: { theme: any }) => theme.colors.greyPrimary};
  flex-wrap: wrap;
`;

export const StatValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }: { theme: any }) => theme.colors.textTertiary};
  flex-wrap: wrap;
`;

export const LanguagePickerWrapper = styled.View`
  height: 40px;
  max-height: 100px;
  border: 1px solid ${({ theme }: { theme: any }) => theme.colors.greySecondary};
  border-radius: 8px;
  margin-bottom: 16px;
  justify-content: center;
  padding: 0 8px;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.inputBackground};
`;

export const DropdownButton = styled.TouchableOpacity`
  height: 100%;
  justify-content: center;
`;

export const DropdownButtonText = styled.Text`
  font-size: 16px;
  color: ${({ theme }: { theme: any }) => theme.colors.inputText};
  flex-wrap: wrap;
`;

export const ProfileButton = styled.TouchableOpacity`
  padding: 12px;
`;

export const SaveButton = styled(ProfileButton)`
  padding: 0;
  align-self: center;
  margin-bottom: 16px;
`;

export const SaveButtonText = styled.Text<{ disabled: boolean }>`
  color: ${({ theme, disabled }: { theme: any; disabled: boolean }) =>
    disabled ? theme.colors.greySecondary : theme.colors.primary};
  font-size: 16px;
  font-weight: bold;
  flex-wrap: wrap;
`;

export const VerifyEmailSaveButtonText = styled(SaveButtonText)`
  font-size: 14px;
  flex-wrap: wrap;
`;

export const LogoutButton = styled(ProfileButton)`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.buttonPrimaryBackground};
  border-radius: 8px;
  align-items: center;
  margin-top: 50px;
`;

export const LogoutButtonText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.buttonPrimaryText};
  font-size: 16px;
  font-weight: bold;
  flex-wrap: wrap;
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

export const DeleteUserSubsection = styled(SubSection)`
  margin-top: 60px;
`;

export const DeleteUserButton = styled.TouchableOpacity`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.buttonDangerBackground};
  border-radius: 8px;
  padding: 12px;
  align-items: center;
  margin-top: 20px;
`;

export const DeleteUserButtonText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.buttonDangerText};
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding: 0 16px;
  flex-wrap: wrap;
`;

export const GoogleEmailNotificationText = styled.Text`
  font-size: 13px;
  color: ${({ theme }: { theme: any }) => theme.colors.textDisabled};
  text-align: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;
