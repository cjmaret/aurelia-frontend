import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.backgroundSecondary};
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
  color: ${({ theme }: { theme: any }) => theme.colors.textSecondary};
`;

export const Input = styled.TextInput`
  min-height: 40px;
  width: 100%;
  border: 1px solid ${({ theme }: { theme: any }) => theme.colors.greySecondary};
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 0 8px;
  color: ${({ theme }: { theme: any }) => theme.colors.inputText};
`;

export const AuthButton = styled.TouchableOpacity`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.buttonPrimaryBackground};
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
`;

export const AuthButtonText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.buttonPrimaryText};
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  padding: 5px 0;
`;

export const AuthLinkButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  margin-top: 5px;
  padding: 5px 7px;
  opacity: ${({ disabled }: { disabled?: boolean }) => (disabled ? 0.5 : 1)};
`;

export const AuthLinkText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.buttonSecondaryText};
  text-align: center;
  font-size: 16px;
`;

export const PrivacyPolicyText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.buttonSecondaryText};
  font-size: 12px;
  text-align: center;
  margin-top: 35px;
  width: 70%;
  position: absolute;
  bottom: 50px;
`;

export const OAuthTextContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 30px 0 20px 0;
`;

export const OAuthTextBorder = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.greySecondary};
`;

export const OAuthText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.greyPrimary};
  font-size: 16px;
  text-align: center;
`;
