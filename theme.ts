export const colors = {
  dark: {
    background: '#0A0A0A',
    surface: '#1A1A1A',
    surfaceElevated: '#242424',
    primary: '#FFB000',
    primaryDim: '#CC8D00',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#707070',
    border: '#2A2A2A',
    error: '#FF4444',
    success: '#00CC66',
  },
  light: {
    background: '#F5EFE3',
    surface: '#FFFFFF',
    surfaceElevated: '#FEFEFE',
    primary: '#B06E16',
    primaryDim: '#8A5611',
    text: '#1A1A1A',
    textSecondary: '#4A4A4A',
    textTertiary: '#7A7A7A',
    border: '#E0D5C9',
    error: '#CC0000',
    success: '#008844',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;
