import { router, Tabs } from 'expo-router';
import { HapticTab } from '@/components/base-rn-components/HapticTab';
import { Ionicons } from '@expo/vector-icons';
import styled, { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View, Text } from 'react-native';
import { useAuth } from '@/utils/contexts/AuthContext';

export default function TabLayout() {
  const theme: any = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();

  const LoginButtonContainer = styled.TouchableOpacity`
    background-color: ${theme.colors.buttonBackgroundPrimary};
    position: absolute;
    display: flex;
    top: 10px;
    right: 10px;
    z-index: 1000;
    padding-vertical: 10px;
    padding-horizontal: 20px;
    border-radius: 10px;
    shadow-radius: 2px;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
  `;

  const LoginButtonText = styled.Text`
    color: ${theme.colors.buttonPrimaryText};
    font-size: 12px;
    font-weight: bold;
  `;

  return (
    <View style={{ flex: 1 }}>
      {user?.isAnonymous && (
        <LoginButtonContainer onPress={() => router.replace('/signIn')}>
          <LoginButtonText>{t('login')}</LoginButtonText>
        </LoginButtonContainer>
      )}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.textSecondary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: theme.colors.tabBarBackground,
            borderTopWidth: 0,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: t('record'),
            tabBarIcon: ({ color }) => (
              <Ionicons name="mic-outline" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="grammarReviewTab"
          options={{
            title: t('grammarReview'),
            tabBarIcon: ({ color }) => (
              <Ionicons name="checkmark-done-outline" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profileTab"
          options={{
            title: t('profile'),
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-circle-outline" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
