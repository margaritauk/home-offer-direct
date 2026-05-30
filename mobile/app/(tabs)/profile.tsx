import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuth, useTierFeatures, TIER_FEATURES, Tier } from '@/lib/auth';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';

function TierCard({ tier, current, onSelect }: { tier: Tier; current: boolean; onSelect: () => void }) {
  const f = TIER_FEATURES[tier];
  return (
    <TouchableOpacity
      style={[tierCard.wrap, current && tierCard.wrapActive]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      {current && (
        <LinearGradient
          colors={[Colors.brandGradientStart, Colors.brandGradientEnd]}
          style={tierCard.currentBadge}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        >
          <Text style={tierCard.currentText}>Current Plan</Text>
        </LinearGradient>
      )}
      <View style={tierCard.header}>
        <Text style={[tierCard.name, current && { color: Colors.brand }]}>{f.label}</Text>
        <Text style={tierCard.price}>{f.price}</Text>
      </View>
      <View style={tierCard.features}>
        {[
          `${f.maxOffers === 999 ? 'Unlimited' : f.maxOffers} offer${f.maxOffers !== 1 ? 's' : ''}`,
          `${f.savedHomes === 999 ? 'Unlimited' : f.savedHomes} saved homes`,
          f.pdfDownload ? 'PDF download' : null,
          f.agentSend ? 'Send to agent' : null,
          f.journeyTracker ? 'Journey tracker' : null,
        ].filter(Boolean).map(feat => (
          <View key={feat} style={tierCard.featRow}>
            <Text style={tierCard.featCheck}>✓</Text>
            <Text style={tierCard.featText}>{feat}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const tierCard = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.systemBackground, borderRadius: Radius.xl,
    padding: Spacing.lg, marginBottom: Spacing.md, borderWidth: 1.5,
    borderColor: Colors.opaqueSeparator, ...Shadow.card as any,
  },
  wrapActive: { borderColor: Colors.brand },
  currentBadge: {
    alignSelf: 'flex-start', borderRadius: Radius.pill,
    paddingHorizontal: 10, paddingVertical: 3, marginBottom: 8,
  },
  currentText: { ...Typography.caption1, color: '#fff', fontWeight: '600' } as any,
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  name: { ...Typography.headline, color: Colors.label } as any,
  price: { ...Typography.title3, color: Colors.secondaryLabel } as any,
  features: { gap: 4 },
  featRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  featCheck: { color: Colors.green, fontWeight: '700', fontSize: 13 },
  featText: { ...Typography.footnote, color: Colors.secondaryLabel } as any,
});

function SettingRow({ icon, label, value, onPress, danger }: {
  icon: string; label: string; value?: string; onPress?: () => void; danger?: boolean;
}) {
  return (
    <TouchableOpacity style={row.wrap} onPress={onPress} activeOpacity={onPress ? 0.7 : 1} disabled={!onPress}>
      <Text style={row.icon}>{icon}</Text>
      <Text style={[row.label, danger && { color: Colors.red }]}>{label}</Text>
      {value && <Text style={row.value}>{value}</Text>}
      {onPress && <Text style={row.chevron}>›</Text>}
    </TouchableOpacity>
  );
}

const row = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.systemBackground,
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.opaqueSeparator,
  },
  icon: { fontSize: 18, width: 24, textAlign: 'center' },
  label: { ...Typography.body, color: Colors.label, flex: 1 } as any,
  value: { ...Typography.body, color: Colors.tertiaryLabel } as any,
  chevron: { fontSize: 20, color: Colors.tertiaryLabel },
});

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, setTier } = useAuth();
  const features = useTierFeatures();
  const [showTiers, setShowTiers] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);

  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.authGate}>
          <Text style={styles.authIcon}>👤</Text>
          <Text style={styles.authTitle}>Sign in to manage your account</Text>
          <TouchableOpacity style={styles.authBtn} onPress={() => router.push('/login')}>
            <LinearGradient
              colors={[Colors.brandGradientStart, Colors.brandGradientEnd]}
              style={styles.authBtnGradient}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <Text style={styles.authBtnText}>Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.authSecondary}>Create account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <LinearGradient
            colors={[Colors.brandGradientStart, Colors.brandGradientEnd]}
            style={styles.avatar}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            <Text style={styles.avatarText}>{user.name[0].toUpperCase()}</Text>
          </LinearGradient>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.tierBadge}>
            <Text style={styles.tierBadgeText}>{TIER_FEATURES[user.tier].label} Plan</Text>
          </View>
        </View>

        {/* Plan section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => { Haptics.selectionAsync(); setShowTiers(s => !s); }}
          >
            <Text style={styles.sectionTitle}>Subscription Plan</Text>
            <Text style={styles.sectionAction}>{showTiers ? 'Hide' : 'Change plan'}</Text>
          </TouchableOpacity>

          {!showTiers && (
            <View style={styles.currentPlanRow}>
              <Text style={styles.currentPlanName}>{TIER_FEATURES[user.tier].label}</Text>
              <Text style={styles.currentPlanPrice}>{TIER_FEATURES[user.tier].price}/mo</Text>
            </View>
          )}

          {showTiers && (['free', 'basic', 'premium', 'pro'] as Tier[]).map(t => (
            <TierCard
              key={t}
              tier={t}
              current={user.tier === t}
              onSelect={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setTier(t);
                setShowTiers(false);
              }}
            />
          ))}
        </View>

        {/* Account settings */}
        <Text style={styles.groupLabel}>ACCOUNT</Text>
        <View style={styles.group}>
          <SettingRow icon="✉️" label="Email" value={user.email} />
          <SettingRow icon="🏠" label="Home state" value={user.state} />
          <SettingRow icon="📊" label="Offers used" value={`${user.offers.length} of ${features.maxOffers === 999 ? '∞' : features.maxOffers}`} />
        </View>

        <Text style={styles.groupLabel}>SUPPORT</Text>
        <View style={styles.group}>
          <SettingRow icon="❓" label="Help & FAQ" onPress={() => {}} />
          <SettingRow icon="⭐" label="Rate the app" onPress={() => {}} />
          <SettingRow icon="📝" label="Privacy Policy" onPress={() => {}} />
        </View>

        {/* Dev panel */}
        <TouchableOpacity
          style={styles.devToggle}
          onPress={() => { Haptics.selectionAsync(); setShowDevPanel(s => !s); }}
        >
          <Text style={styles.devToggleText}>🧪 Dev Tools</Text>
        </TouchableOpacity>

        {showDevPanel && (
          <View style={styles.devPanel}>
            <Text style={styles.devTitle}>Switch Test Account Tier</Text>
            <View style={styles.devTiers}>
              {(['free', 'basic', 'premium', 'pro'] as Tier[]).map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.devChip, user.tier === t && styles.devChipActive]}
                  onPress={() => { Haptics.selectionAsync(); setTier(t); }}
                >
                  <Text style={[styles.devChipText, user.tier === t && styles.devChipTextActive]}>
                    {TIER_FEATURES[t].label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Sign out */}
        <Text style={styles.groupLabel}> </Text>
        <View style={styles.group}>
          <SettingRow icon="🚪" label="Sign Out" onPress={handleLogout} danger />
        </View>

        <Text style={styles.version}>HomeOfferDirect v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.systemGroupedBackground },
  authGate: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, padding: Spacing.xl },
  authIcon: { fontSize: 48 },
  authTitle: { ...Typography.title2, color: Colors.label, textAlign: 'center' } as any,
  authBtn: { width: '100%', borderRadius: Radius.xl, overflow: 'hidden' },
  authBtnGradient: { paddingVertical: 16, alignItems: 'center' },
  authBtnText: { ...Typography.headline, color: '#fff' } as any,
  authSecondary: { ...Typography.callout, color: Colors.brand } as any,
  avatarSection: { alignItems: 'center', paddingVertical: Spacing.xl },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#fff' },
  userName: { ...Typography.title2, color: Colors.label, marginBottom: 4 } as any,
  userEmail: { ...Typography.footnote, color: Colors.secondaryLabel, marginBottom: 10 } as any,
  tierBadge: {
    backgroundColor: Colors.brandLight, borderRadius: Radius.pill,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  tierBadgeText: { ...Typography.footnote, color: Colors.brand, fontWeight: '600' } as any,
  section: { marginHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { ...Typography.headline, color: Colors.label } as any,
  sectionAction: { ...Typography.footnote, color: Colors.brand } as any,
  currentPlanRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.systemBackground, borderRadius: Radius.lg,
    padding: Spacing.lg, ...Shadow.card as any,
  },
  currentPlanName: { ...Typography.headline, color: Colors.brand } as any,
  currentPlanPrice: { ...Typography.body, color: Colors.secondaryLabel } as any,
  groupLabel: { ...Typography.footnote, color: Colors.tertiaryLabel, marginHorizontal: Spacing.lg, marginBottom: 6, marginTop: Spacing.lg } as any,
  group: {
    backgroundColor: Colors.systemBackground, borderRadius: Radius.lg,
    marginHorizontal: Spacing.lg, overflow: 'hidden', ...Shadow.card as any,
  },
  devToggle: { alignItems: 'center', paddingVertical: Spacing.md, marginTop: Spacing.xl },
  devToggleText: { ...Typography.footnote, color: Colors.tertiaryLabel } as any,
  devPanel: {
    marginHorizontal: Spacing.lg, backgroundColor: Colors.systemBackground,
    borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.card as any,
  },
  devTitle: { ...Typography.footnote, color: Colors.secondaryLabel, fontWeight: '600', marginBottom: 10 } as any,
  devTiers: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  devChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.pill,
    borderWidth: 1, borderColor: Colors.opaqueSeparator,
  },
  devChipActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  devChipText: { ...Typography.footnote, color: Colors.secondaryLabel } as any,
  devChipTextActive: { color: '#fff', fontWeight: '600' },
  version: { ...Typography.caption1, color: Colors.quaternaryLabel, textAlign: 'center', marginTop: Spacing.xl, paddingBottom: Spacing.lg } as any,
});
