import styled from 'styled-components/native';

export const LoginButtonContainer = styled.TouchableOpacity`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.buttonBackgroundPrimary};
  position: absolute;
  display: flex;
  top: 10px;
  right: 10px;
  z-index: 1000;
  padding-vertical: 10px;
  padding-horizontal: 15px;
  border-radius: 10px;
  shadow-radius: 2px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
`;

export const LoginButtonText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.buttonTextPrimary};
  font-size: 13px;
  font-weight: bold;
`;
