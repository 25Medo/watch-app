import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { CATEGORIES } from '../data/seed';
import Icon from './Icon';
import { radius, spacing, typography } from '../theme';

// ── Avatar ────────────────────────────────────────────────────────────────
export function Avatar({ initials = '?', size = 30, color }) {
  const { colors } = useTheme();
  const bg = color || colors.accentSoft;
  const fg = color ? colors.onAccent : colors.accent;
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: bg, alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ fontSize: size * 0.38, fontWeight: '700', color: fg, letterSpacing: 0.3 }}>
        {initials.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}

// ── CatMark ────────────────────────────────────────────────────────────────
export function CatMark({ cat, size = 28 }) {
  const { colors, isDark } = useTheme();
  const C = CATEGORIES[cat];
  if (!C) return null;
  const catColorMap = {
    medical: colors.catMedical,
    disturbance: colors.catDisturbance,
    suspicious: colors.catSuspicious,
    hazard: colors.catHazard,
    theft: colors.catTheft,
    lost: colors.catLost,
  };
  const fg = catColorMap[cat] || colors.inkFaint;
  const bg = fg + (isDark ? '33' : '20');
  return (
    <View style={{
      width: size, height: size, borderRadius: size * 0.38,
      backgroundColor: bg, alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name={C.icon} size={size * 0.55} color={fg} />
    </View>
  );
}

// ── ContextBadge ──────────────────────────────────────────────────────────
export function ContextBadge({ context }) {
  const { colors } = useTheme();
  const map = {
    neighborhood: { label: 'Neighborhood', color: colors.accent },
    venue:        { label: 'Venue',         color: colors.catTheft },
    event:        { label: 'Event',         color: colors.catSuspicious },
  };
  const cfg = map[context] || map.neighborhood;
  return (
    <View style={{
      borderRadius: radius.chip,
      backgroundColor: cfg.color + '20',
      paddingHorizontal: 7, paddingVertical: 2,
    }}>
      <Text style={{ fontSize: 10, fontWeight: '700', color: cfg.color, letterSpacing: 0.3, textTransform: 'uppercase' }}>
        {cfg.label}
      </Text>
    </View>
  );
}

// ── StatusTag ─────────────────────────────────────────────────────────────
export function StatusTag({ status }) {
  const { colors } = useTheme();
  const map = {
    reported: { label: 'Reported', color: colors.catDisturbance },
    verified: { label: 'Verified', color: colors.verified },
    resolved: { label: 'Resolved', color: colors.inkFaint },
  };
  const cfg = map[status] || map.reported;
  return (
    <View style={{
      borderRadius: radius.pill,
      backgroundColor: cfg.color + '22',
      paddingHorizontal: 8, paddingVertical: 3,
    }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: cfg.color }}>
        {cfg.label}
      </Text>
    </View>
  );
}

// ── ConfirmTrack ──────────────────────────────────────────────────────────
export function ConfirmTrack({ confirms, needed = 3 }) {
  const { colors } = useTheme();
  const filled = Math.min(confirms, needed);
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {Array.from({ length: needed }).map((_, i) => (
        <View key={i} style={{
          width: 14, height: 5, borderRadius: 3,
          backgroundColor: i < filled ? colors.accent : colors.lineSoft,
        }} />
      ))}
    </View>
  );
}

// ── Btn ────────────────────────────────────────────────────────────────────
export function Btn({ label, icon, onPress, variant = 'fill', size = 'md', disabled, style }) {
  const { colors } = useTheme();
  const isFill = variant === 'fill';
  const isGhost = variant === 'ghost';
  const isOutline = variant === 'outline';

  const pad = size === 'sm' ? { paddingHorizontal: 12, paddingVertical: 7 } : { paddingHorizontal: 18, paddingVertical: 12 };
  const fontSize = size === 'sm' ? 13 : 15;

  const bg = isFill ? colors.accent : isOutline ? 'transparent' : 'transparent';
  const fg = isFill ? colors.onAccent : colors.accent;
  const border = isOutline ? { borderWidth: 1.5, borderColor: colors.accent } : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={[{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 6, borderRadius: radius.control,
        backgroundColor: bg, opacity: disabled ? 0.45 : 1,
        ...pad, ...border,
      }, style]}
    >
      {icon && <Icon name={icon} size={fontSize + 1} color={fg} />}
      <Text style={{ fontSize, fontWeight: '700', color: fg }}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, style, onPress }) {
  const { colors } = useTheme();
  const base = {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
  };
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[base, style]}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[base, style]}>{children}</View>;
}

// ── SectionHead ────────────────────────────────────────────────────────────
export function SectionHead({ title, subtitle, action, onAction }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10, paddingHorizontal: spacing.pad }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink, letterSpacing: -0.3 }}>{title}</Text>
        {subtitle ? <Text style={{ fontSize: 12, color: colors.inkFaint, marginTop: 1 }}>{subtitle}</Text> : null}
      </View>
      {action ? (
        <TouchableOpacity onPress={onAction}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.accent }}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
