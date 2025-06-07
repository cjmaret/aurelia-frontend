import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signIn" />
      <Stack.Screen name="signUp" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="change-email" />
      <Stack.Screen name="google-callback" />
    </Stack>
  );
}