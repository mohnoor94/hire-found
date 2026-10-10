export type Messages = {
  locale: "en" | "ar";
  dir: "ltr" | "rtl";
  switcher: { toEn: string; toAr: string; ariaLabel: string };
  nav: {
    about: string;
    findYourMatch: string;
    services: string;
    process: string;
    bookCall: string;
    descriptors: {
      about: string;
      vacancies: string;
      services: string;
      process: string;
    };
  };
  hero: {
    byline: string;
    tagline: string;
    subline: string;
    ctaHiring: string;
    ctaExplore: string;
    facts: readonly string[];
  };
  about: {
    meetTheFounder: string;
    notUsual: string;
    point: string;
    founderRole: string;
    p1: string;
    p2: string;
    pillars: readonly { title: string; body: string }[];
  };
  services: {
    heading: string;
    subheading: string;
    tabEmployers: string;
    tabCandidates: string;
    employers: readonly { title: string; body: string }[];
    candidates: readonly { title: string; body: string }[];
  };
  howItWorks: {
    heading: string;
    subheading: string;
    steps: readonly { title: string; body: string }[];
  };
  liveVacancies: {
    heading: string;
    subheading: string;
    all: string;
    noneAll: string;
    noneCategoryPattern: string;
    interest: string;
    bookCall: string;
    whatsapp: string;
  };
  footer: {
    heading: string;
    subheading: string;
    tagline: string;
    italicTagline: string;
    bookCall: string;
    chatWhatsApp: string;
    copyright: string;
  };
  cal: {
    title: string;
    loading: string;
    unavailable: string;
    unavailableHint: string;
    bookOnCal: string;
    chatWhatsApp: string;
    emailYasmin: string;
  };
  markets: {
    heading: string;
    countriesHeading: string;
    industriesHeading: string;
    countries: readonly string[];
    industries: readonly string[];
  };
};

export const en: Messages = {
  locale: "en",
  dir: "ltr",
  switcher: {
    toEn: "English",
    toAr: "العربية",
    ariaLabel: "Switch language",
  },
  nav: {
    about: "About",
    findYourMatch: "Find Your Match",
    services: "Services",
    process: "Process",
    bookCall: "Book a Call",
    descriptors: {
      about: "The founder and the matchmaking standard",
      vacancies: "Open roles across Jordan and the Gulf",
      services: "Hiring support and career matchmaking",
      process: "From first call to first day",
    },
  },
  hero: {
    byline: "by Yasmin Blasi",
    tagline: "You want a hire? We got you found.",
    subline: "Matchmakers for meaningful careers across Jordan and the Gulf.",
    ctaHiring: "I'm Hiring Executive Talent",
    ctaExplore: "Explore Open Roles",
    facts: [
      "Direct Founder Access",
      "10+ years in HR",
      "MENA Region",
      "Junior to C-Suite",
      "TEDx Speaker",
    ] as const,
  },
  about: {
    meetTheFounder: "Meet the Founder",
    notUsual: "I'm not your usual recruiter.",
    point: "And that's exactly the point.",
    founderRole: "Founder & Executive Matchmaker",
    p1: "Yasmin Blasi spent a decade in HR and recruitment: talent acquisition, senior leadership, coaching executives, and reading thousands of CVs across Jordan and the broader MENA region.",
    p2: "HireFound is the practice she built after leaving corporate HR: fewer seats filled, more lasting matches, and a direct line to the person you actually book.",
    pillars: [
      {
        title: "Matchmaking, Not Seat-Filling",
        body: "I find people who fit your culture, not just your job description.",
      },
      {
        title: "Your Story, Not Just Keywords",
        body: "Every candidate is more than a CV. Every company is more than a job post.",
      },
      {
        title: "From First Call to First Day",
        body: "I don't disappear after the offer letter. I'm here for the whole journey.",
      },
    ] as const,
  },
  services: {
    heading: "How Can I Help?",
    subheading: "Whether you're building a team or building a career.",
    tabEmployers: "For Employers",
    tabCandidates: "For Candidates",
    employers: [
      {
        title: "Executive Search & Headhunting",
        body: "I find leaders who don't just fill a seat: they transform your business. C-suite, directors, the people who move the needle.",
      },
      {
        title: "Recruitment & Job Matching",
        body: "From junior to senior, across industries. I handle sourcing, screening, and matching, so you just meet the finalists.",
      },
      {
        title: "DISC Assessments",
        body: "Understand how your candidates think, communicate, and work. Better insights mean better hires that stick.",
      },
    ] as const,
    candidates: [
      {
        title: "Career Matchmaking",
        body: "Tell me where you want to go. I'll find the opportunities that actually match: not just what's available, but what's right.",
      },
      {
        title: "CV Optimization",
        body: "Your CV should tell your story, not just list your jobs. I'll help you make it impossible to ignore.",
      },
      {
        title: "Interview Preparation",
        body: "Nervous? Don't be. We'll practice until you walk in there owning the room. I know what they're looking for.",
      },
    ] as const,
  },
  howItWorks: {
    heading: "How It Works",
    subheading: "Three steps. One promise: I'll find your match.",
    steps: [
      {
        title: "We Talk",
        body: "Tell me everything. The role, the culture, the dream. I listen like it matters, because it does.",
      },
      {
        title: "We Match",
        body: "I go find your person. Not the most available, but the most right.",
      },
      {
        title: "You Grow",
        body: "The hire sticks. The career takes off. And I'm still just a message away.",
      },
    ] as const,
  },
  liveVacancies: {
    heading: "Find Your Match",
    subheading:
      "Open roles I'm hiring for right now. Something catch your eye? Let's talk.",
    all: "All",
    noneAll: "No open roles right now",
    noneCategoryPattern: "No jobs available in {category}",
    interest:
      "Interested in opportunities? Reach out directly. I'd love to hear from you.",
    bookCall: "Book a Call",
    whatsapp: "WhatsApp",
  },
  footer: {
    heading: "Your next game-changer is\njust a conversation away.",
    subheading: "Let's find them together.",
    tagline: "Looking for a Hire? We've got you Found.",
    italicTagline: "Find your match. Find your future.",
    bookCall: "Book a Call",
    chatWhatsApp: "Chat on WhatsApp",
    copyright: "© 2026 HireFound. All rights reserved.",
  },
  cal: {
    title: "Book a Call with Yasmin",
    loading: "Loading calendar...",
    unavailable: "Calendar unavailable",
    unavailableHint:
      "The scheduling page didn't load. Try Cal.com, WhatsApp, or email instead.",
    bookOnCal: "Book on Cal.com",
    chatWhatsApp: "Chat on WhatsApp",
    emailYasmin: "Email Yasmin",
  },
  markets: {
    heading: "Markets we hire for",
    countriesHeading: "Countries",
    industriesHeading: "Industries we've seen",
    countries: ["Jordan", "Saudi Arabia", "UAE", "Oman"] as const,
    industries: [
      "Tourism & Travel",
      "Medical Devices",
      "Fintech & Payments",
      "Insurance",
      "Audit",
      "Education",
      "B2B SaaS",
      "Oil & Gas / Water Treatment",
      "Aviation",
      "Marble / Manufacturing",
    ] as const,
  },
  trust: {
    heading: "As seen in",
    press: [
      "TEDx Zarqa University",
      "Al Mamlaka TV (two live interviews)",
      "parachute16 Digital Graduates Industry Meetup (panelist)",
    ] as const,
    testimonial: {
      body:
        "I appreciate your professional support and valuable advice. Thank you for taking the time to guide me.",
      citeName: "Kholoud Joudeh",
      citeRole: "Client (Food Quality & Safety / QA lead)",
    },
    stats: {
      followersLabel: "LinkedIn followers",
      juniorToCsuite: "Junior to C-suite",
      menaRegion: "MENA region",
      talkLabel: "Talk",
      tedxTitle: "TEDx Zarqa University",
    },
  },
};

