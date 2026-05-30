import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Image, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuth, useTierFeatures, TIER_FEATURES } from '@/lib/auth';
import { PROPERTIES, formatCurrencyShort, formatCurrency, Property } from '@/lib/data';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';

const FILTERS = ['All', 'Under $400K', 'Under $600K', '3+ Beds', 'Price Drop'];

function AiScoreBadge({ score, label }: { score: number; label: string }) {
  const color = score >= 85 ? Colors.green : score >= 70 ? Colors.brand : Colors.orange;
  return (
    <View style={[scoreBadge.wrap, { backgroundColor: color + '15', borderColor: color + '40' }]}>
      <Text style={[scoreBadge.num, { color }]}>{score}</Text>
      <Text style={[scoreBadge.lbl, { color }]}>{label}</Text>
    </View>
  );
}
const scoreBadge = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.pill, borderWidth: 1 },
  num: { ...Typography.caption1, fontWeight: '700' } as any,
  lbl: { ...Typography.caption1 } as any,
});

function PropertyCard({ property, onMakeOffer }: { property: Property; onMakeOffer: (p: Property) => void }) {
  const { user, saveHome, unsaveHome } = useAuth();
  const features = useTierFeatures();
  const router = useRouter();
  const isSaved = user?.savedHomeIds.includes(property.id) ?? false;
  const savedCount = user?.savedHomeIds.length ?? 0;

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!user) { router.push('/login'); return; }
    if (!isSaved && savedCount >= features.savedHomes) {
      router.push('/profile');
      return;
    }
    isSaved ? unsaveHome(property.id) : saveHome(property.id);
  };

  const trend = property.marketTrend;
  const trendColor = trend === 'hot' ? Colors.red : trend === 'cooling' ? Colors.blue : Colors.secondaryLabel;
  const trendIcon = trend === 'hot' ? '🔥' : trend === 'cooling' ? '❄️' : '→';

  return (
    <View style={card.wrap}>
      <View style={card.imageWrap}>
        <Image source={{ uri: property.photo }} style={card.image} />
        <TouchableOpacity style={card.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Text style={card.saveIcon}>{isSaved ? '♥' : '♡'}</Text>
        </TouchableOpacity>
        {property.priceChange < 0 && (
          <View style={card.dropBadge}>
            <Text style={card.dropText}>▼ {formatCurrencyShort(Math.abs(property.priceChange))}</Text>
          </View>
        )}
      </View>

      <View style={card.body}>
        <View style={card.topRow}>
          <Text style={card.price}>{formatCurrencyShort(property.price)}</Text>
          <AiScoreBadge score={property.aiScore} label={property.aiLabel} />
        </View>

        <Text style={card.address}>{property.address}</Text>
        <Text style={card.meta}>{property.city}, {property.state} {property.zip}</Text>

        <View style={card.statsRow}>
          <Text style={card.stat}>{property.beds} bd</Text>
          <Text style={card.dot}>·</Text>
          <Text style={card.stat}>{property.baths} ba</Text>
          <Text style={card.dot}>·</Text>
          <Text style={card.stat}>{property.sqft.toLocaleString()} sqft</Text>
          <Text style={card.dot}>·</Text>
          <Text style={[card.stat, { color: trendColor }]}>{trendIcon} {trend}</Text>
        </View>

        <View style={card.suggestRow}>
          <Text style={card.suggestLabel}>Suggested offer</Text>
          <Text style={card.suggestRange}>
            {formatCurrencyShort(property.suggestedOffer[0])} – {formatCurrencyShort(property.suggestedOffer[1])}
          </Text>
        </View>

        <TouchableOpacity
          style={card.offerBtn}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onMakeOffer(property); }}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.brandGradientStart, Colors.brandGradientEnd]}
            style={card.offerBtnGradient}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            <Text style={card.offerBtnText}>Make Offer</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const card = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.systemBackground, borderRadius: Radius.xl,
    marginBottom: Spacing.lg, ...Shadow.card as any, overflow: 'hidden',
  },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 200 },
  saveBtn: {
    position: 'absolute', top: 12, right: 12,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  saveIcon: { fontSize: 18, color: Colors.red },
  dropBadge: {
    position: 'absolute', bottom: 12, left: 12,
    backgroundColor: 'rgba(52,199,89,0.9)', borderRadius: Radius.pill,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  dropText: { ...Typography.caption1, color: '#fff', fontWeight: '600' } as any,
  body: { padding: Spacing.lg },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  price: { ...Typography.title2, color: Colors.label } as any,
  address: { ...Typography.headline, color: Colors.label, marginBottom: 2 } as any,
  meta: { ...Typography.footnote, color: Colors.secondaryLabel, marginBottom: Spacing.sm } as any,
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: Spacing.md },
  stat: { ...Typography.caption1, color: Colors.secondaryLabel } as any,
  dot: { ...Typography.caption1, color: Colors.quaternaryLabel } as any,
  suggestRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.brandLight, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, marginBottom: Spacing.md,
  },
  suggestLabel: { ...Typography.caption1, color: Colors.brand } as any,
  suggestRange: { ...Typography.footnote, color: Colors.brand, fontWeight: '600' } as any,
  offerBtn: { borderRadius: Radius.lg, overflow: 'hidden' },
  offerBtnGradient: { paddingVertical: 12, alignItems: 'center' },
  offerBtnText: { ...Typography.headline, color: '#fff' } as any,
});

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = PROPERTIES.filter(p => {
    const q = query.toLowerCase();
    const matchSearch = !q || p.address.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.zip.includes(q);
    const matchFilter =
      activeFilter === 'All' ? true :
      activeFilter === 'Under $400K' ? p.price < 400000 :
      activeFilter === 'Under $600K' ? p.price < 600000 :
      activeFilter === '3+ Beds' ? p.beds >= 3 :
      activeFilter === 'Price Drop' ? p.priceChange < 0 : true;
    return matchSearch && matchFilter;
  });

  const handleMakeOffer = (property: Property) => {
    router.push({ pathname: '/offer-builder', params: { propertyId: property.id } });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Your Home</Text>
        <Text style={styles.headerSub}>{PROPERTIES.length} listings in Chicago, IL</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Address, city, or ZIP"
            placeholderTextColor={Colors.quaternaryLabel}
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        style={styles.filtersScroll}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            onPress={() => { Haptics.selectionAsync(); setActiveFilter(f); }}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results count */}
      <Text style={styles.resultCount}>{filtered.length} home{filtered.length !== 1 ? 's' : ''}</Text>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={p => p.id}
        renderItem={({ item }) => <PropertyCard property={item} onMakeOffer={handleMakeOffer} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🏠</Text>
            <Text style={styles.emptyText}>No homes match your filters</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.systemGroupedBackground },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.md },
  headerTitle: { ...Typography.title1, color: Colors.label } as any,
  headerSub: { ...Typography.footnote, color: Colors.secondaryLabel, marginTop: 2 } as any,
  searchWrap: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.systemBackground, borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    ...Shadow.card as any,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, ...Typography.body, color: Colors.label } as any,
  filtersScroll: { flexShrink: 0 },
  filters: { paddingHorizontal: Spacing.lg, gap: 8, paddingBottom: 4 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.pill,
    backgroundColor: Colors.systemBackground, borderWidth: 1, borderColor: Colors.opaqueSeparator,
  },
  filterChipActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  filterText: { ...Typography.footnote, color: Colors.secondaryLabel, fontWeight: '500' } as any,
  filterTextActive: { color: '#fff', fontWeight: '600' },
  resultCount: { ...Typography.caption1, color: Colors.tertiaryLabel, paddingHorizontal: Spacing.lg, marginTop: Spacing.md, marginBottom: Spacing.sm } as any,
  list: { paddingHorizontal: Spacing.lg, paddingBottom: 100 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyText: { ...Typography.callout, color: Colors.secondaryLabel } as any,
});
