import React, { useState } from 'react';
import { Alert, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Container,
  Title,
  Input,
  AuthLinkText,
  AuthButton,
  AuthButtonText,
  AuthLinkButton,
} from './styledAuthForm';
import { useAuth } from '@/utils/contexts/AuthContext';
import api from '@/lib/api';
import { AuthFormTypes } from '@/types/types';
import { useTheme } from 'styled-components/native';
import GoogleSignInButton from '../google-signin-button/GoogleSignInButton';

export default function AuthForm({ isSignUp = false }: AuthFormTypes) {
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
        Alert.alert(
          'Sign Up Successful',
          'You have successfully signed up! You can now log in.'
        );
        router.replace('/sign-in');
      } else {
        await login(normalizedEmail, password);
      }
    } catch (error: any) {
      Alert.alert(
        isSignUp ? 'Sign Up Failed' : 'Login Failed',
        error.message || 'An error occurred'
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
        <AuthLinkButton onPress={() => router.navigate('/sign-up')}>
          <AuthLinkText>New user? Sign up</AuthLinkText>
        </AuthLinkButton>
                {/* <GoogleSignInButton/> */}
        </>
      )}
      {isSignUp && (
        <AuthLinkButton onPress={() => router.navigate('/sign-in')}>
          <AuthLinkText>Already have an account? Sign in</AuthLinkText>
        </AuthLinkButton>
      )}
    </Container>
  );
}
