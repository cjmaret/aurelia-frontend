import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import {
  Container,
  Title,
  Input,
  AuthLinkText,
  AuthButton,
  AuthButtonText,
  AuthLinkButton,
  PrivacyPolicyText,
} from './styledAuthForm';
import { useAuth } from '@/utils/contexts/AuthContext';
import api from '@/lib/api';
import { AuthFormTypes } from '@/types/types';
import { useTheme } from 'styled-components/native';
import GoogleSignInButton from '../google-signin-button/GoogleSignInButton';
import { useToastModal } from '@/utils/contexts/ToastModalContext';
import { useTranslation } from 'react-i18next';

export default function AuthForm({ isSignUp = false }: AuthFormTypes) {
  const { showToast } = useToastModal();
  const { t } = useTranslation();
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const theme: any = useTheme();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const normalizedEmail = userEmail.trim().toLowerCase();

      if (isSignUp) {
        await api.registerUser(normalizedEmail, password);
        showToast(
          'success',
          t('signUpSuccessTitle'),
          t('signUpSuccessMessage')
        );
        router.replace('/signIn');
      } else {
        await login(normalizedEmail, password);
      }
    } catch (error: any) {
      showToast(
        'error',
        isSignUp ? t('signUpFailed') : t('loginFailed'),
        error.message || t('unexpectedError')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>{isSignUp ? 'Sign Up' : 'Login'}</Title>
      <Input
        value={userEmail}
        onChangeText={setUserEmail}
        placeholder="Email"
        placeholderTextColor={theme.colors.placeholderText}
      />
      <Input
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
        placeholderTextColor={theme.colors.placeholderText}
      />
      <AuthButton
        title={
          loading
            ? isSignUp
              ? 'Signing up...'
              : 'Logging in...'
            : isSignUp
            ? 'Sign Up'
            : 'Login'
        }
        onPress={handleSubmit}
        disabled={loading}>
        <AuthButtonText>{isSignUp ? 'Sign Up' : 'Login'}</AuthButtonText>
      </AuthButton>
      {!isSignUp && (
        <>
          <AuthLinkButton onPress={() => router.replace('/signUp')}>
            <AuthLinkText>New user? Sign up</AuthLinkText>
          </AuthLinkButton>
          {/* <GoogleSignInButton/> */}
        </>
      )}
      {isSignUp && (
        <>
          <AuthLinkButton onPress={() => router.replace('/signIn')}>
            <AuthLinkText>Already have an account? Sign in</AuthLinkText>
          </AuthLinkButton>
          <PrivacyPolicyText>
            By creating an account, you agree to our{' '}
            <Link
              href="https://www.aurelialabs.net/privacy-policy.html"
              target="_blank"
              style={{
                color: theme.colors.primary,
                textDecorationLine: 'underline',
              }}>
              Privacy Policy
            </Link>
          </PrivacyPolicyText>
        </>
      )}
    </Container>
  );
}
