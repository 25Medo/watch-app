import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import Icon from './Icon';

export default function OfflineBanner() {
  const { colors } = useTheme();
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
      backgroundColor: colors.catDisturbance, paddingVertical: 8, paddingHorizontal: 16,
    }}>
      <Icon name="radio" size={13} color="#fff" />
      <Text style={{ fontSize: 12.5, fontWeight: '700', color: '#fff' }}>
        No connection — showing cached data
      </Text>
    </View>
  );
}
