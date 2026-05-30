import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/lib/auth';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';

const STATES = [
  { value: 'IL', label: 'Illinois' }, { value: 'TX', label: 'Texas' },
  { value: 'NY', label: 'New York' }, { value: 'CA', label: 'California' },
  { value: 'FL', label: 'Florida' },
];

export default function SignupScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stateCode, setStateCode] = useState('IL');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!agreed) { setError('Please agree to the Terms to continue.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!name.trim()) { setError('Please enter your name.'); return; }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setError('');
    setLoading(true);
    try {
      await register(name, email, password, stateCode);
      router.replace('/(tabs)/search');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Registration failed');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Back */}
          <Link href="/login" asChild>
            <TouchableOpacity style={styles.back}>
              <Text style={styles.backText}>‹  Sign in</Text>
            </TouchableOpacity>
          </Link>

          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Free to start — no credit card required</Text>

          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {[
            { label: 'Full name',     value: name,     set: setName,     placeholder: 'Jane Smith',      type: 'default',       auto: 'name' as const },
            { label: 'Email',         value: email,    set: setEmail,    placeholder: 'jane@email.com',  type: 'email-address', auto: 'email' as const },
            { label: 'Password (8+)', value: password, set: setPassword, placeholder: '••••••••',        type: 'default',       auto: 'password' as const, secure: true },
          ].map(f => (
            <View key={f.label} style={styles.fieldGroup}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                style={styles.input}
                value={f.value}
                onChangeText={f.set}
                placeholder={f.placeholder}
                placeholderTextColor={Colors.quaternaryLabel}
                keyboardType={f.type as any}
                autoCapitalize={f.auto === 'name' ? 'words' : 'none'}
                autoCorrect={false}
                secureTextEntry={f.secure}
                returnKeyType="next"
              />
            </View>
          ))}

          {/* State */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Buying in which state?</Text>
            <View style={styles.stateRow}>
              {STATES.map(s => (
                <TouchableOpacity
                  key={s.value}
                  style={[styles.stateChip, stateCode === s.value && styles.stateChipActive]}
                  onPress={() => { Haptics.selectionAsync(); setStateCode(s.value); }}
                >
                  <Text style={[styles.stateChipText, stateCode === s.value && styles.stateChipTextActive]}>
                    {s.value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Terms */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => { Haptics.selectionAsync(); setAgreed(a => !a); }}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={{ color: Colors.brand }}>Terms of Service</Text> and{' '}
              <Text style={{ color: Colors.brand }}>Privacy Policy</Text>. I understand HomeOfferDirect is not a law firm.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            onPress={handleSignup}
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
                : <Text style={styles.primaryBtnText}>Create Free Account</Text>
              }
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.signinRow}>
            <Text style={styles.signinText}>Already have an account? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.signinLink}>Sign in</Text>
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
  back: { marginBottom: 24 },
  backText: { ...Typography.callout, color: Colors.brand },
  title: { ...Typography.title1, color: Colors.label, marginBottom: 6 },
  subtitle: { ...Typography.callout, color: Colors.secondaryLabel, marginBottom: 28 },
  errorBox: {
    backgroundColor: '#FEF2F2', borderRadius: Radius.md, padding: Spacing.md,
    marginBottom: Spacing.lg, borderWidth: 1, borderColor: '#FECACA',
  },
  errorText: { ...Typography.footnote, color: '#DC2626' },
  fieldGroup: { marginBottom: Spacing.lg },
  label: { ...Typography.subheadline, fontWeight: '500', color: Colors.label, marginBottom: 8 },
  input: {
    backgroundColor: Colors.systemBackground, borderRadius: Radius.lg,
    padding: Spacing.lg, ...Typography.body, color: Colors.label,
    borderWidth: StyleSheet.hairlineWidth, borderColor: Colors.opaqueSeparator,
  },
  stateRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  stateChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: Radius.pill,
    borderWidth: 1.5, borderColor: Colors.opaqueSeparator, backgroundColor: Colors.systemBackground,
  },
  stateChipActive: { borderColor: Colors.brand, backgroundColor: Colors.brandLight },
  stateChipText: { ...Typography.subheadline, fontWeight: '500', color: Colors.secondaryLabel },
  stateChipTextActive: { color: Colors.brand, fontWeight: '600' },
  termsRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: Spacing.xl },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 1.5,
    borderColor: Colors.opaqueSeparator, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.systemBackground, flexShrink: 0, marginTop: 1,
  },
  checkboxChecked: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  checkmark: { color: '#fff', fontSize: 13, fontWeight: '700' },
  termsText: { ...Typography.footnote, color: Colors.secondaryLabel, flex: 1, lineHeight: 18 },
  primaryBtn: { borderRadius: Radius.xl, overflow: 'hidden', marginBottom: Spacing.xl },
  primaryBtnGradient: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { ...Typography.headline, color: '#fff' },
  btnDisabled: { opacity: 0.6 },
  signinRow: { flexDirection: 'row', justifyContent: 'center' },
  signinText: { ...Typography.callout, color: Colors.secondaryLabel },
  signinLink: { ...Typography.callout, fontWeight: '600', color: Colors.brand },
});
