// Hearth design system — oklch values converted to hex for React Native

export const lightColors = {
  bg: '#f7f4ed',
  surface: '#fefcf8',
  surfaceAlt: '#f0ece2',
  ink: '#2e2a22',
  inkSoft: '#6f6a60',
  inkFaint: '#9b9488',
  line: '#ddd8ce',
  lineSoft: '#e8e4da',
  accent: '#3a9e8f',
  accentDeep: '#2a7e72',
  accentSoft: '#e6f4f1',
  onAccent: '#f9fffe',
  verified: '#389084',
  watch: '#3a9e8f',
  // Category hue approximations
  catMedical: '#c4682a',
  catDisturbance: '#c49e2a',
  catSuspicious: '#9e3ac4',
  catHazard: '#7ab030',
  catTheft: '#2a6bc4',
  catLost: '#c42a6b',
};

export const darkColors = {
  bg: '#2c2a24',
  surface: '#343028',
  surfaceAlt: '#3e3a30',
  ink: '#f2ede4',
  inkSoft: '#b5b0a5',
  inkFaint: '#857f75',
  line: '#4a4640',
  lineSoft: '#3c3830',
  accent: '#3a9e8f',
  accentDeep: '#2a7e72',
  accentSoft: '#1e3532',
  onAccent: '#f9fffe',
  verified: '#389084',
  watch: '#3a9e8f',
  catMedical: '#c4682a',
  catDisturbance: '#c49e2a',
  catSuspicious: '#9e3ac4',
  catHazard: '#7ab030',
  catTheft: '#2a6bc4',
  catLost: '#c42a6b',
};

export const radius = {
  card: 20,
  control: 13,
  pill: 999,
  chip: 10,
};

export const spacing = {
  pad: 18,     // roomy
  padSm: 14,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const typography = {
  display: 'System',    // Schibsted Grotesk — fallback to System
  body: 'System',       // Hanken Grotesk — fallback to System
  sizes: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 28,
  },
};

export function catColor(cat, colors) {
  const map = {
    medical: colors.catMedical,
    disturbance: colors.catDisturbance,
    suspicious: colors.catSuspicious,
    hazard: colors.catHazard,
    theft: colors.catTheft,
    lost: colors.catLost,
  };
  return map[cat] || colors.inkFaint;
}

export function catColorSoft(cat, colors, isDark) {
  const base = catColor(cat, colors);
  // Return transparent version for soft backgrounds
  return base + (isDark ? '33' : '18');
}
