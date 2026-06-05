export const CATEGORIES = {
  medical:     { label: 'Medical',     icon: 'heart',         hue: 25  },
  disturbance: { label: 'Disturbance', icon: 'alert-triangle', hue: 50  },
  suspicious:  { label: 'Suspicious',  icon: 'eye',           hue: 300 },
  hazard:      { label: 'Hazard',      icon: 'zap',           hue: 78  },
  theft:       { label: 'Theft',       icon: 'package',       hue: 255 },
  lost:        { label: 'Lost person', icon: 'user-x',        hue: 348 },
};

export const CATEGORY_ORDER = ['medical', 'disturbance', 'suspicious', 'hazard', 'theft', 'lost'];

export function seed() {
  const zones = [
    { id: 'z1', name: 'Riverside Quarter — North Block',  code: 'RVN', context: 'neighborhood', subscribers: 142, onWatch: 6,  watching: false },
    { id: 'z2', name: 'Riverside Quarter — South Block',  code: 'RVS', context: 'neighborhood', subscribers: 98,  onWatch: 4,  watching: true  },
    { id: 'z3', name: 'The Depot — Main Floor',           code: 'DEP', context: 'venue',        subscribers: 312, onWatch: 14, watching: false, parent: 'The Depot' },
    { id: 'z4', name: 'The Depot — Rooftop Bar',          code: 'RTB', context: 'venue',        subscribers: 88,  onWatch: 3,  watching: false, parent: 'The Depot', role: 'Staff' },
    { id: 'z5', name: 'Suncrest Festival — Zone A',       code: 'SCA', context: 'event',        subscribers: 540, onWatch: 22, watching: true,  parent: 'Suncrest Festival', expiresInH: 36 },
    { id: 'z6', name: 'Suncrest Festival — Zone B',       code: 'SCB', context: 'event',        subscribers: 480, onWatch: 19, watching: false, parent: 'Suncrest Festival', expiresInH: 36 },
  ].map(z => ({ ...z, subscribed: true }));

  const incidents = [
    { id: 'i1', zone: 'z5', cat: 'medical',     title: 'Medical — Zone A',         note: 'Person down near the main stage, appears unresponsive. First-aiders on scene.', reporter: 'Kai M.',     reporterTrust: 91, ago: '3 min',  confirms: 4, confirmedByMe: true,  status: 'verified' },
    { id: 'i2', zone: 'z2', cat: 'suspicious',  title: 'Suspicious — South Block',  note: 'Unknown individual trying door handles on Elm St between 4th and 5th Ave.',       reporter: 'Priya S.',   reporterTrust: 78, ago: '11 min', confirms: 2, confirmedByMe: false, status: 'reported' },
    { id: 'i3', zone: 'z3', cat: 'disturbance', title: 'Disturbance — Main Floor',  note: 'Altercation near the bar. Security has been notified.',                           reporter: 'Theo B.',    reporterTrust: 65, ago: '18 min', confirms: 3, confirmedByMe: false, status: 'verified' },
    { id: 'i4', zone: 'z1', cat: 'hazard',      title: 'Hazard — North Block',      note: 'Large pothole opened up on Maple Ave — no cones yet.',                            reporter: 'Amara J.',   reporterTrust: 88, ago: '25 min', confirms: 1, confirmedByMe: false, status: 'reported' },
    { id: 'i5', zone: 'z5', cat: 'lost',        title: 'Lost child — Zone A',       note: 'Child approx 6yo, red shirt, last seen near food trucks. Name: Luca.',            reporter: 'Dana L.',    reporterTrust: 94, ago: '32 min', confirms: 5, confirmedByMe: false, status: 'verified' },
    { id: 'i6', zone: 'z6', cat: 'theft',       title: 'Theft — Zone B',            note: 'Bag snatched near the east entrance. Suspect fled toward parking.',               reporter: 'Remi O.',    reporterTrust: 72, ago: '44 min', confirms: 2, confirmedByMe: false, status: 'reported' },
    { id: 'i7', zone: 'z2', cat: 'hazard',      title: 'Hazard — South Block',      note: 'Gas smell near the corner of Pine and 3rd. Utility company notified.',            reporter: 'Sion K.',    reporterTrust: 83, ago: '1 hr',   confirms: 3, confirmedByMe: true,  status: 'verified' },
    { id: 'i8', zone: 'z4', cat: 'disturbance', title: 'Disturbance — Rooftop',     note: 'Verbal argument escalating, two patrons involved.',                               reporter: 'Jade W.',    reporterTrust: 60, ago: '1.5 hr', confirms: 1, confirmedByMe: false, status: 'reported' },
    { id: 'i9', zone: 'z1', cat: 'suspicious',  title: 'Suspicious — North Block',  note: 'Vehicle parked with engine running for over an hour — unusual.',                  reporter: 'Felix T.',   reporterTrust: 77, ago: '2 hr',   confirms: 0, confirmedByMe: false, status: 'reported' },
    { id:'i10', zone: 'z3', cat: 'theft',       title: 'Theft — Main Floor',        note: 'Phone taken from table near the west lounge.',                                    reporter: 'Nour A.',    reporterTrust: 69, ago: '3 hr',   confirms: 3, confirmedByMe: false, status: 'verified' },
  ];

  const patrols = [
    { id: 'p1', incident: 'i5', host: 'Dana L.',  time: 'Now — ongoing', gather: 'Meet at the info tent near Stage A entrance', going: 7,  slots: 12, goingByMe: true,  ago: '30 min', comment: 'Spreading out to search the food truck area and east path.' },
    { id: 'p2', incident: 'i2', host: 'Priya S.', time: 'In 15 min',     gather: 'Corner of Elm St and 4th Ave, under the streetlight', going: 4,  slots: 8,  goingByMe: false, ago: '8 min',  comment: 'Walking the block until the pattern stops. Bring a buddy.' },
    { id: 'p3', incident: 'i3', host: 'Theo B.',  time: 'In 30 min',     gather: 'Front entrance of The Depot', going: 3,  slots: 6,  goingByMe: false, ago: '15 min', comment: 'Checking in with management, then visible presence at exits.' },
    { id: 'p4', incident: 'i7', host: 'Sion K.',  time: 'Tomorrow 8am',  gather: 'Pine St corner store parking lot', going: 5,  slots: 10, goingByMe: false, ago: '55 min', comment: 'Gas smell resolved — doing a neighbourhood walkthrough to reassure residents.' },
  ];

  const user = {
    name: 'You',
    initials: 'YO',
    trust: 72,
    reports: 3,
    confirms: 14,
    verified: 2,
    joined: 'March 2024',
  };

  return { zones, incidents, patrols, user };
}
