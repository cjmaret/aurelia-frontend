import { Input } from '@/components/auth-form/styledAuthForm';
import styled from 'styled-components/native';

export const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
  padding: 10px 22px;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.buttonBackgroundPrimary};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BackButtonText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.buttonTextPrimary};
  font-size: 13px;
  font-weight: bold;
  text-align: center;
`;

// password input styles
export const PasswordInputContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  border-radius: 8px;
  min-height: 40px;
  border: 1px solid ${({ theme }: { theme: any }) => theme.colors.greySecondary};
`;

export const PasswordInput = styled.TextInput`
  flex: 1;
  height: 100%;
  padding: 0 8px;
  color: ${({ theme }: { theme: any }) => theme.colors.inputText};
`;

export const EyeIconContainer = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;