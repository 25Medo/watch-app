import React from 'react';
import { Feather } from '@expo/vector-icons';

// Thin wrapper around Feather icons to match the HTML prototype's icon set
export default function Icon({ name, size = 20, color, strokeWidth, style }) {
  // Map names used in prototype to Feather equivalents
  const map = {
    'home': 'home',
    'route': 'map',
    'person': 'user',
    'plus': 'plus',
    'check': 'check',
    'heart': 'heart',
    'alert-triangle': 'alert-triangle',
    'eye': 'eye',
    'zap': 'zap',
    'package': 'package',
    'user-x': 'user-x',
    'user': 'user',
    'users': 'users',
    'shield': 'shield',
    'map-pin': 'map-pin',
    'clock': 'clock',
    'chevron-right': 'chevron-right',
    'chevron-down': 'chevron-down',
    'chevron-left': 'chevron-left',
    'x': 'x',
    'bell': 'bell',
    'bell-off': 'bell-off',
    'flag': 'flag',
    'star': 'star',
    'award': 'award',
    'activity': 'activity',
    'calendar': 'calendar',
    'list': 'list',
    'message-circle': 'message-circle',
    'navigation': 'navigation',
    'alert-circle': 'alert-circle',
    'info': 'info',
    'layers': 'layers',
    'radio': 'radio',
  };
  return <Feather name={map[name] || name} size={size} color={color} style={style} />;
}
