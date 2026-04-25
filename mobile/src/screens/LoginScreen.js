import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI';
import { COLORS, SPACING, RADIUS, FONTS } from '../utils/theme';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim().toLowerCase(), password);
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (type) => {
    if (type === 'admin') {
      setEmail('admin@taskmanager.com');
      setPassword('admin123');
    } else {
      setEmail('alice@taskmanager.com');
      setPassword('user123');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>✦ TaskFlow</Text>
          <Text style={styles.tagline}>Manage tasks. Ship faster.</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>
          <Text style={styles.cardSubtitle}>Welcome back. Enter your credentials.</Text>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button title="Sign In" onPress={handleLogin} loading={loading} style={{ marginTop: SPACING.sm }} />

          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            style={styles.switchLink}
          >
            <Text style={styles.switchText}>
              Don't have an account?{' '}
              <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Demo accounts */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>⚡ Demo Accounts</Text>
          <View style={styles.demoRow}>
            <TouchableOpacity style={styles.demoBtn} onPress={() => fillDemo('admin')}>
              <Text style={styles.demoBtnRole}>Admin</Text>
              <Text style={styles.demoBtnEmail}>admin@taskmanager.com</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoBtn} onPress={() => fillDemo('user')}>
              <Text style={styles.demoBtnRole}>User</Text>
              <Text style={styles.demoBtnEmail}>alice@taskmanager.com</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flexGrow: 1, padding: SPACING.xl, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: SPACING.xxxl },
  logo: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, marginTop: SPACING.xs },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  cardSubtitle: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, marginBottom: SPACING.xl },
  field: { marginBottom: SPACING.lg },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  eyeBtn: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  eyeIcon: { fontSize: 16 },
  switchLink: { alignItems: 'center', marginTop: SPACING.lg },
  switchText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
  demoSection: { marginTop: SPACING.xl },
  demoTitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  demoRow: { flexDirection: 'row', gap: SPACING.md },
  demoBtn: {
    flex: 1,
    backgroundColor: COLORS.bgElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
  },
  demoBtnRole: { color: COLORS.primary, fontSize: FONTS.sizes.sm, fontWeight: '700' },
  demoBtnEmail: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 2 },
});

export default LoginScreen;
