// src/data/events.ts
// Dummy data — replace this file's `getEvents()` with an API fetch when ready.
// The Event type reflects the shape your API should return.

export interface Event {
  id: string;
  title: string;
  type: 'hiking' | 'climbing' | 'camping' | 'heritage' | 'canyoning' | 'biking' | 'workshop';
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
      title: 'Cedar Reserve Dawn Hike',
      type: 'hiking',
      date: '2026-05-02',
      time: '05:30',
      duration: 'Half day (5 hrs)',
      location: 'Bcharre Cedar Reserve',
      region: 'North Lebanon',
      difficulty: 'Moderate',
      spots: 14,
      spotsLeft: 6,
      price: 35,
      description:
        'Watch the sunrise illuminate the ancient Cedars of God — one of the most iconic and soul-stirring sights in all of Lebanon. A moderate trail through UNESCO-listed forest.',
      highlights: ['UNESCO World Heritage site', 'Sunrise photography', 'Endemic Cedar of Lebanon trees', 'Knowledgeable naturalist guide'],
      guide: 'Lara & Karim (founders)',
    },
    {
      id: 'ev-002',
      title: 'Qadisha Valley Gorge Trek',
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
        'Descend into the sacred Qadisha Gorge, one of the last refuges of early Christianity in Lebanon. Walk ancient monastic paths carved into sheer cliff faces above the river.',
      highlights: ['Ancient hermitage caves', 'Dramatic cliff scenery', 'River crossing', 'Historic Maronite monasteries'],
      guide: 'Karim (founder)',
    },
    {
      id: 'ev-003',
      title: 'Tannourine Canyoning',
      type: 'canyoning',
      date: '2026-05-16',
      time: '08:00',
      duration: 'Full day (7 hrs)',
      location: 'Tannourine River Canyon',
      region: 'North Lebanon',
      difficulty: 'Challenging',
      spots: 8,
      spotsLeft: 8,
      price: 75,
      description:
        'Rappel, jump, and swim through one of Lebanon\'s most spectacular limestone canyons as the spring snowmelt fills the river with crystal-clear water.',
      highlights: ['3 rappel descents', 'Natural water slides', 'Limestone slot canyon', 'All technical gear provided'],
      guide: 'Lara & Karim (founders)',
    },
    {
      id: 'ev-004',
      title: 'Shouf Biosphere Night Camp',
      type: 'camping',
      date: '2026-05-23',
      time: '15:00',
      duration: '2 days / 1 night',
      location: 'Shouf Cedar Reserve',
      region: 'Mount Lebanon',
      difficulty: 'Easy',
      spots: 16,
      spotsLeft: 11,
      price: 90,
      description:
        'A two-day wilderness immersion inside Lebanon\'s largest nature reserve. Camp under the stars, track wildlife at dawn, and learn fire and shelter skills from scout-trained guides.',
      highlights: ['Stargazing session', 'Wildlife tracking at dawn', 'Fire & shelter workshop', 'All camping gear included', 'Farm-fresh meals'],
      guide: 'Lara & Karim (founders)',
    },
    {
      id: 'ev-005',
      title: 'Baalbek Heritage Walk',
      type: 'heritage',
      date: '2026-05-30',
      time: '08:30',
      duration: 'Full day (6 hrs)',
      location: 'Baalbek Roman Temples',
      region: 'Bekaa Valley',
      difficulty: 'Easy',
      spots: 20,
      spotsLeft: 14,
      price: 45,
      description:
        'Walk through millennia of history at one of the most awe-inspiring archaeological sites in the world. Your guide combines deep cultural knowledge with a genuine love for the land.',
      highlights: ['Temple of Jupiter & Bacchus', 'Phoenician foundations', 'Expert cultural guide', 'Traditional Lebanese lunch included'],
      guide: 'Lara (founder)',
    },
    {
      id: 'ev-006',
      title: 'Wilderness First Aid Workshop',
      type: 'workshop',
      date: '2026-06-06',
      time: '09:00',
      duration: 'Full day (8 hrs)',
      location: 'LebVentures Base — Faraya',
      region: 'Mount Lebanon',
      difficulty: 'Easy',
      spots: 12,
      spotsLeft: 7,
      price: 60,
      description:
        'A hands-on workshop covering essential wilderness first aid — bleeding control, fracture management, heat and cold emergencies, and evacuation planning. Led by certified WFA instructors.',
      highlights: ['Certified WFA instruction', 'Hands-on practical scenarios', 'Take-home reference card', 'Certificate of completion'],
      guide: 'Lara & Karim (founders)',
    },
  ];
}
