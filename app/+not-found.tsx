import { useAuth } from '@/utils/contexts/AuthContext';
import { Stack, useRouter } from 'expo-router';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: #fff;
`;

const Emoji = styled.Text`
  font-size: 56px;
  margin-bottom: 12px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
  text-align: center;
`;

const HomeButton = styled.TouchableOpacity`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.primary};
  border-radius: 8px;
  padding: 12px 32px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
`;

export default function NotFoundScreen() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  const handleGoHome = () => {
    if (isAuthenticated) {
      router.replace('/');
    } else {
      router.replace('/signIn'); 
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Container>
        <Emoji>😬</Emoji>
        <Title>Page Not Found</Title>
        <Subtitle>
          Sorry, we couldn't find the page you were looking for.
        </Subtitle>
        <HomeButton onPress={handleGoHome}>
          <ButtonText>Go Home</ButtonText>
        </HomeButton>
      </Container>
    </>
  );
}
