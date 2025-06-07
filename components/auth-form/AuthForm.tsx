import { useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import {
  Container,
  Title,
  Input,
  AuthLinkText,
  AuthButton,
  AuthButtonText,
  AuthLinkButton,
  PrivacyPolicyText,
  OAuthTextContainer,
  OAuthTextBorder,
} from './styledAuthForm';
import { useAuth } from '@/utils/contexts/AuthContext';
import api from '@/lib/api';
import { AuthFormTypes } from '@/types/types';
import { useTheme } from 'styled-components/native';
import GoogleSignInButton from '../google-signin-button/GoogleSignInButton';
import { useToastModal } from '@/utils/contexts/ToastModalContext';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';
import config from '@/lib/config';
import { Linking } from 'react-native';

export default function AuthForm({ isSignUp = false }: AuthFormTypes) {
  const { showToast } = useToastModal();
  const { login, getUserDetails } = useAuth();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const token = (params as { token?: string }).token;
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const theme: any = useTheme();

  const handleSubmit = async () => {
    const normalizedEmail = userEmail.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      showToast(
        'error',
        t('loginFailed'),
        t('Please enter both email and password.')
      );
      return;
    }

    setIsLoading(true);
    try {
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
      if (token) {
        try {
          await api.verifyEmail(token);
          showToast('success', t('success'), t('emailVerifiedSuccess'));
          await getUserDetails();
        } catch (err) {
          showToast('error', t('error'), t('emailVerifiedFailed'));
        }
      }
    } catch (error: any) {
      showToast(
        'error',
        isSignUp ? t('signUpFailed') : t('loginFailed'),
        error.message || t('unexpectedError')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      setIsLoading(true);
      await api.requestPasswordReset({
        userEmail: userEmail.trim().toLowerCase(),
      });
      showToast(
        'success',
        t('resetPasswordEmailSentTitle'),
        t('resetPasswordEmailSentMessage')
      );
    } catch (error: any) {
      showToast(
        'error',
        t('resetPasswordEmailFailed'),
        error.message || t('unexpectedError')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    console.log('Initiating Google sign-in...');
    try {
      const googleAuthUrl = `${config.apiUrl}/auth/login/google`;
      Linking.openURL(googleAuthUrl);
    } catch (error) {
      console.error('Error initiating Google sign-in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>{isSignUp ? 'Sign Up' : 'Login'}</Title>
      <Input
        value={userEmail}
        onChangeText={setUserEmail}
        placeholder="Email"
        placeholderTextColor={theme.colors.inputPlaceholder}
      />
      <Input
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
        placeholderTextColor={theme.colors.inputPlaceholder}
      />
      <AuthButton
        title={
          isLoading
            ? isSignUp
              ? 'Signing up...'
              : 'Logging in...'
            : isSignUp
            ? 'Sign Up'
            : 'Login'
        }
        onPress={handleSubmit}
        disabled={isLoading}>
        <AuthButtonText>{isSignUp ? 'Sign Up' : 'Login'}</AuthButtonText>
      </AuthButton>
      {!isSignUp && (
        <>
          <AuthLinkButton
            onPress={handlePasswordReset}
            disabled={isLoading || !userEmail}>
            <AuthLinkText>Forgot password? Reset</AuthLinkText>
          </AuthLinkButton>
          <AuthLinkButton onPress={() => router.replace('/signUp')}>
            <AuthLinkText>New user? Sign up</AuthLinkText>
          </AuthLinkButton>
          <OAuthTextContainer>
            <OAuthTextBorder
              style={{
                marginRight: 8,
              }}
            />
            <OAuthTextBorder>Or continue with</OAuthTextBorder>
            <OAuthTextBorder
              style={{
                marginLeft: 8,
              }}
            />
          </OAuthTextContainer>
          <GoogleSignInButton handleGoogleSignIn={handleGoogleSignIn} />
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
                color: theme.colors.buttonSecondaryText,
                textDecorationLine: 'underline',
              }}>
              Privacy Policy
            </Link>
          </PrivacyPolicyText>
        </>
      )}
      {isLoading && <LoadingSpinner />}
    </Container>
  );
}
