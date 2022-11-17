import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';

import { Theme } from '@react-navigation/native';
import { useTheme as useKittenTheme } from '@ui-kitten/components';

import { useColorScheme } from './useColorScheme';

type Spacing = {
  gap: number;
  roundness: number;
};

const useResponsiveSpacing = () => {
  const { width } = useWindowDimensions();
  const spacing: Spacing = useMemo(() => {
    // iphone se, mini
    if (width < 390) {
      return { roundness: 8, gap: 20 };
    }

    // iphone 12, 13, zenfone 9, pixel 4a, 5a, 6a
    if (width > 390 && width < 470) {
      return { roundness: 12, gap: 24 };
    }

    // giants, iphone pro, pixel 6, 7, samsumg note 10
    return { roundness: 14, gap: 30 };
  }, [width]);

  return spacing;
};

export const useTheme = () => {
  const spacing = useResponsiveSpacing();

  const theme: EvaTheme = useKittenTheme();
  const isDark = useColorScheme() === 'dark';
  const rnTheme: Theme = {
    dark: isDark,
    colors: {
      border: theme['border-basic-color-5'],
      background: theme['background-basic-color-1'],
      card: theme['background-basic-color-1'],
      notification: theme['text-info-active-color'],
      primary: theme['color-primary-default'],
      text: theme['text-basic-color'],
    },
  };

  return {
    ...rnTheme,
    theme,
    spacing: spacing,
    // responsive styles
    styles: StyleSheet.create({
      sides: {
        paddingHorizontal: spacing.gap,
      },
    }),
  };
};
