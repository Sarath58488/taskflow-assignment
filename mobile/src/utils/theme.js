export const COLORS = {
  // Core palette — deep navy/slate dark theme
  bg: '#0B0C1E',
  bgCard: '#13152B',
  bgElevated: '#1A1D35',
  bgInput: '#0F1124',

  primary: '#6C63FF',
  primaryLight: '#8B85FF',
  primaryDark: '#4A42CC',

  accent: '#00D4AA',
  accentLight: '#33DDB8',

  danger: '#FF4D6D',
  warning: '#FFB830',
  success: '#00D4AA',
  info: '#4CA3FF',

  textPrimary: '#F0F0FA',
  textSecondary: '#9999BB',
  textMuted: '#5C5C7A',

  border: '#1E2040',
  borderLight: '#2A2D50',

  // Status colors
  statusPending: '#FFB830',
  statusInProgress: '#4CA3FF',
  statusCompleted: '#00D4AA',

  // Priority colors
  priorityHigh: '#FF4D6D',
  priorityMedium: '#FFB830',
  priorityLow: '#4CA3FF',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

export const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: COLORS.statusPending,
    bg: 'rgba(255, 184, 48, 0.12)',
    icon: '⏳',
  },
  in_progress: {
    label: 'In Progress',
    color: COLORS.statusInProgress,
    bg: 'rgba(76, 163, 255, 0.12)',
    icon: '🔄',
  },
  completed: {
    label: 'Completed',
    color: COLORS.statusCompleted,
    bg: 'rgba(0, 212, 170, 0.12)',
    icon: '✅',
  },
};

export const PRIORITY_CONFIG = {
  high: {
    label: 'High',
    color: COLORS.priorityHigh,
    bg: 'rgba(255, 77, 109, 0.12)',
  },
  medium: {
    label: 'Medium',
    color: COLORS.priorityMedium,
    bg: 'rgba(255, 184, 48, 0.12)',
  },
  low: {
    label: 'Low',
    color: COLORS.priorityLow,
    bg: 'rgba(76, 163, 255, 0.12)',
  },
};
