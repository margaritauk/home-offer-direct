import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Image, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuth, useTierFeatures, TIER_FEATURES } from '@/lib/auth';
import { PROPERTIES, formatCurrency, formatCurrencyShort } from '@/lib/data';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';

type Tab = 'offers' | 'saved' | 'journey';

const STATUS_COLORS: Record<string, string> = {
  pending: Colors.orange,
  draft: Colors.secondaryLabel,
  accepted: Colors.green,
  rejected: Colors.red,
};

const STATUS_ICONS: Record<string, string> = {
  pending: '⏳',
  draft: '📝',
  accepted: '✅',
  rejected: '✗',
};

function OfferRow({ offer, onPress }: { offer: any; onPress: () => void }) {
  const color = STATUS_COLORS[offer.status] ?? Colors.secondaryLabel;
  return (
    <TouchableOpacity style={offerRow.wrap} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: offer.photo }} style={offerRow.photo} />
      <View style={offerRow.info}>
        <Text style={offerRow.address} numberOfLines={1}>{offer.address}</Text>
        <Text style={offerRow.price}>{formatCurrency(offer.price)}</Text>
        <Text style={offerRow.date}>{offer.date}</Text>
      </View>
      <View style={[offerRow.badge, { backgroundColor: color + '15' }]}>
        <Text style={[offerRow.badgeText, { color }]}>
          {STATUS_ICONS[offer.status]} {offer.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const offerRow = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.systemBackground, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.card as any,
  },
  photo: { width: 60, height: 60, borderRadius: Radius.md },
  info: { flex: 1, gap: 2 },
  address: { ...Typography.footnote, color: Colors.label, fontWeight: '500' } as any,
  price: { ...Typography.headline, color: Colors.label } as any,
  date: { ...Typography.caption1, color: Colors.tertiaryLabel } as any,
  badge: { borderRadius: Radius.pill, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { ...Typography.caption1, fontWeight: '600' } as any,
});

function SavedCard({ property, onRemove }: { property: any; onRemove: () => void }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={saved.wrap}
      onPress={() => router.push({ pathname: '/offer-builder', params: { propertyId: property.id } })}
      activeOpacity={0.8}
    >
      <Image source={{ uri: property.photo }} style={saved.image} />
      <TouchableOpacity style={saved.removeBtn} onPress={onRemove} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <Text style={saved.removeIcon}>✕</Text>
      </TouchableOpacity>
      <View style={saved.info}>
        <Text style={saved.price}>{formatCurrencyShort(property.price)}</Text>
        <Text style={saved.address} numberOfLines={1}>{property.address}</Text>
        <Text style={saved.meta}>{property.beds}bd · {property.baths}ba</Text>
      </View>
    </TouchableOpacity>
  );
}

const saved = StyleSheet.create({
  wrap: {
    width: 160, backgroundColor: Colors.systemBackground, borderRadius: Radius.xl,
    overflow: 'hidden', ...Shadow.card as any, marginRight: Spacing.md,
  },
  image: { width: '100%', height: 110 },
  removeBtn: {
    position: 'absolute', top: 8, right: 8, width: 24, height: 24,
    borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  removeIcon: { color: '#fff', fontSize: 10, fontWeight: '700' },
  info: { padding: 10, gap: 2 },
  price: { ...Typography.headline, color: Colors.label } as any,
  address: { ...Typography.caption1, color: Colors.secondaryLabel } as any,
  meta: { ...Typography.caption1, color: Colors.tertiaryLabel } as any,
});

function JourneyStep({ step, active, done }: { step: string; active: boolean; done: boolean }) {
  return (
    <View style={journey.stepWrap}>
      <View style={[journey.dot, done && journey.dotDone, active && journey.dotActive]}>
        <Text style={journey.dotText}>{done ? '✓' : active ? '●' : '○'}</Text>
      </View>
      <Text style={[journey.label, done && journey.labelDone, active && journey.labelActive]}>{step}</Text>
    </View>
  );
}

const journey = StyleSheet.create({
  stepWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  dot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.systemGroupedBackground,
    borderWidth: 1.5, borderColor: Colors.opaqueSeparator,
    alignItems: 'center', justifyContent: 'center',
  },
  dotDone: { backgroundColor: Colors.green, borderColor: Colors.green },
  dotActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  dotText: { fontSize: 10, fontWeight: '700', color: Colors.secondaryLabel },
  label: { ...Typography.body, color: Colors.secondaryLabel } as any,
  labelDone: { color: Colors.label },
  labelActive: { color: Colors.brand, fontWeight: '600' },
});

export default function DashboardScreen() {
  const router = useRouter();
  const { user, unsaveHome } = useAuth();
  const features = useTierFeatures();
  const [activeTab, setActiveTab] = useState<Tab>('offers');

  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.authGate}>
          <Text style={styles.authIcon}>🔒</Text>
          <Text style={styles.authTitle}>Sign in to view your dashboard</Text>
          <TouchableOpacity style={styles.authBtn} onPress={() => router.push('/login')}>
            <LinearGradient
              colors={[Colors.brandGradientStart, Colors.brandGradientEnd]}
              style={styles.authBtnGradient}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <Text style={styles.authBtnText}>Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const offerCount = user.offers.length;
  const maxOffers = features.maxOffers;
  const savedProperties = PROPERTIES.filter(p => user.savedHomeIds.includes(p.id));

  const journeySteps = [
    { step: 'Account created', done: true, active: false },
    { step: 'First home saved', done: savedProperties.length > 0, active: savedProperties.length === 0 },
    { step: 'First offer drafted', done: offerCount > 0, active: offerCount === 0 && savedProperties.length > 0 },
    { step: 'Offer submitted', done: user.offers.some(o => o.status === 'pending' || o.status === 'accepted'), active: false },
    { step: 'Offer accepted 🎉', done: user.offers.some(o => o.status === 'accepted'), active: false },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {user.name.split(' ')[0]} 👋</Text>
            <Text style={styles.tierLabel}>{TIER_FEATURES[user.tier].label} plan</Text>
          </View>
          <TouchableOpacity
            style={styles.newOfferBtn}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/offer-builder'); }}
          >
            <LinearGradient
              colors={[Colors.brandGradientStart, Colors.brandGradientEnd]}
              style={styles.newOfferBtnGradient}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <Text style={styles.newOfferBtnText}>+ New Offer</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Offers', value: offerCount, sub: `of ${maxOffers === 999 ? '∞' : maxOffers}` },
            { label: 'Saved', value: user.savedHomeIds.length, sub: `of ${features.savedHomes}` },
            { label: 'Pending', value: user.offers.filter(o => o.status === 'pending').length, sub: 'active' },
          ].map(s => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statSub}>{s.sub}</Text>
            </View>
          ))}
        </View>

        {/* Offer limit warning */}
        {offerCount >= maxOffers && maxOffers < 999 && (
          <TouchableOpacity style={styles.limitBanner} onPress={() => router.push('/profile')} activeOpacity={0.8}>
            <Text style={styles.limitBannerText}>
              ⚡ You've used all {maxOffers} offer{maxOffers !== 1 ? 's' : ''} — upgrade to make more
            </Text>
          </TouchableOpacity>
        )}

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['offers', 'saved', 'journey'] as Tab[]).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, activeTab === t && styles.tabActive]}
              onPress={() => { Haptics.selectionAsync(); setActiveTab(t); }}
            >
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
                {t === 'offers' ? 'Offers' : t === 'saved' ? 'Saved' : 'Journey'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Offers tab */}
        {activeTab === 'offers' && (
          <View style={styles.panel}>
            {user.offers.length === 0 ? (
              <View style={styles.emptyPanel}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={styles.emptyTitle}>No offers yet</Text>
                <Text style={styles.emptyBody}>Find a home in Search and tap "Make Offer" to get started.</Text>
              </View>
            ) : (
              user.offers.map(offer => (
                <OfferRow
                  key={offer.id}
                  offer={offer}
                  onPress={() => Haptics.selectionAsync()}
                />
              ))
            )}
          </View>
        )}

        {/* Saved tab */}
        {activeTab === 'saved' && (
          <View style={styles.panel}>
            {savedProperties.length === 0 ? (
              <View style={styles.emptyPanel}>
                <Text style={styles.emptyIcon}>♡</Text>
                <Text style={styles.emptyTitle}>No saved homes</Text>
                <Text style={styles.emptyBody}>Tap the heart on any listing to save it here.</Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {savedProperties.map(p => (
                  <SavedCard
                    key={p.id}
                    property={p}
                    onRemove={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); unsaveHome(p.id); }}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        )}

        {/* Journey tab */}
        {activeTab === 'journey' && (
          <View style={styles.panel}>
            {!features.journeyTracker ? (
              <View style={styles.lockPanel}>
                <Text style={styles.lockIcon}>🔒</Text>
                <Text style={styles.lockTitle}>Journey Tracker</Text>
                <Text style={styles.lockBody}>Upgrade to Basic or higher to track your home buying journey.</Text>
                <TouchableOpacity style={styles.upgradeBtn} onPress={() => router.push('/profile')} activeOpacity={0.85}>
                  <LinearGradient
                    colors={[Colors.brandGradientStart, Colors.brandGradientEnd]}
                    style={styles.upgradeBtnGradient}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.upgradeBtnText}>Upgrade Plan</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ paddingVertical: Spacing.sm }}>
                {journeySteps.map((s, i) => (
                  <React.Fragment key={s.step}>
                    <JourneyStep {...s} />
                    {i < journeySteps.length - 1 && <View style={styles.journeyConnector} />}
                  </React.Fragment>
                ))}
              </View>
            )}
          </View>
        )}
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
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.lg,
  },
  greeting: { ...Typography.title2, color: Colors.label } as any,
  tierLabel: { ...Typography.footnote, color: Colors.brand, marginTop: 2 } as any,
  newOfferBtn: { borderRadius: Radius.lg, overflow: 'hidden' },
  newOfferBtnGradient: { paddingHorizontal: 16, paddingVertical: 10 },
  newOfferBtnText: { ...Typography.footnote, color: '#fff', fontWeight: '600' } as any,
  statsRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  statCard: {
    flex: 1, backgroundColor: Colors.systemBackground, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center', ...Shadow.card as any,
  },
  statValue: { ...Typography.title1, color: Colors.label } as any,
  statLabel: { ...Typography.caption1, color: Colors.secondaryLabel, marginTop: 2 } as any,
  statSub: { ...Typography.caption1, color: Colors.tertiaryLabel } as any,
  limitBanner: {
    marginHorizontal: Spacing.lg, marginBottom: Spacing.lg,
    backgroundColor: '#FEF3C7', borderRadius: Radius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: '#FDE68A',
  },
  limitBannerText: { ...Typography.footnote, color: '#92400E', textAlign: 'center' } as any,
  tabs: {
    flexDirection: 'row', marginHorizontal: Spacing.lg, marginBottom: Spacing.lg,
    backgroundColor: Colors.systemBackground, borderRadius: Radius.xl, padding: 4,
    ...Shadow.card as any,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: Radius.lg },
  tabActive: { backgroundColor: Colors.brand },
  tabText: { ...Typography.footnote, color: Colors.secondaryLabel, fontWeight: '500' } as any,
  tabTextActive: { color: '#fff', fontWeight: '600' },
  panel: { paddingHorizontal: Spacing.lg },
  emptyPanel: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { ...Typography.headline, color: Colors.label } as any,
  emptyBody: { ...Typography.footnote, color: Colors.secondaryLabel, textAlign: 'center', maxWidth: 260 } as any,
  lockPanel: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  lockIcon: { fontSize: 40 },
  lockTitle: { ...Typography.headline, color: Colors.label } as any,
  lockBody: { ...Typography.footnote, color: Colors.secondaryLabel, textAlign: 'center', maxWidth: 260 } as any,
  upgradeBtn: { borderRadius: Radius.xl, overflow: 'hidden', marginTop: 8, width: 200 },
  upgradeBtnGradient: { paddingVertical: 14, alignItems: 'center' },
  upgradeBtnText: { ...Typography.headline, color: '#fff' } as any,
  journeyConnector: { width: 2, height: 16, backgroundColor: Colors.opaqueSeparator, marginLeft: 13 },
});
