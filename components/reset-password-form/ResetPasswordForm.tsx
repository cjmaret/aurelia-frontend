import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '@/lib/api';
import { useToastModal } from '@/utils/contexts/ToastModalContext';
import {
  Container,
  Title,
  Input,
  AuthButton,
  AuthButtonText,
  AuthLinkButton,
  AuthLinkText,
} from '../auth-form/styledAuthForm';
import { useTheme } from 'styled-components/native';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  EyeIconContainer,
  PasswordInput,
  PasswordInputContainer,
} from '@/utils/generalStyles';
import { useTranslation } from 'react-i18next';

export default function ResetPasswordForm() {
  const { showToast } = useToastModal();
  const theme: any = useTheme();
  const { t } = useTranslation();
  const { userEmail } = useLocalSearchParams<{ userEmail: string }>();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    try {
      await api.resetPassword({ userEmail, code, newPassword });
      showToast('success', t('success'), t('passwordResetSuccess'));
      setTimeout(() => router.replace('/signIn'), 2000);
    } catch (err: any) {
      showToast('error', t('error'), t('passwordResetError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Container>
        <Title>{t('resetPassword')}</Title>
        <Input
          placeholder={t('enterVerificationCode')}
          placeholderTextColor={theme.colors.inputPlaceholder}
          value={code}
          onChangeText={setCode}
          editable={!loading}
          autoCapitalize="none"
          keyboardType="number-pad"
        />
        <PasswordInputContainer>
          <PasswordInput
            placeholder={t('enterNewPassword')}
            placeholderTextColor={theme.colors.inputPlaceholder}
            secureTextEntry={!showPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            editable={!loading}
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
          onPress={handleReset}
          disabled={loading || !newPassword || !code}>
          <AuthButtonText>{t('resetPassword')}</AuthButtonText>
        </AuthButton>
        <AuthLinkButton onPress={() => router.replace('/signIn')}>
          <AuthLinkText>{t('returnToLogin')}</AuthLinkText>
        </AuthLinkButton>
        {loading && <LoadingSpinner />}
      </Container>
    </TouchableWithoutFeedback>
  );
}
