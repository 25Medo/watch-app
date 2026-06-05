# Watch — React Native App

Community safety coordination platform. No GPS tracking.

## Setup

```bash
cd WatchApp
npm install
npx expo start
```

Then scan the QR code with the **Expo Go** app on iOS or Android, or press `i` for iOS simulator / `a` for Android emulator.

## Stack

- **React Native + Expo** (SDK 51)
- **React Navigation v6** — Bottom tabs + native stack modals
- **Zustand** — State management
- **@expo/vector-icons** (Feather) — Icons

## Structure

```
src/
  theme/          Hearth design tokens (colors, spacing, radii)
  data/seed.js    Mock data + CATEGORIES constant
  store/index.js  Zustand store with all actions
  components/     Icon, primitives (Card, Btn, Avatar, CatMark, etc.)
  screens/        HomeScreen, PatrolsScreen, ProfileScreen,
                  IncidentDetailScreen, ReportScreen
  navigation/     Root stack + bottom tabs with FAB
```

## Key design decisions

- **No GPS**: Zone membership is subscription-based only
- **Patrol gating**: Suggest patrol button only appears once incident reaches 3 confirmations
- **Trust score**: Deterministic — reports + confirmations, no ML
- **Hearth design system**: Warm paper palette, teal accent, roomy cards (20px radius)
