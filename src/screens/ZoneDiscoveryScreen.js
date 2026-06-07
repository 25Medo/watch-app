import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
} from 'react-native';
import { useStore } from '../store';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing } from '../theme';
import { ContextBadge, Card } from '../components/primitives';
import Icon from '../components/Icon';

function ZoneRow({ zone, onToggleSub }) {
  const { colors } = useTheme();
  const isSub = zone.subscribed;

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center',
      paddingVertical: 14, paddingHorizontal: spacing.pad,
      borderBottomWidth: 1, borderBottomColor: colors.lineSoft,
    }}>
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink }}>
            {zone.name.split(' — ')[1] || zone.name}
          </Text>
          <ContextBadge context={zone.context} />
        </View>
        {zone.parent && (
          <Text style={{ fontSize: 11.5, color: colors.inkFaint }}>{zone.parent}</Text>
        )}
        <Text style={{ fontSize: 12, color: colors.inkFaint }}>
          {zone.subscribers.toLocaleString()} subscribers · {zone.onWatch} on watch now
          {zone.expiresInH ? ` · expires in ${zone.expiresInH}h` : ''}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => onToggleSub(zone.id)}
        activeOpacity={0.75}
        style={{
          borderRadius: radius.control,
          paddingHorizontal: 14, paddingVertical: 8,
          backgroundColor: isSub ? colors.accentSoft : colors.accent,
          borderWidth: 1.5, borderColor: isSub ? colors.accent : 'transparent',
          marginLeft: 12,
        }}
      >
        <Text style={{
          fontSize: 12.5, fontWeight: '700',
          color: isSub ? colors.accent : colors.onAccent,
        }}>
          {isSub ? 'Subscribed ✓' : 'Subscribe'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ZoneDiscoveryScreen({ navigation }) {
  const { colors } = useTheme();
  const zones = useStore(s => s.zones);
  const toggleSub = useStore(s => s.toggleSub);
  const [query, setQuery] = useState('');

  const filtered = zones.filter(z => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return z.name.toLowerCase().includes(q) || z.context.includes(q) || z.parent?.toLowerCase().includes(q);
  });

  const byContext = {
    neighborhood: filtered.filter(z => z.context === 'neighborhood'),
    venue:        filtered.filter(z => z.context === 'venue'),
    event:        filtered.filter(z => z.context === 'event'),
  };

  const contextLabels = { neighborhood: 'Neighborhoods', venue: 'Venues', event: 'Events' };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{
        paddingTop: 54, paddingHorizontal: spacing.pad, paddingBottom: 14,
        backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.line,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
            <Icon name="chevron-left" size={24} color={colors.ink} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.ink, flex: 1, letterSpacing: -0.3 }}>
            Discover Zones
          </Text>
        </View>

        {/* Search */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 10,
          backgroundColor: colors.surfaceAlt, borderRadius: radius.control,
          paddingHorizontal: 12, paddingVertical: 10,
          borderWidth: 1.5, borderColor: colors.line,
        }}>
          <Icon name="list" size={16} color={colors.inkFaint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name, context, venue…"
            placeholderTextColor={colors.inkFaint}
            style={{ flex: 1, fontSize: 14, color: colors.ink }}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Icon name="x" size={16} color={colors.inkFaint} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Privacy note */}
        <View style={{
          flexDirection: 'row', alignItems: 'flex-start', gap: 8,
          margin: spacing.pad, padding: 12,
          backgroundColor: colors.accentSoft, borderRadius: radius.control,
        }}>
          <Icon name="shield" size={14} color={colors.accent} style={{ marginTop: 1 }} />
          <Text style={{ fontSize: 12, color: colors.accent, flex: 1, lineHeight: 17 }}>
            Subscribing adds a zone to your feed and enables notifications. No location access is required.
          </Text>
        </View>

        {Object.entries(byContext).map(([ctx, list]) => {
          if (list.length === 0) return null;
          const subCount = list.filter(z => z.subscribed).length;
          return (
            <View key={ctx} style={{ marginBottom: 8 }}>
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                paddingHorizontal: spacing.pad, paddingVertical: 10,
              }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: colors.inkFaint, letterSpacing: 0.5, textTransform: 'uppercase', flex: 1 }}>
                  {contextLabels[ctx]}
                </Text>
                <Text style={{ fontSize: 12, color: colors.inkFaint }}>
                  {subCount}/{list.length} subscribed
                </Text>
              </View>
              <Card style={{ marginHorizontal: spacing.pad, overflow: 'hidden' }}>
                {list.map(z => (
                  <ZoneRow key={z.id} zone={z} onToggleSub={toggleSub} />
                ))}
              </Card>
            </View>
          );
        })}

        {filtered.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: spacing.pad }}>
            <Icon name="list" size={28} color={colors.inkFaint} />
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.ink, marginTop: 14, marginBottom: 6 }}>
              No zones found
            </Text>
            <Text style={{ fontSize: 13.5, color: colors.inkSoft, textAlign: 'center' }}>
              Try a different search term.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
