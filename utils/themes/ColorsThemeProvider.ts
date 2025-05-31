import { Colors } from '@/constants/Colors';

export const getTheme = (colorScheme: 'light' | 'dark') => ({
  mode: colorScheme,
  colors: Colors[colorScheme],
});
