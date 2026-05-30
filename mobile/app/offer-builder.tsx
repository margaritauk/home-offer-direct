import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Platform, KeyboardAvoidingView, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuth, useTierFeatures } from '@/lib/auth';
import { PROPERTIES, formatCurrency } from '@/lib/data';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';

type Step = 0 | 1 | 2 | 3 | 4;

const STEPS = ['Property', 'Price', 'Terms', 'Contingencies', 'Review'];
const FINANCE_OPTIONS = ['Conventional', 'FHA', 'VA', 'Cash', 'Jumbo'];
const POSSESSION_OPTIONS = ['30 days', '45 days', '60 days', 'Flexible', 'ASAP'];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={ind.wrap}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            ind.dot,
            i < current ? ind.dotDone : i === current ? ind.dotActive : ind.dotFuture,
          ]}
        />
      ))}
    </View>
  );
}
const ind = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { height: 4, borderRadius: 2 },
  dotDone: { width: 16, backgroundColor: Colors.brand + '60' },
  dotActive: { width: 24, backgroundColor: Colors.brand },
  dotFuture: { width: 16, backgroundColor: Colors.opaqueSeparator },
});

function OptionChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[chip.wrap, selected && chip.active]}
      onPress={() => { Haptics.selectionAsync(); onPress(); }}
    >
      <Text style={[chip.text, selected && chip.textActive]}>{label}</Text>
    </TouchableOpacity>
  );
}
const chip = StyleSheet.create({
  wrap: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: Radius.pill,
    borderWidth: 1.5, borderColor: Colors.opaqueSeparator, backgroundColor: Colors.systemBackground,
  },
  active: { borderColor: Colors.brand, backgroundColor: Colors.brandLight },
  text: { ...Typography.footnote, color: Colors.secondaryLabel, fontWeight: '500' } as any,
  textActive: { color: Colors.brand, fontWeight: '600' },
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={field.wrap}>
      <Text style={field.label}>{label}</Text>
      {children}
    </View>
  );
}
const field = StyleSheet.create({
  wrap: { marginBottom: Spacing.lg },
  label: { ...Typography.subheadline, color: Colors.label, fontWeight: '500', marginBottom: 8 } as any,
});

function StyledInput({ value, onChangeText, placeholder, keyboardType, prefix }: {
  value: string; onChangeText: (v: string) => void;
  placeholder?: string; keyboardType?: any; prefix?: string;
}) {
  return (
    <View style={sinput.wrap}>
      {prefix && <Text style={sinput.prefix}>{prefix}</Text>}
      <TextInput
        style={[sinput.input, prefix && { paddingLeft: 8 }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.quaternaryLabel}
        keyboardType={keyboardType ?? 'default'}
        autoCorrect={false}
      />
    </View>
  );
}
const sinput = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.systemBackground, borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth, borderColor: Colors.opaqueSeparator,
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
  },
  prefix: { ...Typography.body, color: Colors.secondaryLabel } as any,
  input: { flex: 1, ...Typography.body, color: Colors.label } as any,
});

export default function OfferBuilderScreen() {
  const router = useRouter();
  const { propertyId } = useLocalSearchParams<{ propertyId?: string }>();
  const { user } = useAuth();
  const features = useTierFeatures();

  const [step, setStep] = useState<Step>(0);
  const [selectedPropertyId, setSelectedPropertyId] = useState(propertyId ?? '');
  const [offerPrice, setOfferPrice] = useState('');
  const [earnestMoney, setEarnestMoney] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [financeType, setFinanceType] = useState('Conventional');
  const [possessionDate, setPossessionDate] = useState('45 days');
  const [inclusions, setInclusions] = useState('');
  const [inspectionContingency, setInspectionContingency] = useState(true);
  const [financeContingency, setFinanceContingency] = useState(true);
  const [appraisalContingency, setAppraisalContingency] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const property = PROPERTIES.find(p => p.id === selectedPropertyId);

  const canProceed = (): boolean => {
    if (step === 0) return !!selectedPropertyId;
    if (step === 1) return !!offerPrice && Number(offerPrice.replace(/,/g, '')) > 0;
    return true;
  };

  const advance = () => {
    if (!canProceed()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < 4) setStep((step + 1) as Step);
  };

  const back = () => {
    Haptics.selectionAsync();
    if (step === 0) router.back();
    else setStep((step - 1) as Step);
  };

  const submit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.successWrap}>
          <LinearGradient
            colors={[Colors.brandGradientStart, Colors.brandGradientEnd]}
            style={styles.successIcon}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            <Text style={styles.successIconText}>✓</Text>
          </LinearGradient>
          <Text style={styles.successTitle}>Offer Created!</Text>
          <Text style={styles.successBody}>
            Your offer for {property?.address ?? 'the property'} has been drafted.
            {features.agentSend
              ? ' You can now send it directly to the listing agent.'
              : ' Upgrade to Premium to send directly to the listing agent.'}
          </Text>
          {features.pdfDownload && (
            <TouchableOpacity style={styles.pdfBtn} activeOpacity={0.8}>
              <Text style={styles.pdfBtnText}>📄  Download PDF</Text>
            </TouchableOpacity>
          )}
          {features.agentSend && (
            <TouchableOpacity style={styles.sendBtn} activeOpacity={0.8}>
              <LinearGradient
                colors={[Colors.brandGradientStart, Colors.brandGradientEnd]}
                style={styles.sendBtnGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Text style={styles.sendBtnText}>Send to Agent</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => router.replace('/(tabs)/dashboard')} style={styles.doneBtn}>
            <Text style={styles.doneBtnText}>View My Offers</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const priceNum = Number(offerPrice.replace(/,/g, '')) || 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={back} style={styles.backBtn}>
            <Text style={styles.backText}>{step === 0 ? '✕' : '‹'}</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{STEPS[step]}</Text>
            <StepIndicator current={step} total={5} />
          </View>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Step 0: Property selection */}
          {step === 0 && (
            <View>
              <Text style={styles.stepTitle}>Which home?</Text>
              <Text style={styles.stepSub}>Select a property to make an offer on</Text>
              {PROPERTIES.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.propRow, selectedPropertyId === p.id && styles.propRowActive]}
                  onPress={() => { Haptics.selectionAsync(); setSelectedPropertyId(p.id); }}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: p.photo }} style={styles.propThumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.propAddress} numberOfLines={1}>{p.address}</Text>
                    <Text style={styles.propCity}>{p.city}, {p.state}</Text>
                    <Text style={styles.propPrice}>{formatCurrency(p.price)}</Text>
                  </View>
                  {selectedPropertyId === p.id && (
                    <Text style={{ color: Colors.brand, fontSize: 20 }}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Step 1: Price */}
          {step === 1 && property && (
            <View>
              <Text style={styles.stepTitle}>Set your price</Text>
              <View style={styles.suggestBanner}>
                <Text style={styles.suggestBannerLabel}>AI suggested range</Text>
                <Text style={styles.suggestBannerRange}>
                  {formatCurrency(property.suggestedOffer[0])} – {formatCurrency(property.suggestedOffer[1])}
                </Text>
              </View>
              <Field label="Offer price ($)">
                <StyledInput
                  value={offerPrice}
                  onChangeText={setOfferPrice}
                  placeholder={formatCurrency(property.suggestedOffer[0]).replace('$', '').replace(',', ',')}
                  keyboardType="number-pad"
                  prefix="$"
                />
              </Field>
              <Field label="Earnest money ($)">
                <StyledInput
                  value={earnestMoney}
                  onChangeText={setEarnestMoney}
                  placeholder="5,000"
                  keyboardType="number-pad"
                  prefix="$"
                />
              </Field>
              <Field label="Down payment ($)">
                <StyledInput
                  value={downPayment}
                  onChangeText={setDownPayment}
                  placeholder="20%"
                  keyboardType="number-pad"
                  prefix="$"
                />
              </Field>
              {priceNum > 0 && property.price > 0 && (
                <View style={styles.priceDiff}>
                  <Text style={styles.priceDiffText}>
                    {priceNum >= property.price
                      ? `${((priceNum / property.price - 1) * 100).toFixed(1)}% above list`
                      : `${((1 - priceNum / property.price) * 100).toFixed(1)}% below list`}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Step 2: Terms */}
          {step === 2 && (
            <View>
              <Text style={styles.stepTitle}>Financing & terms</Text>
              <Field label="Financing type">
                <View style={styles.chipRow}>
                  {FINANCE_OPTIONS.map(o => (
                    <OptionChip key={o} label={o} selected={financeType === o} onPress={() => setFinanceType(o)} />
                  ))}
                </View>
              </Field>
              <Field label="Desired possession">
                <View style={styles.chipRow}>
                  {POSSESSION_OPTIONS.map(o => (
                    <OptionChip key={o} label={o} selected={possessionDate === o} onPress={() => setPossessionDate(o)} />
                  ))}
                </View>
              </Field>
              <Field label="Inclusions (optional)">
                <TextInput
                  style={styles.textArea}
                  value={inclusions}
                  onChangeText={setInclusions}
                  placeholder="e.g. refrigerator, washer/dryer, window treatments"
                  placeholderTextColor={Colors.quaternaryLabel}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </Field>
            </View>
          )}

          {/* Step 3: Contingencies */}
          {step === 3 && (
            <View>
              <Text style={styles.stepTitle}>Contingencies</Text>
              <Text style={styles.stepSub}>These protect your earnest money if issues arise</Text>
              {[
                { label: 'Inspection contingency', sub: 'Right to inspect within 10 days', value: inspectionContingency, set: setInspectionContingency },
                { label: 'Financing contingency', sub: 'Offer void if loan is denied', value: financeContingency, set: setFinanceContingency },
                { label: 'Appraisal contingency', sub: 'Exit if home appraises low', value: appraisalContingency, set: setAppraisalContingency },
              ].map(c => (
                <TouchableOpacity
                  key={c.label}
                  style={styles.contingencyRow}
                  onPress={() => { Haptics.selectionAsync(); c.set(v => !v); }}
                  activeOpacity={0.8}
                >
                  <View style={styles.contingencyInfo}>
                    <Text style={styles.contingencyLabel}>{c.label}</Text>
                    <Text style={styles.contingencySub}>{c.sub}</Text>
                  </View>
                  <View style={[styles.toggle, c.value && styles.toggleOn]}>
                    <View style={[styles.toggleThumb, c.value && styles.toggleThumbOn]} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Step 4: Review */}
          {step === 4 && property && (
            <View>
              <Text style={styles.stepTitle}>Review your offer</Text>
              <View style={styles.reviewCard}>
                <Image source={{ uri: property.photo }} style={styles.reviewPhoto} />
                <View style={styles.reviewBody}>
                  <Text style={styles.reviewAddress}>{property.address}</Text>
                  <Text style={styles.reviewCity}>{property.city}, {property.state} {property.zip}</Text>
                </View>
              </View>
              {[
                { label: 'Offer Price', value: offerPrice ? `$${offerPrice}` : formatCurrency(property.suggestedOffer[0]) },
                { label: 'Earnest Money', value: earnestMoney ? `$${earnestMoney}` : '—' },
                { label: 'Down Payment', value: downPayment ? `$${downPayment}` : '—' },
                { label: 'Financing', value: financeType },
                { label: 'Possession', value: possessionDate },
                { label: 'Inspection', value: inspectionContingency ? 'Yes' : 'Waived' },
                { label: 'Financing Cont.', value: financeContingency ? 'Yes' : 'Waived' },
                { label: 'Appraisal Cont.', value: appraisalContingency ? 'Yes' : 'Waived' },
              ].map(r => (
                <View key={r.label} style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>{r.label}</Text>
                  <Text style={styles.reviewValue}>{r.value}</Text>
                </View>
              ))}
              {inclusions.trim() && (
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Inclusions</Text>
                  <Text style={[styles.reviewValue, { maxWidth: '60%', textAlign: 'right' }]}>{inclusions}</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.ctaBtn, !canProceed() && styles.ctaBtnDisabled]}
            onPress={step === 4 ? submit : advance}
            disabled={!canProceed()}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.brandGradientStart, Colors.brandGradientEnd]}
              style={styles.ctaBtnGradient}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <Text style={styles.ctaBtnText}>
                {step === 4 ? 'Create Offer' : `Continue → ${STEPS[step + 1]}`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.systemGroupedBackground },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    backgroundColor: Colors.systemBackground, borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.opaqueSeparator,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 24, color: Colors.brand },
  headerCenter: { alignItems: 'center', gap: 6 },
  headerTitle: { ...Typography.headline, color: Colors.label } as any,
  scroll: { padding: Spacing.lg, paddingBottom: 32 },
  stepTitle: { ...Typography.title2, color: Colors.label, marginBottom: 6 } as any,
  stepSub: { ...Typography.footnote, color: Colors.secondaryLabel, marginBottom: Spacing.xl } as any,

  propRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.systemBackground, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1.5,
    borderColor: Colors.opaqueSeparator, ...Shadow.card as any,
  },
  propRowActive: { borderColor: Colors.brand },
  propThumb: { width: 60, height: 60, borderRadius: Radius.md },
  propAddress: { ...Typography.footnote, color: Colors.label, fontWeight: '500' } as any,
  propCity: { ...Typography.caption1, color: Colors.secondaryLabel } as any,
  propPrice: { ...Typography.headline, color: Colors.brand, marginTop: 2 } as any,

  suggestBanner: {
    backgroundColor: Colors.brandLight, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.lg,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  suggestBannerLabel: { ...Typography.footnote, color: Colors.brand } as any,
  suggestBannerRange: { ...Typography.footnote, color: Colors.brand, fontWeight: '700' } as any,
  priceDiff: {
    backgroundColor: '#F0FDF4', borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 1, borderColor: '#86EFAC', alignItems: 'center',
  },
  priceDiffText: { ...Typography.footnote, color: Colors.green, fontWeight: '600' } as any,

  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  textArea: {
    backgroundColor: Colors.systemBackground, borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth, borderColor: Colors.opaqueSeparator,
    padding: Spacing.lg, ...Typography.body, color: Colors.label,
    minHeight: 80,
  } as any,

  contingencyRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.lg,
    backgroundColor: Colors.systemBackground, borderRadius: Radius.lg,
    padding: Spacing.lg, marginBottom: Spacing.sm, ...Shadow.card as any,
  },
  contingencyInfo: { flex: 1 },
  contingencyLabel: { ...Typography.body, color: Colors.label, fontWeight: '500' } as any,
  contingencySub: { ...Typography.caption1, color: Colors.secondaryLabel, marginTop: 2 } as any,
  toggle: { width: 44, height: 26, borderRadius: 13, backgroundColor: Colors.opaqueSeparator, justifyContent: 'center', padding: 2 },
  toggleOn: { backgroundColor: Colors.green },
  toggleThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', ...Shadow.card as any },
  toggleThumbOn: { alignSelf: 'flex-end' },

  reviewCard: {
    backgroundColor: Colors.systemBackground, borderRadius: Radius.lg,
    overflow: 'hidden', marginBottom: Spacing.lg, ...Shadow.card as any,
  },
  reviewPhoto: { width: '100%', height: 140 },
  reviewBody: { padding: Spacing.md },
  reviewAddress: { ...Typography.headline, color: Colors.label } as any,
  reviewCity: { ...Typography.footnote, color: Colors.secondaryLabel } as any,
  reviewRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.opaqueSeparator,
  },
  reviewLabel: { ...Typography.footnote, color: Colors.secondaryLabel } as any,
  reviewValue: { ...Typography.footnote, color: Colors.label, fontWeight: '500' } as any,

  footer: { padding: Spacing.lg, paddingBottom: Spacing.xl, backgroundColor: Colors.systemBackground, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.opaqueSeparator },
  ctaBtn: { borderRadius: Radius.xl, overflow: 'hidden' },
  ctaBtnDisabled: { opacity: 0.5 },
  ctaBtnGradient: { paddingVertical: 16, alignItems: 'center' },
  ctaBtnText: { ...Typography.headline, color: '#fff' } as any,

  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: 16 },
  successIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  successIconText: { fontSize: 36, color: '#fff', fontWeight: '700' },
  successTitle: { ...Typography.title1, color: Colors.label } as any,
  successBody: { ...Typography.body, color: Colors.secondaryLabel, textAlign: 'center', lineHeight: 24 } as any,
  pdfBtn: {
    width: '100%', borderRadius: Radius.xl, borderWidth: 1.5,
    borderColor: Colors.brand, paddingVertical: 14, alignItems: 'center',
  },
  pdfBtnText: { ...Typography.headline, color: Colors.brand } as any,
  sendBtn: { width: '100%', borderRadius: Radius.xl, overflow: 'hidden' },
  sendBtnGradient: { paddingVertical: 16, alignItems: 'center' },
  sendBtnText: { ...Typography.headline, color: '#fff' } as any,
  doneBtn: { paddingVertical: 12 },
  doneBtnText: { ...Typography.callout, color: Colors.brand } as any,
});
