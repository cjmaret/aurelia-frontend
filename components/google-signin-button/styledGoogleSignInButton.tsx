import styled from 'styled-components/native';

export const GoogleButtonContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  gap: 5px;
  border: 1px solid ${({ theme }: { theme: any }) => theme.colors.buttonBorder};
  padding: 15px 55px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  color: ${({ theme }: { theme: any }) => theme.colors.buttonTextPrimary};
  width: 100%;
`;

export const GoogleButtonIcon = styled.Image`
  width: 30px;
  height: 30px;
  position: absolute;
  left: 45%;
`;

export const GoogleButtonText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.textTertiary};
  font-size: 18px;
  font-weight: bold;
  margin-right: 5px;
`;
