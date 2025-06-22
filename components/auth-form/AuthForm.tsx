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
  OAuthText,
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
import {
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';

export default function AuthForm({ isSignUp = false }: AuthFormTypes) {
  const { showToast } = useToastModal();
  const { upgradeAnonymousUser, login, user, getUserDetails } = useAuth();
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
      showToast('error', t('loginFailed'), t('pleaseEnterEmailAndPassword'));
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        if (user?.isAnonymous) {
          console.log('Upgrading anonymous user...');
          await upgradeAnonymousUser({
            userEmail: normalizedEmail,
            password,
          });
        } else {
          console.log('Registering new user...');
          await api.registerUser(normalizedEmail, password);
        }
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

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    try {
      const appleAuthUrl = `${config.apiUrl}/auth/login/apple`;
      Linking.openURL(appleAuthUrl);
    } catch (error) {
      console.error('Error initiating Apple sign-in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled">
          <Container>
            <Title>{isSignUp ? t('signUp') : t('login')}</Title>
            <Input
              value={userEmail}
              onChangeText={setUserEmail}
              placeholder={t('email')}
              placeholderTextColor={theme.colors.inputPlaceholder}
            />
            <Input
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder={t('password')}
              placeholderTextColor={theme.colors.inputPlaceholder}
            />
            <AuthButton
              title={
                isLoading
                  ? isSignUp
                    ? t('signingUp')
                    : t('loggingIn')
                  : isSignUp
                  ? t('signUp')
                  : t('login')
              }
              onPress={handleSubmit}
              disabled={isLoading}>
              <AuthButtonText>
                {isSignUp ? t('signUp') : t('login')}
              </AuthButtonText>
            </AuthButton>
            {!isSignUp && (
              <>
                <AuthLinkButton
                  onPress={handlePasswordReset}
                  disabled={isLoading || !userEmail}>
                  <AuthLinkText>{t('forgotPasswordReset')}</AuthLinkText>
                </AuthLinkButton>
                <AuthLinkButton onPress={() => router.replace('/signUp')}>
                  <AuthLinkText>{t('newUserSignUp')}</AuthLinkText>
                </AuthLinkButton>
                {/* <OAuthTextContainer>
                  <OAuthTextBorder
                    style={{
                      marginRight: 8,
                    }}
                  />
                  <OAuthText>Or continue with</OAuthText>
                  <OAuthTextBorder
                    style={{
                      marginLeft: 8,
                    }}
                  />
                </OAuthTextContainer>
                <GoogleSignInButton handleGoogleSignIn={handleGoogleSignIn} />
                <AuthButton onPress={handleAppleSignIn} disabled={isLoading}>
                  <AuthButtonText>Sign in with Apple</AuthButtonText>
                </AuthButton> */}
              </>
            )}
            {isSignUp && (
              <>
                <AuthLinkButton onPress={() => router.replace('/signIn')}>
                  <AuthLinkText>{t('alreadyHaveAccountSignIn')}</AuthLinkText>
                </AuthLinkButton>
                <PrivacyPolicyText>
                  {t('byCreatingAccountYouAgree')}{' '}
                  <Link
                    href="https://www.aurelialabs.net/privacy-policy.html"
                    target="_blank"
                    style={{
                      color: theme.colors.buttonSecondaryText,
                      textDecorationLine: 'underline',
                    }}>
                    {t('privacyPolicy')}
                  </Link>
                </PrivacyPolicyText>
              </>
            )}
            {isLoading && <LoadingSpinner />}
          </Container>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
