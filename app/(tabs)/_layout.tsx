import { Tabs } from 'expo-router';
import { HapticTab } from '@/components/base-rn-components/HapticTab';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const theme: any = useTheme();
  const { t } = useTranslation();

  return (
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
  );
}
