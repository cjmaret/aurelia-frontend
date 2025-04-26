import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/base-rn-components/HapticTab';
import { Ionicons } from '@expo/vector-icons';
import TabBarBackground from '@/components/base-rn-components/ui/TabBarBackground';
import { useTheme } from 'styled-components/native';

export default function TabLayout() {
  const theme = useTheme();

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
          title: 'Record',
          tabBarIcon: ({ color }) => (
            <Ionicons name="mic-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="errorReviewTab"
        options={{
          title: 'Grammar Review',
          tabBarIcon: ({ color }) => (
            <Ionicons name="checkmark-done-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profileTab"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
