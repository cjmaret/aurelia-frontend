import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/utils/contexts/AuthContext';
import { useTheme } from 'styled-components/native';

export default function GoogleCallback() {
  const { accessToken, refreshToken } = useLocalSearchParams<{
    accessToken?: string;
    refreshToken?: string;
  }>();
  const theme: any = useTheme();
  const { getUserDetails, setIsAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function finishGoogleLogin() {
      if (accessToken && refreshToken) {
        await SecureStore.setItemAsync('accessToken', accessToken);
        await SecureStore.setItemAsync('refreshToken', refreshToken);

        await getUserDetails();
        setIsAuthenticated(true);
        router.replace('/');
      } else {
        router.replace('/signIn');
      }
    }
    finishGoogleLogin();
  }, [accessToken, refreshToken]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.backgroundSecondary,
      }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text
        style={{
          marginTop: 16,
          fontSize: 16,
          color: theme.colors.greyPrimary,
        }}>
        Signing you in with Google...
      </Text>
    </View>
  );
}
