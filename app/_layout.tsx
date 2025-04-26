import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from '@/utils/contexts/AuthContext';
import { CorrectionsDataProvider } from '@/utils/contexts/CorrectionsDataContext';
import { getTheme } from '@/utils/themes/ColorsThemeProvider';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import colors from '@/assets/globalStyles';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const colorScheme = useColorScheme();
  const theme: any = getTheme(colorScheme ?? 'light');

  console.log(theme)

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <CorrectionsDataProvider>
        <StyledThemeProvider theme={theme}>
          <SafeAreaProvider>
            <SafeAreaView
            // TODO: remember this is not connected to your styled theme
              style={{
                flex: 1,
                backgroundColor: colorScheme === 'dark' ? '#e8f6fc' : '#e8f6fc',
              }}
              edges={['top', 'left', 'right']}>
              <ThemeProvider
                value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
              </ThemeProvider>
              <StatusBar style="auto" />
            </SafeAreaView>
          </SafeAreaProvider>
        </StyledThemeProvider>
      </CorrectionsDataProvider>
    </AuthProvider>
  );
}
