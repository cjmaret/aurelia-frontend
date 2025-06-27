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
  OAuthTextContainer,
  OAuthTextBorder,
  OAuthText,
} from './styledAuthForm';
import { BackButton, BackButtonText, EyeIconContainer, PasswordInput, PasswordInputContainer } from '@/utils/generalStyles';
import { useAuth } from '@/utils/contexts/AuthContext';
import api from '@/lib/api';
import { AuthFormType } from '@/types/types';
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
import { Ionicons } from '@expo/vector-icons';

export default function AuthForm({ isSignUp = false }: AuthFormType) {
  const { showToast } = useToastModal();
  const { upgradeAnonymousUser, login, isAuthenticated, user } = useAuth();
  const { t } = useTranslation();
  const theme: any = useTheme();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    const normalizedEmail = userEmail.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      showToast(
        'error',
        isSignUp ? t('signUpFailed') : t('loginFailed'),
        t('pleaseEnterEmailAndPassword')
      );
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
      router.replace({
        pathname: '/reset-password',
        params: { userEmail },
      });
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
            {isAuthenticated && user?.isAnonymous && (
              <BackButton onPress={() => router.replace('/')}>
                <BackButtonText>Back</BackButtonText>
              </BackButton>
            )}
            <Title>{isSignUp ? t('signUp') : t('login')}</Title>
            <Input
              value={userEmail}
              onChangeText={setUserEmail}
              placeholder={t('email')}
              placeholderTextColor={theme.colors.inputPlaceholder}
            />
            <PasswordInputContainer>
              <PasswordInput
                placeholder={t('password')}
                placeholderTextColor={theme.colors.inputPlaceholder}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
                autoCapitalize="none"
              />
              <EyeIconContainer
                onPress={() => setShowPassword((prev) => !prev)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={24}
                  color={theme.colors.inputPlaceholder}
                />
              </EyeIconContainer>
            </PasswordInputContainer>
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
                      color: theme.colors.buttonTextSecondary,
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
