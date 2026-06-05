import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
} from 'react-native';
import { useStore } from '../store';
import { useTheme } from '../theme/ThemeContext';
import { CATEGORIES } from '../data/seed';
import { radius, spacing } from '../theme';
import { Avatar, CatMark, StatusTag, Card, SectionHead } from '../components/primitives';
import Icon from '../components/Icon';

// ── AvatarStack ────────────────────────────────────────────────────────────
function AvatarStack({ count, max = 4 }) {
  const { colors } = useTheme();
  const shown = Math.min(count, max);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {Array.from({ length: shown }).map((_, i) => (
        <View key={i} style={{
          width: 22, height: 22, borderRadius: 11,
          backgroundColor: colors.accent + '33',
          borderWidth: 2, borderColor: colors.surface,
          marginLeft: i > 0 ? -7 : 0, zIndex: shown - i,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="user" size={10} color={colors.accent} />
        </View>
      ))}
      {count > max && (
        <Text style={{ fontSize: 10, fontWeight: '700', color: colors.inkFaint, marginLeft: 4 }}>
          +{count - max}
        </Text>
      )}
    </View>
  );
}

// ── PatrolCard ─────────────────────────────────────────────────────────────
function PatrolCard({ patrol, onOpenIncident, onRSVP }) {
  const { colors } = useTheme();
  const incident = useStore(s => s.incidents.find(i => i.id === patrol.incident));
  const zone = useStore(s => s.zones.find(z => z.id === incident?.zone));
  const spotsLeft = patrol.slots - patrol.going;

  return (
    <Card style={{ marginHorizontal: spacing.pad, marginBottom: 10 }}>
      {/* Incident link */}
      {incident && (
        <TouchableOpacity
          onPress={() => onOpenIncident(incident.id)}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 8,
            padding: 12, paddingHorizontal: spacing.pad,
            borderBottomWidth: 1, borderBottomColor: colors.lineSoft,
            backgroundColor: colors.surfaceAlt,
            borderTopLeftRadius: radius.card, borderTopRightRadius: radius.card,
          }}
        >
          <CatMark cat={incident.cat} size={24} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.inkFaint, marginBottom: 1 }}>
              In response to
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.ink }} numberOfLines={1}>
              {incident.title}
            </Text>
          </View>
          <StatusTag status={incident.status} />
          <Icon name="chevron-right" size={14} color={colors.inkFaint} />
        </TouchableOpacity>
      )}

      <View style={{ padding: spacing.pad }}>
        {/* Host + time */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Avatar initials={patrol.host.slice(0, 2)} size={32} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.ink }}>{patrol.host}</Text>
            <Text style={{ fontSize: 11.5, color: colors.inkFaint }}>{patrol.ago}</Text>
          </View>
        </View>

        {/* Comment */}
        <Text style={{ fontSize: 13.5, color: colors.inkSoft, lineHeight: 19, marginBottom: 12 }}>
          {patrol.comment}
        </Text>

        {/* Time + Gather */}
        <View style={{ gap: 6, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            <Icon name="clock" size={14} color={colors.inkFaint} style={{ marginTop: 1 }} />
            <Text style={{ fontSize: 13, color: colors.inkSoft, flex: 1, lineHeight: 18 }}>
              {patrol.time}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            <Icon name="map-pin" size={14} color={colors.inkFaint} style={{ marginTop: 1 }} />
            <Text style={{ fontSize: 13, color: colors.inkSoft, flex: 1, lineHeight: 18 }}>
              {patrol.gather}
            </Text>
          </View>
        </View>

        {/* Footer: going + RSVP */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <AvatarStack count={patrol.going} />
          <Text style={{ fontSize: 12, color: colors.inkFaint, flex: 1 }}>
            {patrol.going}/{patrol.slots} going{spotsLeft > 0 ? ` · ${spotsLeft} spots left` : ''}
          </Text>
          <TouchableOpacity
            onPress={() => onRSVP(patrol.id)}
            activeOpacity={0.75}
            style={{
              borderRadius: radius.control,
              paddingHorizontal: 14, paddingVertical: 8,
              backgroundColor: patrol.goingByMe ? colors.accentSoft : colors.accent,
              borderWidth: 1.5,
              borderColor: patrol.goingByMe ? colors.accent : 'transparent',
            }}
          >
            <Text style={{
              fontSize: 13, fontWeight: '700',
              color: patrol.goingByMe ? colors.accent : colors.onAccent,
            }}>
              {patrol.goingByMe ? 'Going ✓' : "I'm in"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}

// ── PatrolsScreen ──────────────────────────────────────────────────────────
export default function PatrolsScreen({ navigation }) {
  const { colors } = useTheme();
  const patrols = useStore(s => s.patrols);
  const toggleRSVP = useStore(s => s.toggleRSVP);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{
        paddingTop: 54, paddingHorizontal: spacing.pad, paddingBottom: 16,
        backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.line,
      }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.ink, letterSpacing: -0.4 }}>
          Patrols
        </Text>
        <Text style={{ fontSize: 13, color: colors.inkFaint, marginTop: 3 }}>
          Community walkthroughs organized in response to incidents
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}>
        <SectionHead
          title="Active & Upcoming"
          subtitle={`${patrols.length} patrol${patrols.length !== 1 ? 's' : ''}`}
        />

        {patrols.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: spacing.pad }}>
            <Icon name="navigation" size={32} color={colors.inkFaint} />
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.ink, marginTop: 14, marginBottom: 6 }}>
              No patrols yet
            </Text>
            <Text style={{ fontSize: 13.5, color: colors.inkSoft, textAlign: 'center', lineHeight: 19 }}>
              Patrols are suggested from within verified incidents. When a neighbor organizes one, it shows up here.
            </Text>
          </View>
        ) : (
          patrols.map(p => (
            <PatrolCard
              key={p.id}
              patrol={p}
              onOpenIncident={(id) => navigation.navigate('IncidentDetail', { incidentId: id })}
              onRSVP={toggleRSVP}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
