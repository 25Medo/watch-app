import { create } from 'zustand';
import { seed } from '../data/seed';

const initial = seed();

export const useStore = create((set, get) => ({
  ...initial,

  toggleWatch: (id) => set(s => ({
    zones: s.zones.map(z =>
      z.id === id
        ? { ...z, watching: !z.watching, onWatch: z.onWatch + (z.watching ? -1 : 1) }
        : z
    ),
  })),

  toggleSub: (id) => set(s => ({
    zones: s.zones.map(z =>
      z.id === id ? { ...z, subscribed: !z.subscribed } : z
    ),
  })),

  toggleRSVP: (id) => set(s => ({
    patrols: s.patrols.map(p =>
      p.id === id
        ? { ...p, goingByMe: !p.goingByMe, going: p.going + (p.goingByMe ? -1 : 1) }
        : p
    ),
  })),

  confirmIncident: (id) => {
    const s = get();
    const inc = s.incidents.find(i => i.id === id);
    if (!inc || inc.confirmedByMe) return null;
    const confirms = inc.confirms + 1;
    const promote = inc.status === 'reported' && confirms >= 3;
    set(state => ({
      user: { ...state.user, confirms: state.user.confirms + 1 },
      incidents: state.incidents.map(i =>
        i.id === id
          ? { ...i, confirms, confirmedByMe: true, status: promote ? 'verified' : i.status }
          : i
      ),
    }));
    return promote
      ? 'Confirmed — this report is now Verified. Thank you.'
      : 'Confirmed. Thanks for the second set of eyes.';
  },

  submitReport: ({ zone, cat, note }) => {
    const { zones } = get();
    const C_LABELS = {
      medical: 'Medical', disturbance: 'Disturbance', suspicious: 'Suspicious',
      hazard: 'Hazard', theft: 'Theft', lost: 'Lost person',
    };
    const z = zones.find(zn => zn.id === zone);
    const shortName = (z?.name.split(' — ')[1]) || z?.name || '';
    const inc = {
      id: 'i-' + Date.now(),
      zone, cat,
      title: `${C_LABELS[cat]} reported in ${shortName}`,
      note: note.trim() || 'No further detail provided.',
      reporter: 'You',
      reporterTrust: get().user.trust,
      ago: 'now',
      confirms: 0,
      confirmedByMe: false,
      status: 'reported',
    };
    set(s => ({
      incidents: [inc, ...s.incidents],
      user: { ...s.user, reports: s.user.reports + 1 },
    }));
    return `Report posted to ${shortName}. Neighbors on watch are notified.`;
  },

  suggestPatrol: ({ incident, comment, time, gather }) => {
    const patrol = {
      id: 'p-' + Date.now(),
      incident,
      host: 'You',
      ago: 'now',
      time: time.trim(),
      gather: gather.trim(),
      comment: comment.trim() || 'Patrol organized in response to this incident.',
      going: 1,
      slots: 8,
      goingByMe: true,
    };
    set(s => ({ patrols: [patrol, ...s.patrols] }));
    return 'Patrol posted. Subscribers in this zone are notified — join when you can.';
  },
}));
