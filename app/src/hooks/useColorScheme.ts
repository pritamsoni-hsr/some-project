import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * returns user preferred color scheme, and default to dark theme.
 * */
export const useColorScheme = () => {
  return useRNColorScheme() || 'dark';
};
