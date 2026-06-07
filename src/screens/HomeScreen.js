import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useStore } from '../store';
import { useTheme } from '../theme/ThemeContext';
import { CATEGORIES, CATEGORY_ORDER } from '../data/seed';
import { radius, spacing } from '../theme';
import { CatMark, StatusTag, ConfirmTrack, Card, SectionHead } from '../components/primitives';
import Icon from '../components/Icon';
import OfflineBanner from '../components/OfflineBanner';
import { useConnectivity } from '../utils/connectivity';

function Wordmark() {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
      <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="shield" size={15} color={colors.onAccent} />
      </View>
      <Text style={{ fontSize: 19, fontWeight: '800', color: colors.ink, letterSpacing: -0.5 }}>Watch</Text>
    </View>
  );
}

function WatchChip({ zone, onToggle }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => onToggle(zone.id)}
      activeOpacity={0.75}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 6,
        borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6,
        backgroundColor: zone.watching ? colors.watch + '20' : colors.surfaceAlt,
        borderWidth: 1.5, borderColor: zone.watching ? colors.watch : colors.line,
      }}
    >
      <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: zone.watching ? colors.watch : colors.inkFaint }} />
      <Text style={{ fontSize: 12, fontWeight: '700', color: zone.watching ? colors.watch : colors.inkSoft }}>
        {zone.code}
      </Text>
    </TouchableOpacity>
  );
}

function CategoryFilter({ active, onChange }) {
  const { colors } = useTheme();
  const catColorMap = {
    medical: colors.catMedical, disturbance: colors.catDisturbance,
    suspicious: colors.catSuspicious, hazard: colors.catHazard,
    theft: colors.catTheft, lost: colors.catLost,
  };
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 6, paddingHorizontal: spacing.pad, paddingVertical: 2 }}>
      <TouchableOpacity
        onPress={() => onChange(null)}
        style={{ borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: !active ? colors.accent : colors.surfaceAlt, borderWidth: 1, borderColor: !active ? colors.accent : colors.line }}
      >
        <Text style={{ fontSize: 12, fontWeight: '700', color: !active ? colors.onAccent : colors.inkSoft }}>All</Text>
      </TouchableOpacity>
      {CATEGORY_ORDER.map(cat => {
        const on = active === cat;
        const fg = catColorMap[cat];
        return (
          <TouchableOpacity key={cat} onPress={() => onChange(on ? null : cat)}
            style={{ borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: on ? fg + '22' : colors.surfaceAlt, borderWidth: 1, borderColor: on ? fg : colors.line }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: on ? fg : colors.inkSoft }}>{CATEGORIES[cat].label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function IncidentCard({ incident, onOpen, onConfirm }) {
  const { colors } = useTheme();
  const zone = useStore(s => s.zones.find(z => z.id === incident.zone));
  const zoneName = zone ? (zone.name.split(' — ')[1] || zone.name) : '';
  const isResolved = incident.status === 'resolved';

  return (
    <Card onPress={() => onOpen(incident.id)}
      style={{ marginHorizontal: spacing.pad, marginBottom: 10, opacity: isResolved ? 0.65 : 1 }}>
      <View style={{ padding: spacing.pad }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
          <CatMark cat={incident.cat} size={36} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <StatusTag status={incident.status} />
              <Text style={{ fontSize: 11, color: colors.inkFaint }}>{incident.ago}</Text>
              {incident.flags >= 2 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Icon name="flag" size={10} color={colors.catLost} />
                  <Text style={{ fontSize: 10, color: colors.catLost, fontWeight: '700' }}>Flagged</Text>
                </View>
              )}
            </View>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.ink, lineHeight: 20 }}>{incident.title}</Text>
          </View>
        </View>

        <Text style={{ fontSize: 13.5, color: colors.inkSoft, lineHeight: 19, marginBottom: 12 }} numberOfLines={2}>
          {incident.note}
        </Text>

        {isResolved && incident.resolvedNote && (
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 10, padding: 8, backgroundColor: colors.accentSoft, borderRadius: radius.chip }}>
            <Icon name="check" size={12} color={colors.accent} style={{ marginTop: 1 }} />
            <Text style={{ fontSize: 12, color: colors.accent, flex: 1, lineHeight: 17 }}>{incident.resolvedNote}</Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 11, color: colors.inkFaint, flex: 1 }}>
            {zoneName} · {incident.reporter} ({incident.reporterTrust})
          </Text>
          {!isResolved && !incident.confirmedByMe && (
            <TouchableOpacity
              onPress={() => onConfirm(incident.id)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accent + '40' }}>
              <ConfirmTrack confirms={incident.confirms} />
              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.accent }}>Confirm</Text>
            </TouchableOpacity>
          )}
          {!isResolved && incident.confirmedByMe && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <ConfirmTrack confirms={incident.confirms} />
              <Text style={{ fontSize: 11, color: colors.inkFaint }}>Confirmed</Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const isOnline = useConnectivity();
  const zones = useStore(s => s.zones);
  const incidents = useStore(s => s.incidents);
  const toggleWatch = useStore(s => s.toggleWatch);
  const confirmIncident = useStore(s => s.confirmIncident);
  const [catFilter, setCatFilter] = useState(null);
  const [showResolved, setShowResolved] = useState(false);
  const [toast, setToast] = useState('');

  const subscribedZoneIds = new Set(zones.filter(z => z.subscribed).map(z => z.id));
  const active = incidents.filter(i => subscribedZoneIds.has(i.zone) && i.status !== 'resolved' && (!catFilter || i.cat === catFilter));
  const resolved = incidents.filter(i => subscribedZoneIds.has(i.zone) && i.status === 'resolved' && (!catFilter || i.cat === catFilter));
  const watchingZones = zones.filter(z => z.subscribed);

  const handleConfirm = (id) => {
    const msg = confirmIncident(id);
    if (msg) { setToast(msg); setTimeout(() => setToast(''), 3200); }
  };

  const openDetail = (id) => navigation.navigate('IncidentDetail', { incidentId: id });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Offline banner */}
      {!isOnline && <OfflineBanner />}

      {/* Header */}
      <View style={{
        paddingTop: 54, paddingHorizontal: spacing.pad, paddingBottom: 12,
        backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.line,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <Wordmark />
          <TouchableOpacity>
            <Icon name="bell" size={22} color={isOnline ? colors.inkSoft : colors.catDisturbance} />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -spacing.pad }}>
          <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: spacing.pad }}>
            {watchingZones.map(z => <WatchChip key={z.id} zone={z} onToggle={toggleWatch} />)}
          </View>
        </ScrollView>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}>
        <View style={{ marginBottom: 14 }}>
          <CategoryFilter active={catFilter} onChange={setCatFilter} />
        </View>

        <SectionHead title="Live Feed" subtitle={`${active.length} active incident${active.length !== 1 ? 's' : ''} in your zones`} />

        {active.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: spacing.pad }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Icon name="shield" size={26} color={colors.accent} />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.ink, marginBottom: 6 }}>All clear</Text>
            <Text style={{ fontSize: 13.5, color: colors.inkSoft, textAlign: 'center', lineHeight: 19 }}>
              No active incidents in your subscribed zones right now.
            </Text>
          </View>
        ) : (
          active.map(inc => <IncidentCard key={inc.id} incident={inc} onOpen={openDetail} onConfirm={handleConfirm} />)
        )}

        {/* Resolved section */}
        {resolved.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => setShowResolved(v => !v)}
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.pad, paddingVertical: 10, gap: 8 }}>
              <Icon name="check" size={14} color={colors.inkFaint} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.inkFaint, flex: 1 }}>
                {resolved.length} resolved incident{resolved.length !== 1 ? 's' : ''}
              </Text>
              <Icon name={showResolved ? 'chevron-down' : 'chevron-right'} size={14} color={colors.inkFaint} />
            </TouchableOpacity>
            {showResolved && resolved.map(inc => <IncidentCard key={inc.id} incident={inc} onOpen={openDetail} onConfirm={handleConfirm} />)}
          </View>
        )}
      </ScrollView>

      {toast ? (
        <View style={{ position: 'absolute', left: 14, right: 14, bottom: 12, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.ink, borderRadius: radius.control + 2, paddingVertical: 12, paddingHorizontal: 16, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 }}>
            <Icon name="check" size={15} color={colors.bg} />
            <Text style={{ fontSize: 13.5, fontWeight: '600', color: colors.bg }}>{toast}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
