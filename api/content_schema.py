"""
Editable website content schema.

Single source of truth for every text/image the admin can edit on the public
site. Each field has a stable key (used by the frontend via data-c="key"),
a page + section (used by the admin UI to group fields), a type, and the
default value (the copy that shipped with the site).

Types:
  text      – single line
  textarea  – multi-line plain text; newlines are rendered as line breaks
  image     – URL (site-relative like /images/team.jpg or absolute S3 URL)
  url       – external link
  toggle    – "true" / "false"; controls whether a button or section is shown
  link      – button target: a site route like /contact or a full https:// URL

Keys are dot-separated: <page>.<section>.<field>. Never rename a key once
shipped; the frontend and stored values depend on it.
"""

from typing import List, Dict, Any

Field = Dict[str, Any]


def f(key: str, label: str, default: str, type_: str = "text") -> Field:
    return {"key": key, "label": label, "type": type_, "default": default}


def t(key: str, label: str, default: bool = True) -> Field:
    """Visibility toggle for a button or section."""
    return f(key, label, "true" if default else "false", "toggle")


def l(key: str, label: str, default: str) -> Field:
    """Button link target (site route or full URL)."""
    return f(key, label, default, "link")


# ─────────────────────────────────────────────────────────────────────────────
# GLOBAL
# ─────────────────────────────────────────────────────────────────────────────
GLOBAL: List[Field] = [
    f("global.footer.tagline", "Footer tagline",
      "Inclusive, authentic adventure tourism rooted in a deep love for Lebanon's nature — connecting people to hidden trails, sacred cedars, and breathtaking landscapes.",
      "textarea"),
    f("global.contact.email", "Contact email", "lebventures.lebanon@gmail.com"),
    f("global.contact.phone", "Contact phone (display)", "+961 70-050590"),
    f("global.contact.phone_href", "Contact phone (tel: link, digits only)", "+96170050590"),
    f("global.contact.address", "Address (short)", "Byblos (Amchit), Lebanon"),
    f("global.social.instagram", "Instagram URL", "https://www.instagram.com/lebventures", "url"),
    f("global.social.facebook", "Facebook URL", "https://www.facebook.com/lebventures", "url"),
]

# ─────────────────────────────────────────────────────────────────────────────
# HOME
# ─────────────────────────────────────────────────────────────────────────────
HOME: List[Field] = [
    # Hero
    f("home.hero.image", "Hero banner image", "/header_lebventures.png", "image"),
    f("home.hero.tagline", "Hero tagline", "Lebanon · Nature · Adventure"),
    f("home.hero.heading", "Hero heading", "For the Love\nof Nature.", "textarea"),
    f("home.hero.subheading", "Hero subheading",
      "LebVentures connects adventurers with Lebanon's hidden trails, sacred cedars, ancient ruins, and breathtaking landscapes — guided by people who truly love this land.",
      "textarea"),
    f("home.hero.cta_primary", "Primary button label", "Plan Adventure"),
    f("home.hero.cta_secondary", "Secondary button label", "Let's Connect"),
    f("home.hero.stat1.value", "Stat 1 value", "20+"),
    f("home.hero.stat1.label", "Stat 1 label", "Trips Led"),
    f("home.hero.stat2.value", "Stat 2 value", "9"),
    f("home.hero.stat2.label", "Stat 2 label", "Adventure Types"),
    f("home.hero.stat3.value", "Stat 3 value", "100+"),
    f("home.hero.stat3.label", "Stat 3 label", "Adventurers"),

    # What we offer
    f("home.offer.heading", "Section heading", "What We Offer"),
    f("home.offer.subheading", "Section subheading", "Nine categories of adventure, one shared love for Lebanon's outdoors."),
    f("home.offer.card1.title", "Card 1 title", "Hiking & Trekking"),
    f("home.offer.card1.desc", "Card 1 description", "From the Cedar Reserve to the Qadisha Valley — trails for every level across Lebanon.", "textarea"),
    f("home.offer.card2.title", "Card 2 title", "Water Activities"),
    f("home.offer.card2.desc", "Card 2 description", "Kayaking, snorkeling, and fishing along Lebanon's stunning Mediterranean coast.", "textarea"),
    f("home.offer.card3.title", "Card 3 title", "Kids & Family"),
    f("home.offer.card3.desc", "Card 3 description", "Sensory hikes, mud games, and nature exploration designed for curious young adventurers.", "textarea"),
    f("home.offer.cta", "Section button label", "View All Adventures"),

    # Our story snippet
    f("home.story.image", "Story photo", "/images/team.jpg", "image"),
    f("home.story.heading", "Story heading", "Family-Founded,\nAdventure-Driven", "textarea"),
    f("home.story.p1", "Story paragraph 1",
      "LebVentures is a family-founded tour operator specializing in adventure tourism. Founded in 2019 by Pierre Abboud and Gioia Wehbe, we organize diverse outdoor experiences — from hiking and camping to rock climbing, kayaking, and customized eco-tours — tailored for all adventure levels.",
      "textarea"),
    f("home.story.p2", "Story paragraph 2",
      "Born out of a shared love for Lebanon's mountains, our mission is simple: connect people with Lebanon's extraordinary outdoors through inclusive, authentic, and sustainable adventures.",
      "textarea"),
    f("home.story.quote", "Story quote",
      "The mountains of Lebanon are not just scenery — they are living history, sacred ground, and a responsibility.",
      "textarea"),
    f("home.story.founders", "Founders line", "Pierre Abboud & Gioia Wehbe"),
    f("home.story.founders_sub", "Founders subline", "Founders · Scout Alumni · Based in Byblos"),
    f("home.story.cta", "Story button label", "Meet the Founders"),

    # Sustainability snippet
    f("home.eco.heading", "Sustainability heading", "Sustainable Tourism at Our Core"),
    f("home.eco.subheading", "Sustainability subheading",
      "Every decision we make is guided by respect for Lebanon's natural heritage — from route selection to supplier partnerships.",
      "textarea"),
    f("home.eco.pillar1", "Pillar 1", "Leave No Trace"),
    f("home.eco.pillar2", "Pillar 2", "Support Local"),
    f("home.eco.pillar3", "Pillar 3", "Protect Habitats"),
    f("home.eco.pillar4", "Pillar 4", "Education First"),
    f("home.eco.cta", "Sustainability button label", "Our Commitment"),

    # Community
    f("home.community.tagline", "Community tagline", "You Belong Here"),
    f("home.community.heading", "Community heading", "Join the LebVentures Community"),
    f("home.community.desc", "Community description",
      "LebVentures is more than a tour company — it's a growing tribe of nature lovers, weekend warriors, families, and solo explorers united by their passion for Lebanon's outdoors.",
      "textarea"),
    f("home.community.card1.title", "Card 1 title", "Group Adventures"),
    f("home.community.card1.desc", "Card 1 description", "Join organized group trips where strangers become lifelong trail friends. No experience required — just a willingness to explore.", "textarea"),
    f("home.community.card2.title", "Card 2 title", "Share Your Story"),
    f("home.community.card2.desc", "Card 2 description", "Our community shares trip photos, trail reports, and local tips. Every adventure contributes to our collective map of Lebanon.", "textarea"),
    f("home.community.card3.title", "Card 3 title", "Skills Workshops"),
    f("home.community.card3.desc", "Card 3 description", "Learn navigation, plant identification, wilderness first aid, and more through hands-on workshops led by our certified founders.", "textarea"),
    f("home.community.cta", "Community button label", "Get Involved"),
]

# ─────────────────────────────────────────────────────────────────────────────
# ADVENTURES
# ─────────────────────────────────────────────────────────────────────────────
_ADVENTURE_CARDS = [
    ("Hiking & Trekking", "From the Cedar Reserve in Bcharre to the Qadisha Valley, our guided hikes span all difficulty levels across Lebanon's most stunning terrain.", "All levels"),
    ("Rock Climbing & Caving", "Scale limestone cliffs with certified instructors, or explore Lebanon's underground world — from the caves of Afqa to vertical rock faces in Tannourine.", "Intermediate+"),
    ("Camping Expeditions", "Multi-day wild camping experiences under Lebanon's star-filled skies, deep in nature away from city noise — including our signature Billion Star Hotel experience.", "Overnight"),
    ("Water Activities", "Kayak along Lebanon's scenic coast, snorkel in crystal-clear Mediterranean waters, or join a fishing adventure — perfect for all ages and comfort levels.", "Seasonal"),
    ("Winter Experiences", "Strap on snowshoes and trek through Lebanon's breathtaking snowy landscapes. End around a crackling bonfire with our Snow and Fire winter adventure.", "Winter"),
    ("Leisure & Exploration", "Stargaze under a billion-star sky, master archery at a scenic picnic, or uncover Phoenician ruins and Roman temples woven into Lebanon's cultural landscape.", "Relaxed"),
    ("Mountain Biking", "Ride curated trails through pine forests and terraced villages, or cycle the historic Phoenician routes around Byblos for a journey through 5,000 years of history.", "Active"),
    ("Kids & Family", "Hands-on outdoor learning designed for children and families — from Little Explorers sensory hikes to rainy-day mud games and snail picking in the Muddy Trail.", "Family"),
    ("Rural & Cultural Immersion", "Dive into authentic Lebanese village life in Zouwede, Bchalleh, and Al Zourou3, or hike into history through ancient villages on our Telten l Bled trail.", "Cultural"),
]

ADVENTURES: List[Field] = [
    f("adventures.hero.tagline", "Hero tagline", "Choose Your Adventure"),
    f("adventures.hero.heading", "Hero heading", "Adventures for\nEvery Explorer", "textarea"),
    f("adventures.hero.subheading", "Hero subheading",
      "Nine categories of guided outdoor experiences spanning Lebanon's most spectacular terrain — from beginner-friendly family hikes to multi-day wilderness expeditions and winter snowshoeing.",
      "textarea"),
    f("adventures.hero.cta", "Hero button label", "Get in Touch"),
    f("adventures.section.heading", "Section heading", "Adventures We Offer"),
    f("adventures.section.subheading", "Section subheading",
      "Whether you're a first-timer or a seasoned explorer, we have an adventure crafted for you across Lebanon's diverse landscapes.",
      "textarea"),
    f("adventures.section.cta", "Section button label", "Plan Your Adventure"),
]
for _i, (_t, _d, _tag) in enumerate(_ADVENTURE_CARDS, start=1):
    ADVENTURES += [
        f(f"adventures.card{_i}.title", f"Card {_i} title", _t),
        f(f"adventures.card{_i}.desc", f"Card {_i} description", _d, "textarea"),
        f(f"adventures.card{_i}.tag", f"Card {_i} tag", _tag),
    ]

# ─────────────────────────────────────────────────────────────────────────────
# SUSTAINABILITY
# ─────────────────────────────────────────────────────────────────────────────
_PILLARS = [
    ("Leave No Trace", "Every trip follows strict LNT principles. We pack out what we pack in and educate our community on responsible outdoor ethics."),
    ("Support Local Communities", "We source food, guides, and accommodation from local villages, ensuring tourism income directly benefits the people of Lebanon."),
    ("Protect Natural Habitats", "From the cedars of God to the Chouf Biosphere Reserve, we partner with conservation bodies to protect Lebanon's ecosystems."),
    ("Education First", "Our guides are trained naturalists who share knowledge about local flora, fauna, geology, and the stories embedded in the land."),
]
_COMMITMENTS = [
    ("Leave No Trace", "We follow and teach the seven LNT principles on every trip. Waste management, fire safety, and respect for wildlife are non-negotiable parts of every LebVentures experience."),
    ("Support Local Communities", "Our guides are local to the regions we explore. We source food from village producers, rest at family guesthouses, and ensure that tourism income stays within Lebanese communities."),
    ("Protect Natural Habitats", "We partner with conservation bodies including the Chouf Cedar Reserve and Shouf Biosphere Reserve. We actively contribute to reforestation efforts and report trail damage."),
    ("Education First", "Every guide is trained in local flora, fauna, and geology. We believe that understanding nature deepens respect for it — so we teach as we explore."),
    ("Low-Impact Operations", "Small group sizes, minimal vehicle use, reusable gear, and plastic-free policies are standards — not extras. We continuously audit our environmental footprint."),
    ("Active Conservation", "A portion of every trip goes toward Lebanon's wildlife and trail conservation programs. Adventuring with LebVentures means you give back to the land you explore."),
]

SUSTAINABILITY: List[Field] = [
    f("sustainability.hero.tagline", "Hero tagline", "Our Commitment"),
    f("sustainability.hero.heading", "Hero heading", "Sustainable Tourism\nat Our Core", "textarea"),
    f("sustainability.hero.subheading", "Hero subheading",
      "We believe adventure and environmental stewardship are inseparable. Every LebVentures experience is designed to leave Lebanon's wild places better than we found them.",
      "textarea"),
    f("sustainability.intro.heading", "Intro heading", "Sustainable Tourism at Our Core"),
    f("sustainability.intro.text", "Intro paragraph",
      "LebVentures was built on the belief that adventure and environmental stewardship go hand in hand. Every decision we make — from route selection to supplier partnerships — is guided by sustainability and respect for Lebanon's natural heritage.",
      "textarea"),
    f("sustainability.quote.text", "Quote",
      "The mountains of Lebanon are not just scenery — they are living history, sacred ground, and a responsibility.",
      "textarea"),
    f("sustainability.quote.author", "Quote author", "LebVentures Founders"),
    f("sustainability.quote.role", "Quote author role", "Scout Alumni & Nature Advocates"),
    f("sustainability.commitments.heading", "Commitments heading", "How We Operate"),
    f("sustainability.commitments.subheading", "Commitments subheading", "Six concrete practices that guide every decision we make."),
    f("sustainability.cta.heading", "Closing heading", "Adventure Responsibly"),
    f("sustainability.cta.text", "Closing text", "Join a community that loves Lebanon enough to protect it."),
    f("sustainability.cta.button", "Closing button label", "Plan a Trip"),
]
for _i, (_t, _d) in enumerate(_PILLARS, start=1):
    SUSTAINABILITY += [
        f(f"sustainability.pillar{_i}.title", f"Pillar {_i} title", _t),
        f(f"sustainability.pillar{_i}.desc", f"Pillar {_i} description", _d, "textarea"),
    ]
for _i, (_t, _d) in enumerate(_COMMITMENTS, start=1):
    SUSTAINABILITY += [
        f(f"sustainability.commitment{_i}.title", f"Commitment {_i} title", _t),
        f(f"sustainability.commitment{_i}.desc", f"Commitment {_i} description", _d, "textarea"),
    ]

# ─────────────────────────────────────────────────────────────────────────────
# ABOUT / OUR STORY
# ─────────────────────────────────────────────────────────────────────────────
_TIMELINE = [
    ("The Beginning", "Pierre Abboud and Gioia Wehbe meet through a shared love of Lebanon's outdoors. Their passion for nature, adventure, and community becomes the foundation of a lifelong partnership."),
    ("Certifications", "Both pursue formal certifications in Wilderness First Aid, navigation, rope safety, and sustainable tourism guiding — staying current with ongoing training each year."),
    ("2019", "LebVentures launches from Byblos with its first guided adventures. A small community of nature lovers quickly grows into a movement for inclusive, authentic outdoor experiences across Lebanon."),
    ("Expanding", "LebVentures grows its offerings to 9+ adventure types — from land and water to winter excursions and kids educational experiences — while deepening partnerships with local communities and artisans."),
    ("Today", "With 20+ trips delivered and 100+ adventurers guided, LebVentures continues to expand. Pierre and Gioia remain hands-on, certified, and out on the trail every week — for the love of nature."),
]

ABOUT: List[Field] = [
    f("about.hero.tagline", "Hero tagline", "Our Story"),
    f("about.hero.heading", "Hero heading", "Family-Founded,\nAdventure-Driven", "textarea"),
    f("about.hero.subheading", "Hero subheading",
      "A shared passion for Lebanon's mountains turned into a mission: connecting adventurers with the country's hidden trails, sacred cedars, and breathtaking landscapes.",
      "textarea"),
    f("about.card.image", "Founders photo", "/images/team.jpg", "image"),
    f("about.card.title", "Photo card title", "Scout Alumni"),
    f("about.card.subtitle", "Photo card subtitle", "Est. in the cedar forests of Lebanon"),
    f("about.card.quote", "Photo card quote",
      "We met as teenagers in scouts, fell in love with the mountains, and with each other. After our wedding, we knew we had to find a way to share what Lebanon's nature had given us — the community, the discipline, the wonder.",
      "textarea"),
    f("about.card.stat1.value", "Card stat 1 value", "2019"),
    f("about.card.stat1.label", "Card stat 1 label", "Founded"),
    f("about.card.stat2.value", "Card stat 2 value", "Certified"),
    f("about.card.stat2.label", "Card stat 2 label", "Wilderness First Aid"),
    f("about.card.stat3.value", "Card stat 3 value", "Active"),
    f("about.card.stat3.label", "Card stat 3 label", "Ongoing training"),
    f("about.story.heading", "Story heading", "Family-Founded, Adventure-Driven"),
    f("about.story.p1", "Story paragraph 1",
      "LebVentures is a family-founded tour operator specializing in adventure tourism, organized by Pierre Abboud and Gioia Wehbe. We offer diverse outdoor experiences — hiking, camping, rock climbing, kayaking, and customized eco-tours — tailored for all adventure levels.",
      "textarea"),
    f("about.story.p2", "Story paragraph 2",
      "What sets us apart is our commitment to inclusive, accessible adventures for everyone: families, solo travelers, corporate teams, and niche groups. We collaborate with local communities, artisans, and guides to deliver authentic, off-the-beaten-path experiences that support and celebrate Lebanon's local heritage.",
      "textarea"),
    f("about.story.p3", "Story paragraph 3",
      "Both founders remain active and continuously certified in wilderness skills, first aid, and sustainable tourism best practices. Every adventure is backed by deep local knowledge and a genuine love for Lebanon's mountains, coastlines, and valleys.",
      "textarea"),
    f("about.timeline.heading", "Timeline heading", "Our Journey"),
    f("about.timeline.subheading", "Timeline subheading", "From scout meetings to mountain guides — the story behind LebVentures."),
    f("about.cta.heading", "Closing heading", "Ready to Join Us?"),
    f("about.cta.text", "Closing text",
      "Every adventure with LebVentures is guided by the same values that shaped our founders — respect, community, and love for the wild.",
      "textarea"),
    f("about.cta.button", "Closing button label", "Get in Touch"),
]
for _i, (_y, _t) in enumerate(_TIMELINE, start=1):
    ABOUT += [
        f(f"about.timeline.item{_i}.year", f"Timeline {_i} label", _y),
        f(f"about.timeline.item{_i}.text", f"Timeline {_i} text", _t, "textarea"),
    ]

# ─────────────────────────────────────────────────────────────────────────────
# CONTACT
# ─────────────────────────────────────────────────────────────────────────────
CONTACT: List[Field] = [
    f("contact.header.tagline", "Header tagline", "Get in Touch"),
    f("contact.header.heading", "Header heading", "Ready to Venture Out?"),
    f("contact.header.subheading", "Header subheading",
      "Tell us about the experience you're dreaming of. We'll design it around your group, pace, and goals.",
      "textarea"),
    f("contact.form.heading", "Form heading", "Ready to Venture Out?"),
    f("contact.form.subheading", "Form subheading",
      "Tell us about the adventure you're dreaming of and we'll craft the perfect experience for you.",
      "textarea"),
    f("contact.form.button", "Form submit label", "Send My Request"),
    f("contact.form.success_title", "Success title", "Message Received!"),
    f("contact.form.success_text", "Success text", "Thanks for reaching out! One of our guides will be in touch within 24 hours.", "textarea"),
    f("contact.call.tagline", "Discovery call tagline", "Not sure where to start?"),
    f("contact.call.heading", "Discovery call heading", "Book a Free Discovery Call"),
    f("contact.call.text", "Discovery call text",
      "Jump on a free 10-minute call with Pierre or Gioia. Tell us what you're looking for and we'll point you toward the perfect experience — no pressure, no commitment.",
      "textarea"),
    f("contact.call.button", "Discovery call button label", "📅 Schedule My Free Call"),
    f("contact.call.url", "Discovery call link (Calendly)", "https://calendly.com/lebventures", "url"),
    f("contact.call.note", "Discovery call note", "Calendly · Pick any open slot that works for you"),
    f("contact.info.location.title", "Location title", "Based in Byblos"),
    f("contact.info.location.text", "Location text", "El Tine Street, Amchit — operating across Lebanon's mountains, valleys, and coast.", "textarea"),
    f("contact.info.email.title", "Email title", "Email Us"),
    f("contact.info.phone.title", "Phone title", "Call / WhatsApp"),
]


# ─────────────────────────────────────────────────────────────────────────────
# VISIBILITY TOGGLES (buttons and sections)
# Frontend binds these with data-c-show="<key>"; "false" hides the element.
# ─────────────────────────────────────────────────────────────────────────────
GLOBAL += [
    t("global.navbar.cta.show", "Show \"Let's Connect\" button in navbar"),
    t("global.footer.social.show", "Show social icons in footer"),
]

HOME += [
    t("home.hero.cta_primary.show", "Show primary button"),
    t("home.hero.cta_secondary.show", "Show secondary button"),
    t("home.hero.stats.show", "Show stats row"),
    t("home.offer.show", "Show \"What We Offer\" section"),
    t("home.offer.cards.link.show", "Cards clickable (show \"Learn more\")"),
    t("home.offer.cta.show", "Show section button"),
    t("home.story.show", "Show \"Our Story\" section"),
    t("home.story.cta.show", "Show story button"),
    t("home.eco.show", "Show sustainability section"),
    t("home.eco.cta.show", "Show sustainability button"),
    t("home.community.show", "Show community section"),
    t("home.community.cta.show", "Show community button"),
]

ADVENTURES += [
    t("adventures.hero.cta.show", "Show hero button"),
    t("adventures.section.cta.show", "Show section button"),
]

SUSTAINABILITY += [
    t("sustainability.intro.show", "Show intro section (pillars + quote)"),
    t("sustainability.commitments.show", "Show \"How We Operate\" section"),
    t("sustainability.cta.show", "Show closing section"),
    t("sustainability.cta.button.show", "Show closing button"),
]

ABOUT += [
    t("about.story.show", "Show story section"),
    t("about.timeline.show", "Show timeline section"),
    t("about.cta.show", "Show closing section"),
    t("about.cta.button.show", "Show closing button"),
]

CONTACT += [
    t("contact.form.show", "Show contact form"),
    t("contact.call.show", "Show discovery call section"),
    t("contact.info.show", "Show info strip (location / email / phone)"),
]


# ─────────────────────────────────────────────────────────────────────────────
# BUTTON LINKS
# Frontend binds these with data-c-href="<key>". Values may be a site route
# (/contact) or a full URL (https://...).
# ─────────────────────────────────────────────────────────────────────────────
GLOBAL += [
    l("global.navbar.cta.href", "\"Let's Connect\" button link", "/contact"),
]

HOME += [
    l("home.hero.cta_primary.href", "Primary button link", "/adventures"),
    l("home.hero.cta_secondary.href", "Secondary button link", "/contact"),
    l("home.offer.card1.href", "Card 1 link", "/adventures"),
    l("home.offer.card2.href", "Card 2 link", "/adventures"),
    l("home.offer.card3.href", "Card 3 link", "/adventures"),
    l("home.offer.cta.href", "Section button link", "/adventures"),
    l("home.story.cta.href", "Story button link", "/about"),
    l("home.eco.cta.href", "Sustainability button link", "/sustainable-tourism"),
    l("home.community.cta.href", "Community button link", "/contact"),
]

ADVENTURES += [
    l("adventures.hero.cta.href", "Hero button link", "/contact"),
    l("adventures.section.cta.href", "Section button link", "/contact"),
]

SUSTAINABILITY += [
    l("sustainability.cta.button.href", "Closing button link", "/contact"),
]

ABOUT += [
    l("about.cta.button.href", "Closing button link", "/contact"),
]

# ─────────────────────────────────────────────────────────────────────────────
# Registry
# ─────────────────────────────────────────────────────────────────────────────
PAGES: List[Dict[str, Any]] = [
    {"id": "home",           "label": "Home",           "fields": HOME},
    {"id": "adventures",     "label": "Adventures",     "fields": ADVENTURES},
    {"id": "sustainability", "label": "Sustainability", "fields": SUSTAINABILITY},
    {"id": "about",          "label": "Our Story",      "fields": ABOUT},
    {"id": "contact",        "label": "Contact",        "fields": CONTACT},
    {"id": "global",         "label": "Global",         "fields": GLOBAL},
]

ALL_FIELDS: List[Field] = [fld for page in PAGES for fld in page["fields"]]
DEFAULTS: Dict[str, str] = {fld["key"]: fld["default"] for fld in ALL_FIELDS}
FIELD_TYPES: Dict[str, str] = {fld["key"]: fld["type"] for fld in ALL_FIELDS}

assert len(DEFAULTS) == len(ALL_FIELDS), "duplicate content keys in schema"
