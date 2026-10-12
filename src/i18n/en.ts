export type Messages = {
  locale: "en" | "ar";
  dir: "ltr" | "rtl";
  skipToContent: string;
  switcher: { toEn: string; toAr: string; ariaLabel: string };
  nav: {
    about: string;
    findYourMatch: string;
    services: string;
    process: string;
    bookCall: string;
    bookCallAria: string;
    whatsapp: string;
    chatWhatsApp: string;
    forEmployers: string;
    lookingForPositions: string;
    browseOpenRoles: string;
    openMenu: string;
    closeMenu: string;
    menu: string;
    menuDescription: string;
    sections: string;
    goToTop: string;
    goToHomepage: string;
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
    founderBadge: string;
    quote: string;
    portraitAlt: string;
    mandatesEyebrow: string;
    region: string;
    mandatesHeading: string;
    mandatesBody: string;
    pills: readonly string[];
  };
  about: {
    meetTheFounder: string;
    notUsual: string;
    point: string;
    founderRole: string;
    p1: string;
    p2: string;
    facts: readonly string[];
    pillars: readonly { title: string; body: string }[];
  };
  services: {
    eyebrow: string;
    heading: string;
    subheading: string;
    employers: readonly { title: string; body: string }[];
    partnershipEyebrow: string;
    partnershipHeading: string;
    partnershipBody: string;
    bookConsultation: string;
    discussWhatsApp: string;
    jobSeekerPrompt: string;
    jobSeekerLink: string;
  };
  howItWorks: {
    eyebrow: string;
    heading: string;
    subheading: string;
    stepLabels: readonly string[];
    steps: readonly { title: string; body: string }[];
  };
  liveVacancies: {
    heading: string;
    subheading: string;
    all: string;
    quietHeading: string;
    quietBody: string;
    noneCategoryHeadingPattern: string;
    noneCategoryBodyPattern: string;
    showAll: string;
    directoryPrompt: string;
    viewAll: string;
    filterAria: string;
    loadingAria: string;
    errorHeading: string;
    errorBody: string;
    checkAgain: string;
    checking: string;
    checkAgainAria: string;
    checkingAria: string;
    whatsapp: string;
  };
  footer: {
    heading: string;
    subheading: string;
    tagline: string;
    italicTagline: string;
    bookCall: string;
    chatWhatsApp: string;
    chatAria: string;
    copyright: string;
    helper: string;
    helperSeekers: string;
    browseAllRoles: string;
    builtWith: string;
    love: string;
    byCreditPattern: string;
  };
  cal: {
    title: string;
    subtitle: string;
    description: string;
    loading: string;
    unavailable: string;
    unavailableHint: string;
    bookOnCal: string;
    chatWhatsApp: string;
    emailYasmin: string;
    closeAria: string;
    iframeTitle: string;
  };
  actionStack: {
    quickActions: string;
    bookCall: string;
    whatsapp: string;
  };
  notFound: {
    eyebrow: string;
    heading: string;
    body: string;
    backHome: string;
    exploreRoles: string;
  };
  markets: {
    heading: string;
    countriesHeading: string;
    industriesHeading: string;
    countries: readonly string[];
    industries: readonly string[];
  };
  trust: {
    heading: string;
    press: readonly string[];
    testimonial: {
      body: string;
      citeName: string;
      citeRole: string;
    };
    stats: {
      followersLabel: string;
      juniorToCsuite: string;
      menaRegion: string;
      talkLabel: string;
      tedxTitle: string;
    };
  };
};

export const en: Messages = {
  locale: "en",
  dir: "ltr",
  skipToContent: "Skip to content",
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
    bookCallAria: "Book an executive hiring consultation with Yasmin",
    whatsapp: "WhatsApp",
    chatWhatsApp: "Chat on WhatsApp",
    forEmployers: "For Employers",
    lookingForPositions: "Looking for open positions?",
    browseOpenRoles: "Browse open roles",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menu: "Menu",
    menuDescription: "Site sections and booking.",
    sections: "Sections",
    goToTop: "HireFound - Go to top",
    goToHomepage: "HireFound - Go to homepage",
    descriptors: {
      about: "The founder and the matchmaking standard",
      vacancies: "Open roles across Jordan and the Gulf",
      services: "Executive search and hiring solutions",
      process: "From first call to first day",
    },
  },
  hero: {
    byline: "by Yasmin Blasi",
    tagline: "You want a hire? We got you found.",
    subline:
      "Executive search and culture-first hiring across Jordan and the Gulf.",
    ctaHiring: "I'm Hiring Executive Talent",
    ctaExplore: "Explore Open Roles",
    facts: [
      "Direct Founder Access",
      "10+ Years of Experience",
      "MENA Region",
      "Junior to C-Suite",
      "TEDx Speaker",
    ] as const,
    founderBadge: "Founder",
    quote:
      "Fewer seats filled, more lasting matches, and a direct line to the person you actually book.",
    portraitAlt: "Yasmin Blasi, founder of HireFound",
    mandatesEyebrow: "Executive Mandates",
    region: "Jordan & The Gulf",
    mandatesHeading: "Practice Areas & Executive Mandates",
    mandatesBody:
      "C-Suite & Board Appointments, Headhunting & Retained Search, and Behavioral Profiling for leadership teams.",
    pills: [
      "Executive Retainers",
      "C-Suite & Board",
      "DISC Profiling",
    ] as const,
  },
  about: {
    meetTheFounder: "Meet the Founder",
    notUsual: "I'm not your usual recruiter.",
    point: "And that's exactly the point.",
    founderRole: "Founder & Executive Matchmaker",
    p1: "Yasmin Blasi spent a decade in HR and recruitment: talent acquisition, senior leadership, coaching executives, and reading thousands of CVs across Jordan and the broader MENA region.",
    p2: "HireFound is the practice she built after leaving corporate HR: fewer seats filled, more lasting matches, and a direct line to the person you actually book.",
    facts: [
      "10+ years of experience",
      "MENA region",
      "Junior to C-suite",
      "TEDx speaker",
    ] as const,
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
    eyebrow: "Employer Services",
    heading: "How I Help Companies Hire",
    subheading:
      "Boutique executive search, talent recruitment, and leadership assessments across Jordan and the Gulf.",
    employers: [
      {
        title: "Executive Search & Headhunting",
        body: "I find leaders who don't just fill a seat: they transform your business. C-suite, directors, the people who move the needle.",
      },
      {
        title: "Recruitment & Job Matching",
        body: "From specialized individual contributors to department heads. I handle sourcing, rigorous screening, and culture matching, so you just meet the finalists.",
      },
      {
        title: "DISC Assessments",
        body: "Understand how your candidates think, communicate, and lead. Certified behavioral insights mean better hires that stick long-term.",
      },
    ] as const,
    partnershipEyebrow: "Direct Partnership",
    partnershipHeading: "Have an open role or leadership search?",
    partnershipBody:
      "Book a discovery call directly with Yasmin to review your mandate, culture, and hiring timeline.",
    bookConsultation: "Book Consultation",
    discussWhatsApp: "Discuss on WhatsApp",
    jobSeekerPrompt: "Looking for open roles? Explore all active positions on our",
    jobSeekerLink: "Open Roles board",
  },
  howItWorks: {
    eyebrow: "The Matchmaking Process",
    heading: "How It Works",
    subheading: "Three steps. One promise: I'll find your match.",
    stepLabels: ["Step 01", "Step 02", "Step 03"] as const,
    steps: [
      {
        title: "We Talk",
        body: "Tell me everything: the mandate, the leadership dynamic, the vision. I listen like it matters, because it does.",
      },
      {
        title: "We Match",
        body: "Discreet headhunting, cultural vetting, and DISC behavioral profiling. You only meet vetted finalists who fit.",
      },
      {
        title: "You Grow",
        body: "The hire sticks. The leadership team gains momentum. And I stay closely connected for ongoing retention.",
      },
    ] as const,
  },
  liveVacancies: {
    heading: "Find Your Match",
    subheading:
      "Roles I'm actively matching for. If one feels right, let's talk.",
    all: "All",
    quietHeading: "Quiet on the board",
    quietBody: "New openings show up here as they come in. Check back soon.",
    noneCategoryHeadingPattern: "Nothing in {category} just yet",
    noneCategoryBodyPattern:
      "There are currently no active openings filed under {category}.",
    showAll: "Show all active roles",
    directoryPrompt:
      "Looking for a different role or city? Browse the full directory.",
    viewAll: "View All Open Roles",
    filterAria: "Filter jobs by category",
    loadingAria: "Loading open roles",
    errorHeading: "The board is taking a breath",
    errorBody:
      "We are having trouble connecting to live roles right now. Give it a moment, or try checking again below.",
    checkAgain: "Check again",
    checking: "Checking...",
    checkAgainAria: "Check again for open roles",
    checkingAria: "Checking for open roles",
    whatsapp: "WhatsApp",
  },
  footer: {
    heading: "Your next game-changer is\njust a conversation away.",
    subheading: "Let's find them together.",
    tagline: "Looking for a Hire? We've got you Found.",
    italicTagline: "Find your match. Find your future.",
    bookCall: "Book a Call",
    chatWhatsApp: "Chat on WhatsApp",
    chatAria: "Chat with Yasmin Blasi on WhatsApp",
    copyright: "© 2026 HireFound. All rights reserved.",
    helper:
      "Employers: Book a discovery call, or message me directly on WhatsApp.",
    helperSeekers: "Looking for open positions?",
    browseAllRoles: "Browse all open roles",
    builtWith: "Built with",
    love: "love",
    byCreditPattern: "by {name}",
  },
  cal: {
    title: "Book an Executive Consultation",
    subtitle: "For founders, CEOs & hiring leaders",
    description: "Choose a time to talk with Yasmin about executive hiring.",
    loading: "Loading calendar...",
    unavailable: "Calendar unavailable",
    unavailableHint:
      "The scheduling page didn't load. Try Cal.com, WhatsApp, or email instead.",
    bookOnCal: "Book on Cal.com",
    chatWhatsApp: "Chat on WhatsApp",
    emailYasmin: "Email Yasmin",
    closeAria: "Close booking",
    iframeTitle: "Book a call with Yasmin on Cal.com",
  },
  actionStack: {
    quickActions: "Quick actions",
    bookCall: "Book a Call",
    whatsapp: "WhatsApp",
  },
  notFound: {
    eyebrow: "Error 404",
    heading: "Off the Beaten Track",
    body: "The page you are looking for has moved or does not exist. Let us guide you back to open roles and executive matchmaking.",
    backHome: "Back to Home",
    exploreRoles: "Explore Open Roles",
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
