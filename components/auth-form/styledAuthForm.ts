import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background-color: #f8fafc;
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
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 0 8px;
`;

export const AuthButton = styled.TouchableOpacity`
  background-color: ${({ theme }: { theme: any }) => theme.colors.secondary};
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const AuthButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  padding: 5px 0;
`;

export const AuthLinkButton = styled.TouchableOpacity`
  margin-top: 16px;
  padding: 7px;
`;

export const AuthLinkText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.secondary};
  text-align: center;
  font-size: 16px;
`;
