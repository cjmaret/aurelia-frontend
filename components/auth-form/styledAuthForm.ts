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
`;

export const Input = styled.TextInput`
  height: 40px;
  width: 100%;
  border: 1px solid ${({ theme }: { theme: any }) => theme.colors.greySecondary};
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 0 8px;
`;

export const AuthButton = styled.TouchableOpacity`
  background-color: ${({ theme }: { theme: any }) => theme.colors.primary};
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const AuthButtonText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.textPrimary};
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  padding: 5px 0;
`;

export const AuthLinkButton = styled.TouchableOpacity<{disabled?: boolean}>`
  margin-top: 16px;
  padding: 7px;
  opacity: ${({ disabled }: { disabled?: boolean }) => (disabled ? 0.5 : 1)};
`;

export const AuthLinkText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.primary};
  text-align: center;
  font-size: 16px;
`;

export const PrivacyPolicyText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.primary};
  font-size: 12px;
  text-align: center;
  margin-top: 35px;
  width: 70%;
  position: absolute;
  bottom: 50px;
`;
