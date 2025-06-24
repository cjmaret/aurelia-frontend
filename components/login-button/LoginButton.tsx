import { useAuth } from '@/utils/contexts/AuthContext';
import { router } from 'expo-router';
import { LoginButtonContainer, LoginButtonText } from './styledLoginButton';
import { useTranslation } from 'react-i18next';

export default function LoginButton() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user?.isAnonymous) return null;
  
  return (
    <LoginButtonContainer onPress={() => router.replace('/signUp')}>
      <LoginButtonText>{t('createAccount')}</LoginButtonText>
    </LoginButtonContainer>
  );
}
