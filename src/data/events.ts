// src/data/events.ts
// Dummy data — replace this file's `getEvents()` with an API fetch when ready.
// The Event type reflects the shape your API should return.

export interface Event {
  id: string;
  title: string;
  type: 'hiking' | 'climbing' | 'camping' | 'heritage' | 'canyoning' | 'biking' | 'workshop' | 'water' | 'snow' | 'leisure' | 'kids';
  date: string;        // ISO 8601 — "2026-05-03"
  time: string;        // "07:00"
  duration: string;    // human-readable — "Full day (8 hrs)"
  location: string;    // place name
  region: string;      // broader region
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Expert';
  spots: number;       // total capacity
  spotsLeft: number;   // remaining
  price: number;       // USD, 0 = free
  description: string;
  highlights: string[];
  guide: string;       // guide name
}

// ---------------------------------------------------------------------------
// TODO: Replace this function body with an API call, e.g.:
//   const res = await fetch('https://api.lebventures.com/events?upcoming=true');
//   return res.json() as Promise<Event[]>;
// ---------------------------------------------------------------------------
export async function getEvents(): Promise<Event[]> {
  return [
    {
      id: 'ev-001',
      title: 'Billion Star Hotel – Camping & Stargazing',
      type: 'camping',
      date: '2026-05-02',
      time: '15:00',
      duration: '2 days / 1 night',
      location: 'Shouf Cedar Reserve',
      region: 'Mount Lebanon',
      difficulty: 'Easy',
      spots: 14,
      spotsLeft: 6,
      price: 90,
      description:
        'An unforgettable camping experience under a star-filled sky — LebVentures\' signature overnight adventure. Set up camp in Lebanon\'s largest nature reserve, learn fire and shelter skills, and fall asleep under a billion stars.',
      highlights: ['Stargazing session with star chart', 'Fire & shelter workshop', 'Wildlife tracking at dawn', 'All camping gear included', 'Farm-fresh meals'],
      guide: 'Pierre & Gioia (founders)',
    },
    {
      id: 'ev-002',
      title: 'The Hermit Experience – Qadisha Valley',
      type: 'hiking',
      date: '2026-05-09',
      time: '07:00',
      duration: 'Full day (8 hrs)',
      location: 'Qadisha Valley',
      region: 'North Lebanon',
      difficulty: 'Challenging',
      spots: 10,
      spotsLeft: 3,
      price: 55,
      description:
        'A spiritual and cultural journey exploring the solitude of Lebanon\'s ancient hermit caves. Descend into the sacred Qadisha Gorge, one of the last refuges of early Christianity in Lebanon, walking ancient monastic paths carved into sheer cliff faces.',
      highlights: ['Ancient hermitage caves', 'Dramatic cliff scenery', 'River crossing', 'Historic Maronite monasteries'],
      guide: 'Pierre (founder)',
    },
    {
      id: 'ev-003',
      title: 'Stalactite – Caving in Afqa',
      type: 'climbing',
      date: '2026-05-16',
      time: '08:00',
      duration: 'Full day (7 hrs)',
      location: 'Afqa Caves',
      region: 'North Lebanon',
      difficulty: 'Challenging',
      spots: 8,
      spotsLeft: 8,
      price: 75,
      description:
        'A thrilling underground adventure exploring the stunning stalactite caves of Afqa. Discover Lebanon\'s hidden subterranean world with certified guides and all safety equipment provided.',
      highlights: ['Stalactite & stalagmite formations', 'Underground river sections', 'All technical gear provided', 'Headlamp & helmet included'],
      guide: 'Pierre & Gioia (founders)',
    },
    {
      id: 'ev-004',
      title: 'Muddy Trail – Rainy Hike, Mud Games & Snail Picking',
      type: 'hiking',
      date: '2026-05-23',
      time: '09:00',
      duration: 'Half day (5 hrs)',
      location: 'North Lebanon Trails',
      region: 'North Lebanon',
      difficulty: 'Easy',
      spots: 16,
      spotsLeft: 11,
      price: 35,
      description:
        'A fun-filled adventure embracing the beauty of Lebanon\'s rainy season. Get muddy, pick snails, play games in the rain, and discover why wet-weather hiking is an experience unlike any other.',
      highlights: ['Rain-ready trail', 'Mud games & challenges', 'Traditional snail picking', 'Hot drink & snacks included'],
      guide: 'Gioia (founder)',
    },
    {
      id: 'ev-005',
      title: 'Biking the Phoenician Routes – Byblos',
      type: 'biking',
      date: '2026-05-30',
      time: '08:00',
      duration: 'Full day (6 hrs)',
      location: 'Byblos & surroundings',
      region: 'North Governorate',
      difficulty: 'Moderate',
      spots: 12,
      spotsLeft: 9,
      price: 50,
      description:
        'A scenic cycling adventure through historic Phoenician trade routes around Byblos — one of the oldest continuously inhabited cities in the world. Wind through olive groves, coastal paths, and ancient ruins.',
      highlights: ['Phoenician archaeological sites', 'Coastal & mountain terrain', 'Bikes & helmets provided', 'Traditional Lebanese lunch'],
      guide: 'Pierre & Gioia (founders)',
    },
    {
      id: 'ev-006',
      title: 'Little Explorers – Family Hike & Sensory Adventure',
      type: 'kids',
      date: '2026-06-06',
      time: '09:00',
      duration: 'Half day (4 hrs)',
      location: 'Byblos Hills',
      region: 'North Governorate',
      difficulty: 'Easy',
      spots: 20,
      spotsLeft: 14,
      price: 30,
      description:
        'A fun and educational outdoor experience designed for kids and families. Features an easy hike combined with interactive sensory and nature-based activities — perfect for curious young explorers aged 4 and up.',
      highlights: ['Sensory nature stations', 'Bug & plant identification', 'Story time under the trees', 'Kids activity pack', 'Parent-friendly pace'],
      guide: 'Gioia (founder)',
    },
    {
      id: 'ev-007',
      title: 'Hike to Paint – MACAM',
      type: 'heritage',
      date: '2026-06-13',
      time: '08:30',
      duration: 'Full day (6 hrs)',
      location: 'MACAM Museum & surroundings',
      region: 'Mount Lebanon',
      difficulty: 'Easy',
      spots: 14,
      spotsLeft: 10,
      price: 60,
      description:
        'A guided hike ending with a creative painting session at the Modern and Contemporary Art Museum (MACAM). Combine nature, movement, and art in one unforgettable day.',
      highlights: ['Guided nature hike', 'MACAM museum visit', 'Painting session with supplies', 'Expert art guide', 'Lunch break included'],
      guide: 'Pierre & Gioia (founders)',
    },
    {
      id: 'ev-008',
      title: 'Go Vertical – Rock Climbing & Beer Festival',
      type: 'climbing',
      date: '2026-06-20',
      time: '10:00',
      duration: 'Full day (7 hrs)',
      location: 'Tannourine Cliffs',
      region: 'North Lebanon',
      difficulty: 'Moderate',
      spots: 20,
      spotsLeft: 15,
      price: 65,
      description:
        'A thrilling rock-climbing event combined with a lively craft beer festival celebration. Conquer the limestone cliffs of Tannourine, then celebrate with Lebanese craft beers and live music.',
      highlights: ['Beginner-friendly climbing routes', 'Certified instructor', 'All gear provided', 'Craft beer tasting', 'Live music & BBQ'],
      guide: 'Pierre (founder)',
    },
  ];
}
