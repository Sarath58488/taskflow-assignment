import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { COLORS, SPACING, RADIUS, FONTS } from '../utils/theme';

// ─── Button ────────────────────────────────────────────────────
export const Button = ({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  size = 'md',
  style,
}) => {
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';

  const bgColor = isOutline
    ? 'transparent'
    : isDanger
    ? COLORS.danger
    : COLORS.primary;

  const borderColor = isOutline ? COLORS.primary : isDanger ? COLORS.danger : 'transparent';
  const textColor = isOutline ? COLORS.primary : COLORS.textPrimary;
  const height = size === 'sm' ? 38 : size === 'lg' ? 54 : 46;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        {
          backgroundColor: bgColor,
          borderWidth: isOutline ? 1.5 : 0,
          borderColor,
          borderRadius: RADIUS.md,
          height,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: disabled ? 0.5 : 1,
          paddingHorizontal: SPACING.xl,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={{ color: textColor, fontSize: FONTS.sizes.md, fontWeight: '600' }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// ─── Badge ─────────────────────────────────────────────────────
export const Badge = ({ label, color, bg, size = 'sm' }) => (
  <View
    style={{
      backgroundColor: bg,
      borderRadius: RADIUS.full,
      paddingHorizontal: size === 'sm' ? SPACING.sm : SPACING.md,
      paddingVertical: size === 'sm' ? 3 : 5,
      alignSelf: 'flex-start',
    }}
  >
    <Text
      style={{
        color,
        fontSize: size === 'sm' ? FONTS.sizes.xs : FONTS.sizes.sm,
        fontWeight: '700',
        letterSpacing: 0.4,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Text>
  </View>
);

// ─── Card ──────────────────────────────────────────────────────
export const Card = ({ children, style }) => (
  <View
    style={[
      {
        backgroundColor: COLORS.bgCard,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
      },
      style,
    ]}
  >
    {children}
  </View>
);

// ─── EmptyState ────────────────────────────────────────────────
export const EmptyState = ({ icon, title, subtitle, action }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xxxl }}>
    <Text style={{ fontSize: 52, marginBottom: SPACING.lg }}>{icon || '📭'}</Text>
    <Text
      style={{
        color: COLORS.textPrimary,
        fontSize: FONTS.sizes.xl,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: SPACING.sm,
      }}
    >
      {title}
    </Text>
    {subtitle && (
      <Text
        style={{
          color: COLORS.textSecondary,
          fontSize: FONTS.sizes.md,
          textAlign: 'center',
          lineHeight: 22,
          marginBottom: SPACING.xl,
        }}
      >
        {subtitle}
      </Text>
    )}
    {action}
  </View>
);

// ─── LoadingScreen ─────────────────────────────────────────────
export const LoadingScreen = ({ message = 'Loading...' }) => (
  <View
    style={{
      flex: 1,
      backgroundColor: COLORS.bg,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={{ color: COLORS.textSecondary, marginTop: SPACING.md, fontSize: FONTS.sizes.md }}>
      {message}
    </Text>
  </View>
);

// ─── SectionHeader ─────────────────────────────────────────────
export const SectionHeader = ({ title, count, action }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.md,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
      <Text style={{ color: COLORS.textPrimary, fontSize: FONTS.sizes.lg, fontWeight: '700' }}>
        {title}
      </Text>
      {count !== undefined && (
        <View
          style={{
            backgroundColor: COLORS.primary + '33',
            borderRadius: RADIUS.full,
            paddingHorizontal: SPACING.sm,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: COLORS.primary, fontSize: FONTS.sizes.xs, fontWeight: '700' }}>
            {count}
          </Text>
        </View>
      )}
    </View>
    {action}
  </View>
);
