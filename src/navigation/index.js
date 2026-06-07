import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import Icon from '../components/Icon';
import HomeScreen from '../screens/HomeScreen';
import PatrolsScreen from '../screens/PatrolsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import IncidentDetailScreen from '../screens/IncidentDetailScreen';
import ReportScreen from '../screens/ReportScreen';
import ZoneDiscoveryScreen from '../screens/ZoneDiscoveryScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ReportFAB({ onPress, colors }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        width: 54, height: 54, borderRadius: 999,
        backgroundColor: colors.accent,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 10,
        shadowColor: colors.accent, shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
        elevation: 8,
        borderWidth: 3, borderColor: colors.surface,
      }}
    >
      <Icon name="plus" size={26} color={colors.onAccent} />
    </TouchableOpacity>
  );
}

function MainTabs({ navigation }) {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          borderTopWidth: 1,
          height: 82,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarLabelStyle: { fontSize: 10.5, fontWeight: '700' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen}
        options={{ tabBarIcon: ({ color }) => <Icon name="home" size={22} color={color} /> }} />
      <Tab.Screen name="Patrols" component={PatrolsScreen}
        options={{ tabBarIcon: ({ color }) => <Icon name="route" size={22} color={color} /> }} />
      <Tab.Screen
        name="Report"
        component={() => <View style={{ flex: 1 }} />}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => null,
          tabBarButton: () => (
            <ReportFAB colors={colors} onPress={() => navigation.navigate('ReportModal')} />
          ),
        }}
      />
      <Tab.Screen name="You" component={ProfileScreen}
        options={{ tabBarIcon: ({ color }) => <Icon name="person" size={22} color={color} /> }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { colors, isDark } = useTheme();
  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: colors.accent, background: colors.bg,
          card: colors.surface, text: colors.ink,
          border: colors.line, notification: colors.accent,
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="IncidentDetail" component={IncidentDetailScreen} options={{ presentation: 'card' }} />
        <Stack.Screen name="ReportModal" component={ReportScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="ZoneDiscovery" component={ZoneDiscoveryScreen} options={{ presentation: 'card' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
