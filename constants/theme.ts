/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1a1a2e',
    textSecondary: '#4a4a6a',
    background: '#F2EFE9',
    backgroundCard: '#ffffff',
    backgroundElevated: '#f0f2f8',
    tint: tintColorLight,
    tintLight: '#e8f4f8',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '#1a1a2e',
    borderLight: '#e8ecf4',
    success: '#22c55e',
    successLight: '#dcfce7',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#ef4444',
    errorLight: '#fee2e2',
    shadow: 'rgba(0, 0, 0, 0.15)',
    shadowStrong: 'rgba(0, 0, 0, 0.25)',
    yellow: '#FBDD5E',
    yellowLight: '#FEF3C7',
    teal: '#7DD3C6',
    tealLight: '#D5F5F0',
    pink: '#F9A8D4',
    pinkLight: '#FCE7F3',
    green: '#86EFAC',
    greenLight: '#DCFCE7',
    cream: '#F2EFE9',
    charcoal: '#1a1a2e',
    purple: '#C4B5FD',
    purpleLight: '#EDE9FE',
    orange: '#FDBA74',
    orangeLight: '#FFEDD5',
  },
  dark: {
    text: '#e8ecf4',
    textSecondary: '#9ca3af',
    background: '#1a1a2e',
    backgroundCard: '#2a2a44',
    backgroundElevated: '#252540',
    tint: tintColorDark,
    tintLight: 'rgba(255,255,255,0.08)',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#e8ecf4',
    borderLight: '#2a2a44',
    success: '#22c55e',
    successLight: 'rgba(34, 197, 94, 0.15)',
    warning: '#f59e0b',
    warningLight: 'rgba(245, 158, 11, 0.15)',
    error: '#ef4444',
    errorLight: 'rgba(239, 68, 68, 0.15)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowStrong: 'rgba(0, 0, 0, 0.5)',
    yellow: '#FBDD5E',
    yellowLight: 'rgba(251, 221, 94, 0.15)',
    teal: '#7DD3C6',
    tealLight: 'rgba(125, 211, 198, 0.15)',
    pink: '#F9A8D4',
    pinkLight: 'rgba(249, 168, 212, 0.15)',
    green: '#86EFAC',
    greenLight: 'rgba(134, 239, 172, 0.15)',
    cream: '#2a2a44',
    charcoal: '#e8ecf4',
    purple: '#C4B5FD',
    purpleLight: 'rgba(196, 181, 253, 0.15)',
    orange: '#FDBA74',
    orangeLight: 'rgba(253, 186, 116, 0.15)',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  full: 9999,
};