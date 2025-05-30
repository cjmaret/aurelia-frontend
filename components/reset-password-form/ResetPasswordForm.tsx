import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
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
import { LoadingOverlay } from '../profile/styledProfile';
import { useTheme } from 'styled-components/native';

export default function ResetPasswordForm() {
  const { showToast } = useToastModal();
  const theme: any = useTheme();
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    try {
      await api.resetPassword({ token, newPassword });
      showToast('success', 'Password reset successful!', 'Please log in.');
      setTimeout(() => router.replace('/signIn'), 2000);
    } catch (err: any) {
      showToast('error', 'Error resetting password', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Reset Password</Title>
      <Input
        secureTextEntry
        placeholder="Enter new password"
        value={newPassword}
        onChangeText={setNewPassword}
        editable={!loading}
        autoCapitalize="none"
      />
      <AuthButton onPress={handleReset} disabled={loading || !newPassword}>
        <AuthButtonText>Reset Password</AuthButtonText>
      </AuthButton>
      <AuthLinkButton onPress={() => router.replace('/signIn')}>
        <AuthLinkText>Back to Login</AuthLinkText>
      </AuthLinkButton>
      {loading && (
        <LoadingOverlay>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadingOverlay>
      )}
    </Container>
  );
}
