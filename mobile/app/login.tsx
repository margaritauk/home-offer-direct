import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/lib/auth';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';

const TEST_ACCOUNTS = [
  { email: 'free@test.com',    label: 'Alex Chen — Free tier' },
  { email: 'basic@test.com',   label: 'Sam Rivera — Basic tier' },
  { email: 'premium@test.com', label: 'Jordan Taylor — Premium tier' },
];

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)/search');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Login failed');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const fillTest = (acct: typeof TEST_ACCOUNTS[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEmail(acct.email);
    setPassword('test123');
    setError('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoRow}>
            <LinearGradient
              colors={[Colors.brandGradientStart, Colors.brandGradientEnd]}
              style={styles.logoIcon}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <Text style={styles.logoIconText}>H</Text>
            </LinearGradient>
            <Text style={styles.logoText}>
              HomeOffer<Text style={{ color: Colors.brand }}>Direct</Text>
            </Text>
          </View>

          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue your offers</Text>

          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              placeholderTextColor={Colors.quaternaryLabel}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              returnKeyType="next"
            />
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <Text style={styles.forgot}>Forgot?</Text>
            </View>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={Colors.quaternaryLabel}
                secureTextEntry={!showPass}
                autoCapitalize="none"
                autoComplete="password"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <Pressable style={styles.eyeBtn} onPress={() => setShowPass(s => !s)}>
                <Text style={styles.eyeText}>{showPass ? '🙈' : '👁'}</Text>
              </Pressable>
            </View>
          </View>

          {/* Sign In */}
          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.brandGradientStart, Colors.brandGradientEnd]}
              style={styles.primaryBtnGradient}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.primaryBtnText}>Sign In</Text>
              }
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* OAuth */}
          <View style={styles.oauthRow}>
            {['G  Google', '🍎  Apple'].map(label => (
              <TouchableOpacity
                key={label}
                style={styles.oauthBtn}
                onPress={() => setError('OAuth requires credentials in .env — use test account below')}
                activeOpacity={0.7}
              >
                <Text style={styles.oauthText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Test accounts */}
          <View style={styles.testBox}>
            <Text style={styles.testTitle}>Test accounts (password: test123)</Text>
            {TEST_ACCOUNTS.map(acct => (
              <TouchableOpacity key={acct.email} style={styles.testRow} onPress={() => fillTest(acct)}>
                <Text style={styles.testEmail}>{acct.email}</Text>
                <Text style={styles.testLabel}>{acct.label.split('—')[1].trim()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>No account? </Text>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Sign up free</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.systemGroupedBackground },
  scroll: { padding: Spacing.lg, paddingBottom: 48 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 40, marginTop: 8 },
  logoIcon: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  logoIconText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  logoText: { fontSize: 22, fontWeight: '700', color: Colors.label },
  title: { ...Typography.title1, color: Colors.label, marginBottom: 6 },
  subtitle: { ...Typography.callout, color: Colors.secondaryLabel, marginBottom: 28 },
  errorBox: {
    backgroundColor: '#FEF2F2', borderRadius: Radius.md, padding: Spacing.md,
    marginBottom: Spacing.lg, borderWidth: 1, borderColor: '#FECACA',
  },
  errorText: { ...Typography.footnote, color: '#DC2626' },
  fieldGroup: { marginBottom: Spacing.lg },
  label: { ...Typography.subheadline, fontWeight: '500', color: Colors.label, marginBottom: 8 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  forgot: { ...Typography.footnote, color: Colors.brand },
  input: {
    backgroundColor: Colors.systemBackground,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Typography.body,
    color: Colors.label,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.opaqueSeparator,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: { padding: 12 },
  eyeText: { fontSize: 18 },
  primaryBtn: { borderRadius: Radius.xl, overflow: 'hidden', marginTop: 8, marginBottom: Spacing.xl },
  primaryBtnGradient: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { ...Typography.headline, color: '#fff' },
  btnDisabled: { opacity: 0.6 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: Spacing.lg },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.opaqueSeparator },
  dividerText: { ...Typography.footnote, color: Colors.tertiaryLabel },
  oauthRow: { flexDirection: 'row', gap: 12, marginBottom: Spacing.xl },
  oauthBtn: {
    flex: 1, paddingVertical: 14, borderRadius: Radius.lg, borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.opaqueSeparator, alignItems: 'center', backgroundColor: Colors.systemBackground,
  },
  oauthText: { ...Typography.callout, fontWeight: '500', color: Colors.label },
  testBox: {
    backgroundColor: Colors.brandLight, borderRadius: Radius.lg, padding: Spacing.lg,
    marginBottom: Spacing.xl, borderWidth: 1, borderColor: '#BFDBFE',
  },
  testTitle: { ...Typography.footnote, fontWeight: '600', color: Colors.brand, marginBottom: 10 },
  testRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  testEmail: { ...Typography.footnote, color: Colors.brand },
  testLabel: { ...Typography.caption1, color: Colors.tertiaryLabel },
  signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signupText: { ...Typography.callout, color: Colors.secondaryLabel },
  signupLink: { ...Typography.callout, fontWeight: '600', color: Colors.brand },
});
