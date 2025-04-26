import { Colors } from '@/constants/Colors';

export const getTheme = (colorScheme: 'light' | 'dark') => ({
  colors: Colors[colorScheme],
});
