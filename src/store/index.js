import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { seed } from '../data/seed';
import { notify } from '../utils/notifications';

const STORAGE_KEY = 'watch:state:v1';
const initial = seed();

async function persist(state) {
  try {
    const { zones, incidents, patrols, user } = state;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ zones, incidents, patrols, user }));
  } catch {}
}

export const useStore = create((set, get) => ({
  ...initial,
  hydrated: false,

  // Load persisted state on app start
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        set({ ...saved, hydrated: true });
        return;
      }
    } catch {}
    set({ hydrated: true });
  },

  toggleWatch: (id) => {
    set(s => {
      const zones = s.zones.map(z =>
        z.id === id ? { ...z, watching: !z.watching, onWatch: z.onWatch + (z.watching ? -1 : 1) } : z
      );
      persist({ ...s, zones });
      return { zones };
    });
  },

  toggleSub: (id) => {
    set(s => {
      const zones = s.zones.map(z =>
        z.id === id ? { ...z, subscribed: !z.subscribed } : z
      );
      persist({ ...s, zones });
      return { zones };
    });
  },

  toggleRSVP: (id) => {
    set(s => {
      const patrols = s.patrols.map(p =>
        p.id === id ? { ...p, goingByMe: !p.goingByMe, going: p.going + (p.goingByMe ? -1 : 1) } : p
      );
      persist({ ...s, patrols });
      return { patrols };
    });
  },

  confirmIncident: (id) => {
    const s = get();
    const inc = s.incidents.find(i => i.id === id);
    if (!inc || inc.confirmedByMe) return null;
    const confirms = inc.confirms + 1;
    const promote = inc.status === 'reported' && confirms >= 3;
    const incidents = s.incidents.map(i =>
      i.id === id ? { ...i, confirms, confirmedByMe: true, status: promote ? 'verified' : i.status } : i
    );
    const user = { ...s.user, confirms: s.user.confirms + 1 };
    set({ incidents, user });
    persist({ ...s, incidents, user });

    // Notify the reporter if it's their own report reaching a milestone
    if (inc.reporter === 'You') {
      if (promote) notify('Your report was verified', `"${inc.title}" reached 3 confirmations and is now Verified.`);
      else if (confirms === 1) notify('Someone confirmed your report', `"${inc.title}" got its first confirmation.`);
    }

    return promote
      ? 'Confirmed — this report is now Verified. Thank you.'
      : 'Confirmed. Thanks for the second set of eyes.';
  },

  submitReport: ({ zone, cat, note }) => {
    const s = get();
    const C_LABELS = {
      medical: 'Medical', disturbance: 'Disturbance', suspicious: 'Suspicious',
      hazard: 'Hazard', theft: 'Theft', lost: 'Lost person',
    };
    const z = s.zones.find(zn => zn.id === zone);
    const shortName = z?.name.split(' — ')[1] || z?.name || '';
    const inc = {
      id: 'i-' + Date.now(), zone, cat,
      title: `${C_LABELS[cat]} reported in ${shortName}`,
      note: note.trim() || 'No further detail provided.',
      reporter: 'You', reporterTrust: s.user.trust, ago: 'now',
      confirms: 0, confirmedByMe: false, status: 'reported',
      flags: 0, flaggedByMe: false, resolvedNote: null,
    };
    const incidents = [inc, ...s.incidents];
    const user = { ...s.user, reports: s.user.reports + 1 };
    set({ incidents, user });
    persist({ ...s, incidents, user });

    // Notify subscribers in this zone (simulated via local notification)
    notify('New incident in your zone', `${C_LABELS[cat]} reported in ${shortName}.`);
    return `Report posted to ${shortName}. Neighbors on watch are notified.`;
  },

  suggestPatrol: ({ incident, comment, time, gather }) => {
    const s = get();
    const inc = s.incidents.find(i => i.id === incident);
    const patrol = {
      id: 'p-' + Date.now(), incident,
      host: 'You', ago: 'now',
      time: time.trim(), gather: gather.trim(),
      comment: comment.trim() || 'Patrol organized in response to this incident.',
      going: 1, slots: 8, goingByMe: true,
    };
    const patrols = [patrol, ...s.patrols];
    set({ patrols });
    persist({ ...s, patrols });

    if (inc) notify('Patrol organized', `A patrol was suggested in response to "${inc.title}".`);
    return 'Patrol posted. Subscribers in this zone are notified — join when you can.';
  },

  // ── Feature 2: Incident resolution ────────────────────────────────────────
  resolveIncident: (id, note) => {
    const s = get();
    const inc = s.incidents.find(i => i.id === id);
    if (!inc || inc.status === 'resolved') return null;
    const incidents = s.incidents.map(i =>
      i.id === id ? { ...i, status: 'resolved', resolvedNote: note.trim() || 'Marked resolved by community.' } : i
    );
    set({ incidents });
    persist({ ...s, incidents });
    notify('Incident resolved', `"${inc.title}" has been marked as resolved.`);
    return 'Marked as resolved. Thank you for the update.';
  },

  // ── Feature 6: False report flagging ──────────────────────────────────────
  flagIncident: (id) => {
    const s = get();
    const inc = s.incidents.find(i => i.id === id);
    if (!inc || inc.flaggedByMe || inc.reporter === 'You') return null;
    const flags = inc.flags + 1;
    // At 3 flags, penalise the reporter's trust (simulated — in production this would be server-side)
    const penalise = flags >= 3;
    const incidents = s.incidents.map(i =>
      i.id === id ? { ...i, flags, flaggedByMe: true } : i
    );
    set({ incidents });
    persist({ ...s, incidents });
    return penalise
      ? 'Flagged. This report has been flagged by multiple members and will be reviewed.'
      : 'Flagged as suspicious. If others agree, this report will be reviewed.';
  },
}));
