import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Switch,
} from 'react-native';
import { useStore } from '../store';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing } from '../theme';
import { Avatar, ContextBadge, Card, SectionHead } from '../components/primitives';
import Icon from '../components/Icon';

// ── TrustRing ──────────────────────────────────────────────────────────────
function TrustRing({ trust }) {
  const { colors } = useTheme();
  const size = 88;
  const strokeWidth = 7;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (trust / 100) * circ;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* SVG-less approach: ring with border */}
      <View style={{
        width: size, height: size, borderRadius: size / 2,
        borderWidth: strokeWidth, borderColor: colors.lineSoft,
        position: 'absolute',
      }} />
      <View style={{
        width: size - strokeWidth * 2, height: size - strokeWidth * 2,
        borderRadius: (size - strokeWidth * 2) / 2,
        backgroundColor: colors.surface,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.ink }}>{trust}</Text>
        <Text style={{ fontSize: 10, fontWeight: '700', color: colors.inkFaint, letterSpacing: 0.5 }}>TRUST</Text>
      </View>
    </View>
  );
}

// ── Stat ──────────────────────────────────────────────────────────────────
function Stat({ value, label }) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: colors.ink }}>{value}</Text>
      <Text style={{ fontSize: 11, color: colors.inkFaint, fontWeight: '600' }}>{label}</Text>
    </View>
  );
}

// ── SubRow ─────────────────────────────────────────────────────────────────
function SubRow({ zone, onToggleSub, onToggleWatch }) {
  const { colors } = useTheme();
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center',
      paddingVertical: 14, paddingHorizontal: spacing.pad,
      borderBottomWidth: 1, borderBottomColor: colors.lineSoft,
    }}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink }} numberOfLines={1}>
            {zone.name.split(' — ')[1] || zone.name}
          </Text>
          <ContextBadge context={zone.context} />
        </View>
        <Text style={{ fontSize: 12, color: colors.inkFaint }}>
          {zone.subscribers} subscribers · {zone.onWatch} on watch
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {/* Watch toggle */}
        <TouchableOpacity
          onPress={() => onToggleWatch(zone.id)}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 4,
            borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5,
            backgroundColor: zone.watching ? colors.watch + '20' : colors.surfaceAlt,
            borderWidth: 1.5, borderColor: zone.watching ? colors.watch : colors.line,
          }}
        >
          <View style={{
            width: 6, height: 6, borderRadius: 3,
            backgroundColor: zone.watching ? colors.watch : colors.inkFaint,
          }} />
          <Text style={{
            fontSize: 11, fontWeight: '700',
            color: zone.watching ? colors.watch : colors.inkSoft,
          }}>
            {zone.watching ? 'On' : 'Off'}
          </Text>
        </TouchableOpacity>
        {/* Sub toggle */}
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

// ── ProfileScreen ──────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const { colors } = useTheme();
  const user = useStore(s => s.user);
  const zones = useStore(s => s.zones);
  const toggleSub = useStore(s => s.toggleSub);
  const toggleWatch = useStore(s => s.toggleWatch);

  const subscribedZones = zones.filter(z => z.subscribed);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{
        paddingTop: 54, paddingHorizontal: spacing.pad, paddingBottom: 16,
        backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.line,
      }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.ink, letterSpacing: -0.4 }}>
          You
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile hero */}
        <View style={{
          backgroundColor: colors.surface,
          marginBottom: 16, paddingVertical: 28, paddingHorizontal: spacing.pad,
          alignItems: 'center', gap: 14,
          borderBottomWidth: 1, borderBottomColor: colors.line,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <Avatar initials={user.initials} size={60} color={colors.accent} />
            <TrustRing trust={user.trust} />
          </View>
          <Text style={{ fontSize: 17, fontWeight: '800', color: colors.ink }}>{user.name}</Text>
          <Text style={{ fontSize: 12, color: colors.inkFaint }}>Member since {user.joined}</Text>

          {/* Stats */}
          <View style={{
            flexDirection: 'row', gap: 28, marginTop: 6,
            paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.lineSoft, width: '100%',
            justifyContent: 'center',
          }}>
            <Stat value={user.reports} label="Reports" />
            <Stat value={user.confirms} label="Confirms" />
            <Stat value={user.verified} label="Verified" />
          </View>
        </View>

        {/* Trust explanation */}
        <Card style={{ marginHorizontal: spacing.pad, marginBottom: 20, padding: spacing.pad }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
            <View style={{
              width: 36, height: 36, borderRadius: 10,
              backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="award" size={18} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 4 }}>
                Community Trust Score
              </Text>
              <Text style={{ fontSize: 12.5, color: colors.inkSoft, lineHeight: 18 }}>
                Your trust score reflects your history of accurate reports and confirmations. Higher scores give your reports more visibility and credibility in the feed.
              </Text>
            </View>
          </View>
        </Card>

        {/* Subscriptions */}
        <SectionHead
          title="Your Zones"
          subtitle={`${subscribedZones.length} subscribed`}
        />
        <Card style={{ marginHorizontal: spacing.pad, marginBottom: 20, overflow: 'hidden' }}>
          {zones.map((zone, i) => (
            <SubRow
              key={zone.id}
              zone={zone}
              onToggleSub={toggleSub}
              onToggleWatch={toggleWatch}
            />
          ))}
        </Card>

        {/* Privacy note */}
        <View style={{ paddingHorizontal: spacing.pad }}>
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
