import React from 'react';
import { Button, Linking, Platform } from 'react-native';

export default function GoogleSignInButton() {
  const handleGoogleSignIn = async () => {
    try {
      const googleAuthUrl = 'http://192.168.1.95:8000/auth/login/google'; 
      Linking.openURL(googleAuthUrl);
    } catch (error) {
      console.error('Error initiating Google sign-in:', error);
    }
  };

  return <Button title="Sign in with Google" onPress={handleGoogleSignIn} />;
}
