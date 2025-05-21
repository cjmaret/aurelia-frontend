import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/utils/contexts/AuthContext';

export default function GoogleAuthCallback() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const url = new URL(window.location.href);
      const token = url.searchParams.get('token');

      if (token) {
        try {
          // await login(userEmail, password);
          router.replace('/');
        } catch (error) {
          console.error('Error handling Google auth callback:', error);
        }
      } else {
        console.error('No token found in the callback URL.');
      }
    };

    handleCallback();
  }, [login, router]);

  return null;
}
