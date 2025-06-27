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
