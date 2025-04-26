import styled from 'styled-components/native';

export const ErrorMessageContainer = styled.View`
  padding: 16px;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.snippetErrorBackground};
  border-radius: 8px;
  margin: 16px 0;
  align-items: center;
  justify-content: center;
`;

export const ErrorMessageText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.snippetErrorText};
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;
