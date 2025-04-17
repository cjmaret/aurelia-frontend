import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/base-rn-components/HapticTab';
import { Ionicons } from '@expo/vector-icons';
import TabBarBackground from '@/components/base-rn-components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
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
