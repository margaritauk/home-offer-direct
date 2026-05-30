// iOS Human Interface Guidelines design tokens

export const Colors = {
  // Brand
  brand: '#2563EB',
  brandDark: '#1D4ED8',
  brandLight: '#EFF6FF',
  brandGradientStart: '#2563EB',
  brandGradientEnd: '#7C3AED',

  // iOS System Colors
  blue: '#007AFF',
  green: '#34C759',
  red: '#FF3B30',
  orange: '#FF9500',
  yellow: '#FFCC00',
  purple: '#AF52DE',
  teal: '#30B0C7',

  // Labels (dark mode aware but we're light-only)
  label: '#000000',
  secondaryLabel: '#6C6C70',
  tertiaryLabel: '#8A8A8E',
  quaternaryLabel: '#C7C7CC',

  // Fills
  systemFill: 'rgba(120,120,128,0.2)',
  secondarySystemFill: 'rgba(120,120,128,0.16)',

  // Backgrounds
  systemBackground: '#FFFFFF',
  secondarySystemBackground: '#F2F2F7',
  tertiarySystemBackground: '#FFFFFF',
  systemGroupedBackground: '#F2F2F7',
  secondarySystemGroupedBackground: '#FFFFFF',

  // Separators
  separator: 'rgba(60,60,67,0.29)',
  opaqueSeparator: '#C6C6C8',
} as const;

export const Typography = {
  // iOS type scale (SF Pro)
  largeTitle:   { fontSize: 34, fontWeight: '700' as const, letterSpacing: 0.37 },
  title1:       { fontSize: 28, fontWeight: '700' as const, letterSpacing: 0.36 },
  title2:       { fontSize: 22, fontWeight: '700' as const, letterSpacing: 0.35 },
  title3:       { fontSize: 20, fontWeight: '600' as const, letterSpacing: 0.38 },
  headline:     { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.41 },
  body:         { fontSize: 17, fontWeight: '400' as const, letterSpacing: -0.41 },
  callout:      { fontSize: 16, fontWeight: '400' as const, letterSpacing: -0.32 },
  subheadline:  { fontSize: 15, fontWeight: '400' as const, letterSpacing: -0.24 },
  footnote:     { fontSize: 13, fontWeight: '400' as const, letterSpacing: -0.08 },
  caption1:     { fontSize: 12, fontWeight: '400' as const, letterSpacing: 0 },
  caption2:     { fontSize: 11, fontWeight: '400' as const, letterSpacing: 0.07 },
} as const;

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,   // iOS standard margin
  xl:  20,
  xxl: 24,
  xxxl: 32,
  section: 36,
} as const;

export const Radius = {
  sm:  8,
  md:  10,
  lg:  12,
  xl:  16,
  xxl: 20,
  pill: 999,
} as const;

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;
