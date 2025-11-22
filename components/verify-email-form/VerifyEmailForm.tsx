import api from '@/lib/api';
import { useAuth } from '@/utils/contexts/AuthContext';
import { useToastModal } from '@/utils/contexts/ToastModalContext';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  AuthButton,
  AuthButtonText,
  AuthLinkButton,
  AuthLinkText,
  Container,
  Title,
  VerificationCodeInput,
} from '../auth-form/styledAuthForm';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

export default function VerifyEmailForm() {
  const { showToast } = useToastModal();
  const { isAuthenticated, getUserDetails, logout } = useAuth();
  const { newEmail } = useLocalSearchParams<{ newEmail: string }>();
  const { t } = useTranslation();
  const theme: any = useTheme();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmailChange = !!newEmail;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (isEmailChange) {
        await api.changeEmail({ newEmail, code });
        showToast('success', t('success'), t('emailChangedSuccess'));
        setTimeout(() => {
          logout();
        }, 3000);
      } else {
        await api.verifyEmail({ code });
        showToast('success', t('success'), t('emailVerifiedSuccess'));
        await getUserDetails();
        router.replace('/profileTab');
      }
    } catch (err: any) {
      showToast(
        'error',
        isEmailChange ? t('emailChangeFailed') : t('verificationFailed'),
        getVerifyEmailErrorMessage(err)
      );
    } finally {
      setLoading(false);
    }
  };

  function getVerifyEmailErrorMessage(err: any) {
    const msg = (err?.message || '').toLowerCase();

    if (msg.includes('already in use')) {
      return t('emailAlreadyInUse');
    }
    if (msg.includes('incorrect code') || msg.includes('expired code')) {
      return t('incorrectOrExpiredCode');
    }
    if (msg.includes('user not found')) {
      return t('userNotFoundOrUpdate');
    }
    if (msg.includes('invalid code')) {
      return t('invalidVerificationCode');
    }
    // fallback to status code if needed
    if (err?.status === 400) {
      return t('invalidRequest');
    }
    if (err?.status === 401) {
      return t('unauthorized');
    }
    if (err?.status === 404) {
      return t('userNotFound');
    }
    return t('pleaseTryAgain');
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Title>{t('enterVerificationCode')}</Title>
        <VerificationCodeInput
          placeholder={t('enterCodeSentToEmail')}
          placeholderTextColor={theme.colors.inputPlaceholder}
          value={code}
          onChangeText={setCode}
          editable={!loading}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="number-pad"
        />
        <AuthButton onPress={handleConfirm} disabled={loading || !code}>
          <AuthButtonText>
            {loading ? t('verifying') : t('verifyCode')}
          </AuthButtonText>
        </AuthButton>
        {isAuthenticated ? (
          <AuthLinkButton onPress={() => router.replace('/profileTab')}>
            <AuthLinkText>{t('returnToProfile')}</AuthLinkText>
          </AuthLinkButton>
        ) : (
          <AuthLinkButton onPress={() => router.replace('/signIn')}>
            <AuthLinkText>{t('returnToLogin')}</AuthLinkText>
          </AuthLinkButton>
        )}
      </Container>
    </TouchableWithoutFeedback>
  );
}
