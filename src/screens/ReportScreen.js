import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useStore } from '../store';
import { useTheme } from '../theme/ThemeContext';
import { CATEGORIES, CATEGORY_ORDER } from '../data/seed';
import { radius, spacing } from '../theme';
import { CatMark, ContextBadge, Card, Btn } from '../components/primitives';
import Icon from '../components/Icon';

// ── ZonePicker ─────────────────────────────────────────────────────────────
function ZonePicker({ selected, onSelect }) {
  const { colors } = useTheme();
  const zones = useStore(s => s.zones.filter(z => z.subscribed));

  return (
    <View style={{ gap: 8 }}>
      {zones.map(z => (
        <TouchableOpacity
          key={z.id}
          onPress={() => onSelect(z.id)}
          activeOpacity={0.75}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 10,
            padding: 14, borderRadius: radius.control,
            backgroundColor: selected === z.id ? colors.accentSoft : colors.surfaceAlt,
            borderWidth: 1.5,
            borderColor: selected === z.id ? colors.accent : colors.line,
          }}
        >
          <View style={{
            width: 20, height: 20, borderRadius: 10,
            backgroundColor: selected === z.id ? colors.accent : colors.lineSoft,
            alignItems: 'center', justifyContent: 'center',
          }}>
            {selected === z.id && <Icon name="check" size={11} color={colors.onAccent} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink }} numberOfLines={1}>
              {z.name.split(' — ')[1] || z.name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
              <ContextBadge context={z.context} />
              <Text style={{ fontSize: 11, color: colors.inkFaint }}>{z.subscribers} subs</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── CategoryPicker ─────────────────────────────────────────────────────────
function CategoryPicker({ selected, onSelect }) {
  const { colors } = useTheme();
  const catColorMap = {
    medical: colors.catMedical, disturbance: colors.catDisturbance,
    suspicious: colors.catSuspicious, hazard: colors.catHazard,
    theft: colors.catTheft, lost: colors.catLost,
  };

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {CATEGORY_ORDER.map(cat => {
        const C = CATEGORIES[cat];
        const on = selected === cat;
        const fg = catColorMap[cat];
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelect(cat)}
            activeOpacity={0.75}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 8,
              paddingHorizontal: 12, paddingVertical: 10,
              borderRadius: radius.control,
              backgroundColor: on ? fg + '22' : colors.surfaceAlt,
              borderWidth: 1.5, borderColor: on ? fg : colors.line,
              minWidth: '45%', flex: 1,
            }}
          >
            <CatMark cat={cat} size={26} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: on ? fg : colors.ink }}>
              {C.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── ReportScreen ──────────────────────────────────────────────────────────
export default function ReportScreen({ navigation }) {
  const { colors } = useTheme();
  const submitReport = useStore(s => s.submitReport);
  const zones = useStore(s => s.zones.filter(z => z.subscribed));

  const [step, setStep] = useState(0);  // 0=zone, 1=cat, 2=detail
  const [zone, setZone] = useState(null);
  const [cat, setCat] = useState(null);
  const [note, setNote] = useState('');

  const steps = ['Location', 'Category', 'Detail'];
  const canNext = [!!zone, !!cat, true];

  const handleNext = () => {
    if (step < 2) { setStep(s => s + 1); return; }
    const msg = submitReport({ zone, cat, note });
    navigation.goBack();
  };

  const selectedZone = zones.find(z => z.id === zone);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={{
        paddingTop: 54, paddingHorizontal: spacing.pad, paddingBottom: 14,
        backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.line,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
            <Icon name="x" size={22} color={colors.ink} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink, flex: 1, letterSpacing: -0.3 }}>
            Report an incident
          </Text>
        </View>

        {/* Step indicator */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 }}>
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <View style={{
                paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill,
                backgroundColor: i === step ? colors.accent : i < step ? colors.accentSoft : colors.surfaceAlt,
              }}>
                <Text style={{
                  fontSize: 11, fontWeight: '700',
                  color: i === step ? colors.onAccent : i < step ? colors.accent : colors.inkFaint,
                }}>
                  {i < step ? '✓ ' : ''}{s}
                </Text>
              </View>
              {i < steps.length - 1 && (
                <View style={{ flex: 1, height: 1.5, backgroundColor: i < step ? colors.accent + '40' : colors.lineSoft }} />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.pad, gap: 16 }}>
        {step === 0 && (
          <View style={{ gap: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.ink, marginBottom: 4 }}>
              Where is this happening?
            </Text>
            <Text style={{ fontSize: 13, color: colors.inkSoft, lineHeight: 18, marginBottom: 6 }}>
              Select the zone from your subscribed areas.
            </Text>
            <ZonePicker selected={zone} onSelect={setZone} />
          </View>
        )}

        {step === 1 && (
          <View style={{ gap: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.ink, marginBottom: 4 }}>
              What type of incident?
            </Text>
            <CategoryPicker selected={cat} onSelect={setCat} />
          </View>
        )}

        {step === 2 && (
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <CatMark cat={cat} size={32} />
              <View>
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.accent }}>
                  {CATEGORIES[cat]?.label}
                </Text>
                <Text style={{ fontSize: 13.5, color: colors.ink, fontWeight: '700' }}>
                  {selectedZone ? (selectedZone.name.split(' — ')[1] || selectedZone.name) : ''}
                </Text>
              </View>
            </View>

            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.ink }}>
              Add detail (optional)
            </Text>
            <Text style={{ fontSize: 13, color: colors.inkSoft, lineHeight: 18 }}>
              Describe what you saw — no personal info, no GPS coordinates. Give enough context for neighbors to recognize the situation.
            </Text>

            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="What did you see or hear?"
              placeholderTextColor={colors.inkFaint}
              multiline
              style={{
                borderWidth: 1.5, borderColor: colors.line, borderRadius: radius.control,
                padding: 14, fontSize: 14.5, color: colors.ink, backgroundColor: colors.surface,
                minHeight: 110, textAlignVertical: 'top', lineHeight: 21,
              }}
            />

            <Card style={{ padding: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <Icon name="shield" size={14} color={colors.inkFaint} style={{ marginTop: 1 }} />
                <Text style={{ fontSize: 12, color: colors.inkFaint, flex: 1, lineHeight: 17 }}>
                  Your report is anonymous to other subscribers. Your trust score is shown to help establish credibility.
                </Text>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={{
        padding: spacing.pad, paddingBottom: 34,
        backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.line,
        flexDirection: 'row', gap: 10,
      }}>
        {step > 0 && (
          <Btn
            label="Back"
            variant="outline"
            onPress={() => setStep(s => s - 1)}
            style={{ flex: 1 }}
          />
        )}
        <Btn
          label={step === 2 ? 'Submit Report' : 'Next'}
          icon={step === 2 ? 'flag' : 'chevron-right'}
          onPress={handleNext}
          disabled={!canNext[step]}
          style={{ flex: 2 }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
