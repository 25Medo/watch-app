import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useStore } from '../store';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing } from '../theme';
import { Avatar, ContextBadge, StatusTag, CatMark, Card, SectionHead } from '../components/primitives';
import Icon from '../components/Icon';

function TrustRing({ trust }) {
  const { colors } = useTheme();
  const size = 88;
  const strokeWidth = 7;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth, borderColor: colors.lineSoft, position: 'absolute' }} />
      <View style={{ width: size - strokeWidth * 2, height: size - strokeWidth * 2, borderRadius: (size - strokeWidth * 2) / 2, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.ink }}>{trust}</Text>
        <Text style={{ fontSize: 10, fontWeight: '700', color: colors.inkFaint, letterSpacing: 0.5 }}>TRUST</Text>
      </View>
    </View>
  );
}

function Stat({ value, label }) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: colors.ink }}>{value}</Text>
      <Text style={{ fontSize: 11, color: colors.inkFaint, fontWeight: '600' }}>{label}</Text>
    </View>
  );
}

function SubRow({ zone, onToggleSub, onToggleWatch }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: spacing.pad, borderBottomWidth: 1, borderBottomColor: colors.lineSoft }}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink }} numberOfLines={1}>
            {zone.name.split(' — ')[1] || zone.name}
          </Text>
          <ContextBadge context={zone.context} />
        </View>
        <Text style={{ fontSize: 12, color: colors.inkFaint }}>{zone.subscribers} subscribers · {zone.onWatch} on watch</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity
          onPress={() => onToggleWatch(zone.id)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: zone.watching ? colors.watch + '20' : colors.surfaceAlt, borderWidth: 1.5, borderColor: zone.watching ? colors.watch : colors.line }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: zone.watching ? colors.watch : colors.inkFaint }} />
          <Text style={{ fontSize: 11, fontWeight: '700', color: zone.watching ? colors.watch : colors.inkSoft }}>
            {zone.watching ? 'On' : 'Off'}
          </Text>
        </TouchableOpacity>
        <Switch
          value={zone.subscribed}
          onValueChange={() => onToggleSub(zone.id)}
          trackColor={{ false: colors.lineSoft, true: colors.accent + '88' }}
          thumbColor={zone.subscribed ? colors.accent : colors.inkFaint}
          ios_backgroundColor={colors.lineSoft}
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
      </View>
    </View>
  );
}

// ── My Reports row ────────────────────────────────────────────────────────
function MyReportRow({ incident, onOpen }) {
  const { colors } = useTheme();
  const zone = useStore(s => s.zones.find(z => z.id === incident.zone));
  const zoneName = zone ? (zone.name.split(' — ')[1] || zone.name) : '';
  const patrolCount = useStore(s => s.patrols.filter(p => p.incident === incident.id).length);

  return (
    <TouchableOpacity
      onPress={() => onOpen(incident.id)}
      activeOpacity={0.75}
      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: spacing.pad, borderBottomWidth: 1, borderBottomColor: colors.lineSoft, gap: 10 }}>
      <CatMark cat={incident.cat} size={30} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.ink, marginBottom: 3 }} numberOfLines={1}>
          {incident.title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 11.5, color: colors.inkFaint }}>{zoneName}</Text>
          <Text style={{ fontSize: 11.5, color: colors.inkFaint }}>·</Text>
          <Text style={{ fontSize: 11.5, color: colors.inkFaint }}>{incident.confirms} confirm{incident.confirms !== 1 ? 's' : ''}</Text>
          {patrolCount > 0 && (
            <>
              <Text style={{ fontSize: 11.5, color: colors.inkFaint }}>·</Text>
              <Text style={{ fontSize: 11.5, color: colors.accent }}>{patrolCount} patrol{patrolCount !== 1 ? 's' : ''}</Text>
            </>
          )}
        </View>
      </View>
      <StatusTag status={incident.status} />
      <Icon name="chevron-right" size={14} color={colors.inkFaint} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation }) {
  const { colors, mode, setOverride } = useTheme();
  const user = useStore(s => s.user);
  const zones = useStore(s => s.zones);
  const incidents = useStore(s => s.incidents);
  const toggleSub = useStore(s => s.toggleSub);
  const toggleWatch = useStore(s => s.toggleWatch);

  const subscribedZones = zones.filter(z => z.subscribed);
  const myReports = incidents.filter(i => i.reporter === 'You');

  const openDetail = (id) => navigation.navigate('IncidentDetail', { incidentId: id });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: 54, paddingHorizontal: spacing.pad, paddingBottom: 16, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.line }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.ink, letterSpacing: -0.4 }}>You</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero */}
        <View style={{ backgroundColor: colors.surface, marginBottom: 16, paddingVertical: 28, paddingHorizontal: spacing.pad, alignItems: 'center', gap: 14, borderBottomWidth: 1, borderBottomColor: colors.line }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <Avatar initials={user.initials} size={60} color={colors.accent} />
            <TrustRing trust={user.trust} />
          </View>
          <Text style={{ fontSize: 17, fontWeight: '800', color: colors.ink }}>{user.name}</Text>
          <Text style={{ fontSize: 12, color: colors.inkFaint }}>Member since {user.joined}</Text>
          <View style={{ flexDirection: 'row', gap: 28, marginTop: 6, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.lineSoft, width: '100%', justifyContent: 'center' }}>
            <Stat value={user.reports} label="Reports" />
            <Stat value={user.confirms} label="Confirms" />
            <Stat value={user.verified} label="Verified" />
          </View>
        </View>

        {/* Trust card */}
        <Card style={{ marginHorizontal: spacing.pad, marginBottom: 20, padding: spacing.pad }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="award" size={18} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 4 }}>Community Trust Score</Text>
              <Text style={{ fontSize: 12.5, color: colors.inkSoft, lineHeight: 18 }}>
                Accurate reports and confirmations raise your score. Flagged reports lower it.
              </Text>
            </View>
          </View>
        </Card>

        {/* My Reports */}
        {myReports.length > 0 && (
          <>
            <SectionHead title="My Reports" subtitle={`${myReports.length} submitted`} />
            <Card style={{ marginHorizontal: spacing.pad, marginBottom: 20, overflow: 'hidden' }}>
              {myReports.map(inc => <MyReportRow key={inc.id} incident={inc} onOpen={openDetail} />)}
            </Card>
          </>
        )}

        {/* Zones */}
        <SectionHead
          title="Your Zones"
          subtitle={`${subscribedZones.length} subscribed`}
          action="Discover more"
          onAction={() => navigation.navigate('ZoneDiscovery')}
        />
        <Card style={{ marginHorizontal: spacing.pad, marginBottom: 20, overflow: 'hidden' }}>
          {subscribedZones.map(zone => (
            <SubRow key={zone.id} zone={zone} onToggleSub={toggleSub} onToggleWatch={toggleWatch} />
          ))}
          <TouchableOpacity
            onPress={() => navigation.navigate('ZoneDiscovery')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, paddingHorizontal: spacing.pad }}>
            <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="plus" size={15} color={colors.accent} />
            </View>
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.accent, flex: 1 }}>Discover more zones</Text>
            <Icon name="chevron-right" size={14} color={colors.accent} />
          </TouchableOpacity>
        </Card>

        {/* Appearance + privacy */}
        <View style={{ paddingHorizontal: spacing.pad }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.ink, marginBottom: 8 }}>Appearance</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
            {['system', 'light', 'dark'].map(opt => {
              const active = (mode === 'light' && opt === 'light') || (mode === 'dark' && opt === 'dark') || (mode !== 'light' && mode !== 'dark' && opt === 'system');
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setOverride(opt)}
                  style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: radius.pill, backgroundColor: active ? colors.accent : colors.surfaceAlt, borderWidth: 1, borderColor: active ? colors.accentDeep : colors.line }}>
                  <Text style={{ color: active ? colors.onAccent : colors.ink, fontWeight: '700', textTransform: 'capitalize' }}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            <Icon name="shield" size={14} color={colors.inkFaint} style={{ marginTop: 1 }} />
            <Text style={{ fontSize: 12, color: colors.inkFaint, flex: 1, lineHeight: 17 }}>
              Watch never accesses your location. Zone membership is based on your subscription — never on GPS or tracking.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
