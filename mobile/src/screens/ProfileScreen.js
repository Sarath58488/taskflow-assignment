import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Card, Button } from '../components/UI';
import { COLORS, SPACING, RADIUS, FONTS } from '../utils/theme';

const ProfileScreen = () => {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Avatar area */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>{(user?.name || '?')[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <View style={[styles.roleBadge, isAdmin && styles.roleBadgeAdmin]}>
          <Text style={[styles.roleText, isAdmin && styles.roleTextAdmin]}>
            {isAdmin ? '👑 Admin' : '👤 Member'}
          </Text>
        </View>
      </View>

      {/* Info card */}
      <Card style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Account Info</Text>
        <InfoRow label="Full Name" value={user?.name || '—'} />
        <View style={styles.divider} />
        <InfoRow label="Email" value={user?.email || '—'} />
        <View style={styles.divider} />
        <InfoRow label="Role" value={isAdmin ? 'Administrator' : 'Team Member'} />
        <View style={styles.divider} />
        <InfoRow label="User ID" value={user?.id?.slice(-8).toUpperCase() || '—'} />
      </Card>

      {/* Permissions card */}
      <Card style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Permissions</Text>
        {[
          { label: 'View assigned tasks', allowed: true },
          { label: 'Update task status', allowed: true },
          { label: 'Create new tasks', allowed: isAdmin },
          { label: 'Assign tasks to users', allowed: isAdmin },
          { label: 'View all tasks', allowed: isAdmin },
          { label: 'Delete tasks', allowed: isAdmin },
        ].map(({ label, allowed }) => (
          <View key={label} style={styles.permRow}>
            <Text style={[styles.permIcon, { color: allowed ? COLORS.success : COLORS.textMuted }]}>
              {allowed ? '✓' : '✗'}
            </Text>
            <Text style={[styles.permLabel, !allowed && { color: COLORS.textMuted }]}>{label}</Text>
          </View>
        ))}
      </Card>

      {/* Logout */}
      <Button
        title="Sign Out"
        variant="danger"
        onPress={handleLogout}
        style={{ marginTop: SPACING.md }}
        size="lg"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  avatarSection: { alignItems: 'center', paddingVertical: SPACING.xl },
  avatarLarge: {
    width: 80, height: 80, borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary + '33',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarLargeText: { color: COLORS.primary, fontSize: FONTS.sizes.xxxl, fontWeight: '800' },
  userName: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xxl, fontWeight: '800', marginBottom: SPACING.sm },
  roleBadge: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleBadgeAdmin: { backgroundColor: COLORS.primary + '22', borderColor: COLORS.primary },
  roleText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, fontWeight: '600' },
  roleTextAdmin: { color: COLORS.primary },
  infoCard: { marginBottom: SPACING.md },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.xs },
  infoLabel: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
  infoValue: { color: COLORS.textPrimary, fontSize: FONTS.sizes.sm, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.xs },
  permRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.xs },
  permIcon: { fontSize: FONTS.sizes.md, fontWeight: '700', width: 20 },
  permLabel: { color: COLORS.textPrimary, fontSize: FONTS.sizes.sm },
});

export default ProfileScreen;
