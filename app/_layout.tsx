import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  useNavigationState,
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
import { I18nextProvider } from 'react-i18next';
import i18n from '@/utils/app-language-wrapper/i18n';
import LanguageUpdater from '@/utils/app-language-wrapper/LanguageUpdater';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const colorScheme = useColorScheme();
  const theme: any = getTheme(colorScheme ?? 'light');

  const currentRouteName = useNavigationState((state) => {
    if (!state || !state.routes || state.index === undefined) {
      return 'default';
    }

    const route = state.routes[state.index];

    // checking nested routes
    if (route.state && route.state.routes && route.state.index !== undefined) {
      const childRoute = route.state.routes[route.state.index];
      return childRoute?.name || 'default';
    }

    return route?.name || 'default';
  });

  // background colors for pages
  const backgroundColors: Record<string, string> = {
    index: theme.colors.backgroundPrimary,
    errorReviewTab: theme.colors.backgroundPrimary,
    profileTab: theme.colors.backgroundSecondary,
    default: theme.colors.backgroundSecondary,
  };

  const backgroundColor =
    backgroundColors[currentRouteName] || theme.colors.backgroundSecondary;

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
            <I18nextProvider i18n={i18n}>
              <LanguageUpdater>
                <SafeAreaView
                  // TODO: remember this is not connected to your styled theme
                  style={{
                    flex: 1,
                    backgroundColor,
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
              </LanguageUpdater>
            </I18nextProvider>
          </SafeAreaProvider>
        </StyledThemeProvider>
      </CorrectionsDataProvider>
    </AuthProvider>
  );
}
