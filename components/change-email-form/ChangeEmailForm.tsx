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
  Input,
  Title,
} from '../auth-form/styledAuthForm';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function ChangeEmailForm() {
  const { showToast } = useToastModal();
  const { logout } = useAuth();
  const { token } = useLocalSearchParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await api.changeEmail({ token, password });
      showToast('success', 'Email changed successfully!', 'Please log in.');
      setTimeout(() => {
        logout();
      }, 3000);
    } catch (err: any) {
      showToast(
        'error',
        'Error changing email',
        getChangeEmailErrorMessage(err)
      );
    } finally {
      setLoading(false);
    }
  };

  function getChangeEmailErrorMessage(err: any) {
    if (err?.status === 400) {
      return 'This email is already in use.';
    } else if (err?.status === 401) {
      return 'Incorrect password. Please try again.';
    } else if (err?.status === 404) {
      return 'User not found or could not update email.';
    } else if (err?.message) {
      return err.message;
    }
    return 'Please try again.';
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

    <Container>
      <Title>Verify Your Account</Title>
      <Input
        secureTextEntry
        placeholder="Account password"
        value={password}
        onChangeText={setPassword}
        editable={!loading}
        autoCapitalize="none"
        autoCorrect={false}
        />
      <AuthButton onPress={handleConfirm} disabled={loading || !password}>
        <AuthButtonText>
          {loading ? 'Verifying...' : 'Verify Account'}
        </AuthButtonText>
      </AuthButton>
      <AuthLinkButton onPress={() => router.replace('/signIn')}>
        <AuthLinkText>Return to Login</AuthLinkText>
      </AuthLinkButton>
    </Container>
        </TouchableWithoutFeedback>
  );
}
