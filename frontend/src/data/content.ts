// Editable website content.
//
// This is the frontend mirror of api/content_schema.py (the source of
// truth for every editable key + default). Keep the two files in sync —
// the grouping/comments below intentionally match the Python file so a
// diff between them is easy to read. Never rename a key once shipped.

export type Content = Record<string, string>;

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL
// ─────────────────────────────────────────────────────────────────────────────
const GLOBAL: Content = {
  'global.footer.tagline':
    "Inclusive, authentic adventure tourism rooted in a deep love for Lebanon's nature — connecting people to hidden trails, sacred cedars, and breathtaking landscapes.",
  'global.contact.email': 'lebventures.lebanon@gmail.com',
  'global.contact.phone': '+961 70-050590',
  'global.contact.phone_href': '+96170050590',
  'global.contact.address': 'Byblos (Amchit), Lebanon',
  'global.social.instagram': 'https://www.instagram.com/lebventures',
  'global.social.facebook': 'https://www.facebook.com/lebventures',
};

// ─────────────────────────────────────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────────────────────────────────────
const HOME: Content = {
  // Hero
  'home.hero.image': '/header_lebventures.png',
  'home.hero.tagline': 'Lebanon · Nature · Adventure',
  'home.hero.heading': 'For the Love\nof Nature.',
  'home.hero.subheading':
    "LebVentures connects adventurers with Lebanon's hidden trails, sacred cedars, ancient ruins, and breathtaking landscapes — guided by people who truly love this land.",
  'home.hero.cta_primary': 'Plan Adventure',
  'home.hero.cta_secondary': "Let's Connect",
  'home.hero.stat1.value': '20+',
  'home.hero.stat1.label': 'Trips Led',
  'home.hero.stat2.value': '9',
  'home.hero.stat2.label': 'Adventure Types',
  'home.hero.stat3.value': '100+',
  'home.hero.stat3.label': 'Adventurers',

  // What we offer
  'home.offer.heading': 'What We Offer',
  'home.offer.subheading': "Nine categories of adventure, one shared love for Lebanon's outdoors.",
  'home.offer.card1.title': 'Hiking & Trekking',
  'home.offer.card1.desc':
    "From the Cedar Reserve to the Qadisha Valley — trails for every level across Lebanon.",
  'home.offer.card2.title': 'Water Activities',
  'home.offer.card2.desc':
    "Kayaking, snorkeling, and fishing along Lebanon's stunning Mediterranean coast.",
  'home.offer.card3.title': 'Kids & Family',
  'home.offer.card3.desc':
    'Sensory hikes, mud games, and nature exploration designed for curious young adventurers.',
  'home.offer.cta': 'View All Adventures',

  // Our story snippet
  'home.story.image': '/images/team.jpg',
  'home.story.heading': 'Family-Founded,\nAdventure-Driven',
  'home.story.p1':
    "LebVentures is a family-founded tour operator specializing in adventure tourism. Founded in 2019 by Pierre Abboud and Gioia Wehbe, we organize diverse outdoor experiences — from hiking and camping to rock climbing, kayaking, and customized eco-tours — tailored for all adventure levels.",
  'home.story.p2':
    "Born out of a shared love for Lebanon's mountains, our mission is simple: connect people with Lebanon's extraordinary outdoors through inclusive, authentic, and sustainable adventures.",
  'home.story.quote':
    'The mountains of Lebanon are not just scenery — they are living history, sacred ground, and a responsibility.',
  'home.story.founders': 'Pierre Abboud & Gioia Wehbe',
  'home.story.founders_sub': 'Founders · Scout Alumni · Based in Byblos',
  'home.story.cta': 'Meet the Founders',

  // Sustainability snippet
  'home.eco.heading': 'Sustainable Tourism at Our Core',
  'home.eco.subheading':
    "Every decision we make is guided by respect for Lebanon's natural heritage — from route selection to supplier partnerships.",
  'home.eco.pillar1': 'Leave No Trace',
  'home.eco.pillar2': 'Support Local',
  'home.eco.pillar3': 'Protect Habitats',
  'home.eco.pillar4': 'Education First',
  'home.eco.cta': 'Our Commitment',

  // Community
  'home.community.tagline': 'You Belong Here',
  'home.community.heading': 'Join the LebVentures Community',
  'home.community.desc':
    "LebVentures is more than a tour company — it's a growing tribe of nature lovers, weekend warriors, families, and solo explorers united by their passion for Lebanon's outdoors.",
  'home.community.card1.title': 'Group Adventures',
  'home.community.card1.desc':
    'Join organized group trips where strangers become lifelong trail friends. No experience required — just a willingness to explore.',
  'home.community.card2.title': 'Share Your Story',
  'home.community.card2.desc':
    'Our community shares trip photos, trail reports, and local tips. Every adventure contributes to our collective map of Lebanon.',
  'home.community.card3.title': 'Skills Workshops',
  'home.community.card3.desc':
    'Learn navigation, plant identification, wilderness first aid, and more through hands-on workshops led by our certified founders.',
  'home.community.cta': 'Get Involved',
};

// ─────────────────────────────────────────────────────────────────────────────
// ADVENTURES
// ─────────────────────────────────────────────────────────────────────────────
const ADVENTURE_CARDS: [string, string, string][] = [
  [
    'Hiking & Trekking',
    "From the Cedar Reserve in Bcharre to the Qadisha Valley, our guided hikes span all difficulty levels across Lebanon's most stunning terrain.",
    'All levels',
  ],
  [
    'Rock Climbing & Caving',
    "Scale limestone cliffs with certified instructors, or explore Lebanon's underground world — from the caves of Afqa to vertical rock faces in Tannourine.",
    'Intermediate+',
  ],
  [
    'Camping Expeditions',
    "Multi-day wild camping experiences under Lebanon's star-filled skies, deep in nature away from city noise — including our signature Billion Star Hotel experience.",
    'Overnight',
  ],
  [
    'Water Activities',
    "Kayak along Lebanon's scenic coast, snorkel in crystal-clear Mediterranean waters, or join a fishing adventure — perfect for all ages and comfort levels.",
    'Seasonal',
  ],
  [
    'Winter Experiences',
    "Strap on snowshoes and trek through Lebanon's breathtaking snowy landscapes. End around a crackling bonfire with our Snow and Fire winter adventure.",
    'Winter',
  ],
  [
    'Leisure & Exploration',
    "Stargaze under a billion-star sky, master archery at a scenic picnic, or uncover Phoenician ruins and Roman temples woven into Lebanon's cultural landscape.",
    'Relaxed',
  ],
  [
    'Mountain Biking',
    'Ride curated trails through pine forests and terraced villages, or cycle the historic Phoenician routes around Byblos for a journey through 5,000 years of history.',
    'Active',
  ],
  [
    'Kids & Family',
    'Hands-on outdoor learning designed for children and families — from Little Explorers sensory hikes to rainy-day mud games and snail picking in the Muddy Trail.',
    'Family',
  ],
  [
    'Rural & Cultural Immersion',
    'Dive into authentic Lebanese village life in Zouwede, Bchalleh, and Al Zourou3, or hike into history through ancient villages on our Telten l Bled trail.',
    'Cultural',
  ],
];

const ADVENTURES: Content = {
  'adventures.hero.tagline': 'Choose Your Adventure',
  'adventures.hero.heading': 'Adventures for\nEvery Explorer',
  'adventures.hero.subheading':
    "Nine categories of guided outdoor experiences spanning Lebanon's most spectacular terrain — from beginner-friendly family hikes to multi-day wilderness expeditions and winter snowshoeing.",
  'adventures.hero.cta': 'Get in Touch',
  'adventures.section.heading': 'Adventures We Offer',
  'adventures.section.subheading':
    "Whether you're a first-timer or a seasoned explorer, we have an adventure crafted for you across Lebanon's diverse landscapes.",
  'adventures.section.cta': 'Plan Your Adventure',
};
ADVENTURE_CARDS.forEach(([title, desc, tag], i) => {
  const n = i + 1;
  ADVENTURES[`adventures.card${n}.title`] = title;
  ADVENTURES[`adventures.card${n}.desc`] = desc;
  ADVENTURES[`adventures.card${n}.tag`] = tag;
});

// ─────────────────────────────────────────────────────────────────────────────
// SUSTAINABILITY
// ─────────────────────────────────────────────────────────────────────────────
const PILLARS: [string, string][] = [
  [
    'Leave No Trace',
    'Every trip follows strict LNT principles. We pack out what we pack in and educate our community on responsible outdoor ethics.',
  ],
  [
    'Support Local Communities',
    'We source food, guides, and accommodation from local villages, ensuring tourism income directly benefits the people of Lebanon.',
  ],
  [
    'Protect Natural Habitats',
    "From the cedars of God to the Chouf Biosphere Reserve, we partner with conservation bodies to protect Lebanon's ecosystems.",
  ],
  [
    'Education First',
    'Our guides are trained naturalists who share knowledge about local flora, fauna, geology, and the stories embedded in the land.',
  ],
];
const COMMITMENTS: [string, string][] = [
  [
    'Leave No Trace',
    'We follow and teach the seven LNT principles on every trip. Waste management, fire safety, and respect for wildlife are non-negotiable parts of every LebVentures experience.',
  ],
  [
    'Support Local Communities',
    'Our guides are local to the regions we explore. We source food from village producers, rest at family guesthouses, and ensure that tourism income stays within Lebanese communities.',
  ],
  [
    'Protect Natural Habitats',
    'We partner with conservation bodies including the Chouf Cedar Reserve and Shouf Biosphere Reserve. We actively contribute to reforestation efforts and report trail damage.',
  ],
  [
    'Education First',
    'Every guide is trained in local flora, fauna, and geology. We believe that understanding nature deepens respect for it — so we teach as we explore.',
  ],
  [
    'Low-Impact Operations',
    'Small group sizes, minimal vehicle use, reusable gear, and plastic-free policies are standards — not extras. We continuously audit our environmental footprint.',
  ],
  [
    'Active Conservation',
    "A portion of every trip goes toward Lebanon's wildlife and trail conservation programs. Adventuring with LebVentures means you give back to the land you explore.",
  ],
];

const SUSTAINABILITY: Content = {
  'sustainability.hero.tagline': 'Our Commitment',
  'sustainability.hero.heading': 'Sustainable Tourism\nat Our Core',
  'sustainability.hero.subheading':
    "We believe adventure and environmental stewardship are inseparable. Every LebVentures experience is designed to leave Lebanon's wild places better than we found them.",
  'sustainability.intro.heading': 'Sustainable Tourism at Our Core',
  'sustainability.intro.text':
    "LebVentures was built on the belief that adventure and environmental stewardship go hand in hand. Every decision we make — from route selection to supplier partnerships — is guided by sustainability and respect for Lebanon's natural heritage.",
  'sustainability.quote.text':
    'The mountains of Lebanon are not just scenery — they are living history, sacred ground, and a responsibility.',
  'sustainability.quote.author': 'LebVentures Founders',
  'sustainability.quote.role': 'Scout Alumni & Nature Advocates',
  'sustainability.commitments.heading': 'How We Operate',
  'sustainability.commitments.subheading': 'Six concrete practices that guide every decision we make.',
  'sustainability.cta.heading': 'Adventure Responsibly',
  'sustainability.cta.text': 'Join a community that loves Lebanon enough to protect it.',
  'sustainability.cta.button': 'Plan a Trip',
};
PILLARS.forEach(([title, desc], i) => {
  const n = i + 1;
  SUSTAINABILITY[`sustainability.pillar${n}.title`] = title;
  SUSTAINABILITY[`sustainability.pillar${n}.desc`] = desc;
});
COMMITMENTS.forEach(([title, desc], i) => {
  const n = i + 1;
  SUSTAINABILITY[`sustainability.commitment${n}.title`] = title;
  SUSTAINABILITY[`sustainability.commitment${n}.desc`] = desc;
});

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT / OUR STORY
// ─────────────────────────────────────────────────────────────────────────────
const TIMELINE: [string, string][] = [
  [
    'The Beginning',
    "Pierre Abboud and Gioia Wehbe meet through a shared love of Lebanon's outdoors. Their passion for nature, adventure, and community becomes the foundation of a lifelong partnership.",
  ],
  [
    'Certifications',
    'Both pursue formal certifications in Wilderness First Aid, navigation, rope safety, and sustainable tourism guiding — staying current with ongoing training each year.',
  ],
  [
    '2019',
    'LebVentures launches from Byblos with its first guided adventures. A small community of nature lovers quickly grows into a movement for inclusive, authentic outdoor experiences across Lebanon.',
  ],
  [
    'Expanding',
    'LebVentures grows its offerings to 9+ adventure types — from land and water to winter excursions and kids educational experiences — while deepening partnerships with local communities and artisans.',
  ],
  [
    'Today',
    'With 20+ trips delivered and 100+ adventurers guided, LebVentures continues to expand. Pierre and Gioia remain hands-on, certified, and out on the trail every week — for the love of nature.',
  ],
];

const ABOUT: Content = {
  'about.hero.tagline': 'Our Story',
  'about.hero.heading': 'Family-Founded,\nAdventure-Driven',
  'about.hero.subheading':
    "A shared passion for Lebanon's mountains turned into a mission: connecting adventurers with the country's hidden trails, sacred cedars, and breathtaking landscapes.",
  'about.card.image': '/images/team.jpg',
  'about.card.title': 'Scout Alumni',
  'about.card.subtitle': 'Est. in the cedar forests of Lebanon',
  'about.card.quote':
    "We met as teenagers in scouts, fell in love with the mountains, and with each other. After our wedding, we knew we had to find a way to share what Lebanon's nature had given us — the community, the discipline, the wonder.",
  'about.card.stat1.value': '2019',
  'about.card.stat1.label': 'Founded',
  'about.card.stat2.value': 'Certified',
  'about.card.stat2.label': 'Wilderness First Aid',
  'about.card.stat3.value': 'Active',
  'about.card.stat3.label': 'Ongoing training',
  'about.story.heading': 'Family-Founded, Adventure-Driven',
  'about.story.p1':
    'LebVentures is a family-founded tour operator specializing in adventure tourism, organized by Pierre Abboud and Gioia Wehbe. We offer diverse outdoor experiences — hiking, camping, rock climbing, kayaking, and customized eco-tours — tailored for all adventure levels.',
  'about.story.p2':
    'What sets us apart is our commitment to inclusive, accessible adventures for everyone: families, solo travelers, corporate teams, and niche groups. We collaborate with local communities, artisans, and guides to deliver authentic, off-the-beaten-path experiences that support and celebrate Lebanon\'s local heritage.',
  'about.story.p3':
    'Both founders remain active and continuously certified in wilderness skills, first aid, and sustainable tourism best practices. Every adventure is backed by deep local knowledge and a genuine love for Lebanon\'s mountains, coastlines, and valleys.',
  'about.timeline.heading': 'Our Journey',
  'about.timeline.subheading': 'From scout meetings to mountain guides — the story behind LebVentures.',
  'about.cta.heading': 'Ready to Join Us?',
  'about.cta.text':
    'Every adventure with LebVentures is guided by the same values that shaped our founders — respect, community, and love for the wild.',
  'about.cta.button': 'Get in Touch',
};
TIMELINE.forEach(([year, text], i) => {
  const n = i + 1;
  ABOUT[`about.timeline.item${n}.year`] = year;
  ABOUT[`about.timeline.item${n}.text`] = text;
});

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────────────────────────────────────
const CONTACT: Content = {
  'contact.header.tagline': 'Get in Touch',
  'contact.header.heading': 'Ready to Venture Out?',
  'contact.header.subheading':
    "Tell us about the experience you're dreaming of. We'll design it around your group, pace, and goals.",
  'contact.form.heading': 'Ready to Venture Out?',
  'contact.form.subheading':
    "Tell us about the adventure you're dreaming of and we'll craft the perfect experience for you.",
  'contact.form.button': 'Send My Request',
  'contact.form.success_title': 'Message Received!',
  'contact.form.success_text': 'Thanks for reaching out! One of our guides will be in touch within 24 hours.',
  'contact.call.tagline': 'Not sure where to start?',
  'contact.call.heading': 'Book a Free Discovery Call',
  'contact.call.text':
    "Jump on a free 10-minute call with Pierre or Gioia. Tell us what you're looking for and we'll point you toward the perfect experience — no pressure, no commitment.",
  'contact.call.button': '📅 Schedule My Free Call',
  'contact.call.url': 'https://calendly.com/lebventures',
  'contact.call.note': 'Calendly · Pick any open slot that works for you',
  'contact.info.location.title': 'Based in Byblos',
  'contact.info.location.text':
    "El Tine Street, Amchit — operating across Lebanon's mountains, valleys, and coast.",
  'contact.info.email.title': 'Email Us',
  'contact.info.phone.title': 'Call / WhatsApp',
};

// ─────────────────────────────────────────────────────────────────────────────
// VISIBILITY TOGGLES (buttons and sections)
// Markup binds these with data-c-show="<key>"; "false" hides the element.
// ─────────────────────────────────────────────────────────────────────────────
const TOGGLES: Content = {
  'global.navbar.cta.show': 'true',
  'global.footer.social.show': 'true',

  'home.hero.cta_primary.show': 'true',
  'home.hero.cta_secondary.show': 'true',
  'home.hero.stats.show': 'true',
  'home.offer.show': 'true',
  'home.offer.cards.link.show': 'true',
  'home.offer.cta.show': 'true',
  'home.story.show': 'true',
  'home.story.cta.show': 'true',
  'home.eco.show': 'true',
  'home.eco.cta.show': 'true',
  'home.community.show': 'true',
  'home.community.cta.show': 'true',

  'adventures.hero.cta.show': 'true',
  'adventures.section.cta.show': 'true',

  'sustainability.intro.show': 'true',
  'sustainability.commitments.show': 'true',
  'sustainability.cta.show': 'true',
  'sustainability.cta.button.show': 'true',

  'about.story.show': 'true',
  'about.timeline.show': 'true',
  'about.cta.show': 'true',
  'about.cta.button.show': 'true',

  'contact.form.show': 'true',
  'contact.call.show': 'true',
  'contact.info.show': 'true',
};

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON LINKS
// Markup binds these with data-c-href="<key>" (no data-c-prefix — the value
// is a full route or URL, not a mailto:/tel: suffix).
// ─────────────────────────────────────────────────────────────────────────────
const LINKS: Content = {
  'global.navbar.cta.href': '/contact',

  'home.hero.cta_primary.href': '/adventures',
  'home.hero.cta_secondary.href': '/contact',
  'home.offer.card1.href': '/adventures',
  'home.offer.card2.href': '/adventures',
  'home.offer.card3.href': '/adventures',
  'home.offer.cta.href': '/adventures',
  'home.story.cta.href': '/about',
  'home.eco.cta.href': '/sustainable-tourism',
  'home.community.cta.href': '/contact',

  'adventures.hero.cta.href': '/contact',
  'adventures.section.cta.href': '/contact',

  'sustainability.cta.button.href': '/contact',

  'about.cta.button.href': '/contact',
};

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULTS: Content = {
  ...GLOBAL,
  ...HOME,
  ...ADVENTURES,
  ...SUSTAINABILITY,
  ...ABOUT,
  ...CONTACT,
  ...TOGGLES,
  ...LINKS,
};

// Fields whose value is multi-line ("textarea" in the schema) — used by
// markup to opt in to `white-space: pre-line` via [data-c-multiline].
export const MULTILINE_KEYS = new Set<string>([
  'global.footer.tagline',
  'home.hero.heading',
  'home.hero.subheading',
  'home.offer.card1.desc',
  'home.offer.card2.desc',
  'home.offer.card3.desc',
  'home.story.heading',
  'home.story.p1',
  'home.story.p2',
  'home.story.quote',
  'home.eco.subheading',
  'home.community.desc',
  'home.community.card1.desc',
  'home.community.card2.desc',
  'home.community.card3.desc',
  'adventures.hero.heading',
  'adventures.hero.subheading',
  'adventures.section.subheading',
  ...ADVENTURE_CARDS.map((_c, i) => `adventures.card${i + 1}.desc`),
  'sustainability.hero.heading',
  'sustainability.hero.subheading',
  'sustainability.intro.text',
  'sustainability.quote.text',
  ...PILLARS.map((_p, i) => `sustainability.pillar${i + 1}.desc`),
  ...COMMITMENTS.map((_c, i) => `sustainability.commitment${i + 1}.desc`),
  'about.hero.heading',
  'about.hero.subheading',
  'about.card.quote',
  'about.story.p1',
  'about.story.p2',
  'about.story.p3',
  ...TIMELINE.map((_t, i) => `about.timeline.item${i + 1}.text`),
  'about.cta.text',
  'contact.header.subheading',
  'contact.form.subheading',
  'contact.form.success_text',
  'contact.call.text',
  'contact.info.location.text',
]);

// ─────────────────────────────────────────────────────────────────────────────
// Fetch + cache
// ─────────────────────────────────────────────────────────────────────────────
let contentPromise: Promise<Content> | null = null;

export async function getContent(): Promise<Content> {
  if (contentPromise) return contentPromise;

  const apiUrl = import.meta.env.PUBLIC_API_URL as string | undefined;
  if (!apiUrl) {
    contentPromise = Promise.resolve(DEFAULTS);
    return contentPromise;
  }

  contentPromise = (async (): Promise<Content> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const res = await fetch(`${apiUrl}/content`, { signal: controller.signal });
      if (!res.ok) throw new Error(`content fetch failed: HTTP ${res.status}`);
      const json = (await res.json()) as Content;
      return { ...DEFAULTS, ...json };
    } catch (err) {
      console.warn('[content] falling back to build-time defaults:', err);
      return DEFAULTS;
    } finally {
      clearTimeout(timer);
    }
  })();

  return contentPromise;
}

// Whether a togglable button/section should render. Anything other than
// the literal string "false" is treated as visible (fail open).
export function show(c: Content, key: string): boolean {
  return c[key] !== 'false';
}

// Whether a button-link value is an absolute URL (vs. a site-relative
// route) — such links open in a new tab so visitors don't leave the site.
export function isExternalHref(href: string | undefined): boolean {
  return !!href && href.startsWith('http');
}

// HTML-escape a value, then turn newlines into <br /> — for headings that
// are rendered with set:html.
export function lines(value: string): string {
  const escaped = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  return escaped.replace(/\n/g, '<br />');
}
