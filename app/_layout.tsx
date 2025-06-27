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
import { ConversationDataProvider } from '@/utils/contexts/ConversationsDataContext';
import { getTheme } from '@/utils/themes/ColorsThemeProvider';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/utils/app-language-wrapper/i18n';
import LanguageUpdater from '@/utils/app-language-wrapper/LanguageUpdater';
import { ToastModalProvider } from '@/utils/contexts/ToastModalContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const colorScheme = useColorScheme();
  const theme: any = getTheme(colorScheme ?? 'light');

  function getActiveRouteName(state: any): string {
    if (!state || !state.routes || state.index === undefined) return 'default';
    const route = state.routes[state.index];

    // Drill down if nested state exists
    if (route.state) {
      return getActiveRouteName(route.state);
    }
    // Drill down if nested routes exist (React Navigation v6+)
    if (route.routes && typeof route.index === 'number') {
      return getActiveRouteName(route);
    }
    // Expo Router: check for params.screen or params.path
    if (route.params && (route.params.screen || route.params.path)) {
      return route.params.screen || route.params.path;
    }
    return route.name || 'default';
  }

  const currentRouteName = useNavigationState(getActiveRouteName);

  // background colors for pages
  const backgroundColors: Record<string, string> = {
    index: theme.colors.backgroundPrimary,
    grammarReviewTab: theme.colors.backgroundPrimary,
    profileTab: theme.colors.backgroundSecondary,
    signIn: theme.colors.backgroundSecondary,
    signUp: theme.colors.backgroundSecondary,
    setupTab: theme.colors.backgroundSecondary,
    '(setup)': theme.colors.backgroundSecondary,
    '(tabs)': theme.colors.backgroundPrimary,
    '+not-found': theme.colors.backgroundSecondary,
    'reset-password': theme.colors.backgroundSecondary,
    'verify-email': theme.colors.backgroundSecondary,
    'google-callback': theme.colors.backgroundSecondary,
    '(auth)': theme.colors.backgroundSecondary,
    default: theme.colors.backgroundPrimary,
    welcomeTab: theme.colors.backgroundTertiary,
  };

  const backgroundColor =
    backgroundColors[currentRouteName] || theme.colors.backgroundPrimary;

  useEffect(() => {
    const hideSplash = async () => {
      if (loaded) {
        await SplashScreen.hideAsync();
      }
    };
    hideSplash();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StyledThemeProvider theme={theme}>
        <ToastModalProvider>
          <AuthProvider>
            <ConversationDataProvider>
              <SafeAreaProvider>
                <I18nextProvider i18n={i18n}>
                  <LanguageUpdater>
                    <SafeAreaView
                      style={{
                        flex: 1,
                        backgroundColor: backgroundColor,
                      }}
                      edges={['top', 'left', 'right']}>
                      <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen
                          name="(tabs)"
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen name="+not-found" />
                      </Stack>
                      <StatusBar style="auto" />
                    </SafeAreaView>
                  </LanguageUpdater>
                </I18nextProvider>
              </SafeAreaProvider>
            </ConversationDataProvider>
          </AuthProvider>
        </ToastModalProvider>
      </StyledThemeProvider>
    </ThemeProvider>
  );
}
