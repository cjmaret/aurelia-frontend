import config from '@/lib/config';
import React from 'react';
import { Button, Linking, Platform } from 'react-native';

export default function GoogleSignInButton() {
  const handleGoogleSignIn = async () => {
    try {
      const googleAuthUrl = `${config.apiUrl}/auth/login/google`;
      Linking.openURL(googleAuthUrl);
    } catch (error) {
      console.error('Error initiating Google sign-in:', error);
    }
  };

  return <Button title="Sign in with Google" onPress={handleGoogleSignIn} />;
}
