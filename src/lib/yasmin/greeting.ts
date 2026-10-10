/**
 * Greeting helpers for Yasmin's Space.
 * Provides personalized greetings, warm daily affirmations, and celebration toasts.
 */

export const GREETING_TEMPLATES: Array<(name: string) => string> = [
  (name) => `Hey ${name} ✨`,
  (name) => `Welcome back, ${name} 🦋`,
  (name) => `Hi ${name}, lovely to see you 💜`,
  (name) => `Hello ${name} 🌸`,
  (name) => `There she is, ${name} 💫`,
  (name) => `Good to see you, ${name} 🌷`,
  (name) => `Hey gorgeous, ${name} 💕`,
  (name) => `Look who's here, ${name} 🦋`,
  (name) => `Missed you, ${name} 🌙`,
  (name) => `You're glowing today, ${name} ☀️`,
  (name) => `The queen is back, ${name} 👑`,
  (name) => `Hey superstar, ${name} 🌟`,
  (name) => `Always a pleasure, ${name} 🫶`,
  (name) => `Ready to shine, ${name}? ✨`,
  (name) => `Here comes the magic, ${name} 🪄`,
  (name) => `You light up this space, ${name} 💛`,
  (name) => `Hey beautiful soul, ${name} 🌺`,
  (name) => `The vibe just shifted, ${name} 💃`,
  (name) => `Oh hey, ${name}! 🌻`,
  (name) => `${name}, you absolute gem 💎`,
  (name) => `There's my favorite person, ${name} 🥰`,
  (name) => `${name} in the house 🏡`,
  (name) => `Hiii ${name} 🧚‍♀️`,
  (name) => `${name}, the legend herself 🏆`,
  (name) => `Welcome to your happy place, ${name} 🎀`,
  (name) => `${name}! Let's do this 🚀`,
  (name) => `Hey sunshine, ${name} 🌞`,
  (name) => `${name}, you're a whole mood 💅`,
  (name) => `Look at you showing up, ${name} 🌈`,
  (name) => `${name}, the world is better with you 🌍`,
];

export const SUBTITLES = [
  "Your next great hire is one click away.",
  "Ready to find someone amazing?",
  "Let's connect talent with opportunity.",
  "Time to make magic happen ✨",
  "The perfect candidate is out there 🦋",
  "Let's build something beautiful today 🌸",
  "Great things are about to happen.",
  "You make hiring look effortless 💜",
  "Another day, another perfect match.",
  "Today's going to be a good one 🌷",
  "Dream teams start with you 💫",
  "Your energy today? Unstoppable 🔥",
  "Sprinkle some magic on those listings ✨",
  "The world needs what you create 🌍",
  "One post away from changing a life 🦋",
  "You were made for this 💜",
  "Good vibes and great hires ahead 🌈",
  "Confidence looks good on you 👑",
  "Small steps, big impact, always 🌱",
  "Let's turn dreams into careers 🚀",
  "Every listing tells a story 📖",
  "You bring the spark, we bring the tools 🔧",
  "Making connections, one post at a time 🤝",
  "Your taste in talent? Impeccable 💎",
  "The right person is waiting for this 🌟",
  "Someone's career is about to change 🎯",
  "Keep going, you're doing amazing 💪",
  "Today feels like a breakthrough day ⚡",
  "Trust the process, trust yourself 🧘",
  "Creating opportunities like nobody else 🏆",
  "Your dashboard, your kingdom 👑",
  "Hire with heart, lead with soul 💜",
  "Big things have small beginnings 🌱",
  "You turn chaos into clarity ✨",
  "The talent market loves you back 💕",
  "Another masterpiece in the making 🎨",
  "Stay golden, stay brilliant 🌻",
  "Your next success story starts now 📝",
  "Curating careers with grace 🦢",
  "Making the job world a better place 🌈",
] as const;

export const DAILY_AFFIRMATIONS = [
  "Today is filled with wonderful possibilities 🌸",
  "You don't just place talent, Yasmin; you transform leadership teams and lives 💫",
  "Every conversation you have opens a life-changing door for someone 🦋",
  "Your intuition for exceptional people is unmatched ☀️",
  "Executive recruitment is an art, and your curation is pure brilliance 💎",
  "Trust your instincts today; you always recognize true potential before anyone else 🌟",
  "Your warmth and dedication set a standard of excellence 🌷",
  "You are building the future of remarkable companies, one placement at a time 🏛️",
  "A thoughtful leader will find their dream role because of your guidance today 🎯",
  "Bring that signature spark to every search 🌺",
  "Your empathy and strategic eye make you an unstoppable force in recruitment 💜",
  "Never underestimate the ripple effect of placing the right leader in the right seat 🌊",
  "Keep shining, Yasmin; you bring heart, elegance, and integrity to every deal ✨",
  "Momentum is building with every introduction you make 🌿",
  "Candidates remember how you made them feel: valued, seen, and empowered 🤍",
  "Your taste in executive talent is second to none; lead with confidence today 👑",
  "Every great company started with one key hire. You are making that happen 🚀",
  "Take a deep breath, you've got this completely 🌻",
  "You craft career stories that inspire generations. Keep weaving magic 🪄",
  "Quiet confidence and deep care: that is your superpower, Yasmin 🕊️",
  "Clients trust you because you listen deeply and deliver with flawless precision 🤝",
  "Another day to celebrate your unique talent 🌈",
  "The best founders in the region seek your counsel; own your expertise 🏆",
  "You change the trajectory of careers and families with every offer signed 📝",
  "Lead with grace, negotiate with poise, and celebrate every win 🥂",
  "Your positive energy lights up every room you enter 🌸",
  "You are more than a recruiter; you are an architect of high-performing teams 🏗️",
  "Big impact happens in subtle moments: one message, one phone call, one introduction 💫",
  "Your resilience and grace inspire everyone around you, Yasmin 🌷",
  "Step forward today knowing you are extraordinary 💎",
  "Take a quiet moment to savor your coffee today, Yasmin ☕ - beauty is in the pause.",
  "This space is yours to breathe, create, and thrive 🏡 - you belong here.",
  "Trust the timing of your life and the brilliance of your craft 🕊️",
  "You bring light to every corner of your work and life 💫",
  "Pour a warm cup of coffee, pause, and celebrate how much you have already built, Yasmin ☕",
  "You do not have to carry the whole world today; just one thoughtful conversation at a time 🌿",
  "Trust your intuition today. You recognize genuine leadership before anyone else 🌟",
  "Your empathy is your greatest superpower, Yasmin. Leaders always remember how you made them feel 🤍",
  "Breathe in peace, breathe out doubt. You are walking in your purpose 🕊️",
  "Quiet moments of rest are just as vital as the deals you close. Be kind to yourself today 🌷",
  "You bring elegance, warmth, and relentless excellence wherever you go 👑",
  "Every introduction you make plants the seed for someone's future success 🍃",
] as const;

export function formatAtelierDate(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return "Today";
  }
}

export const CELEBRATION_TOASTS = {
  create: [
    "Live and glowing! Someone's dream career is out there now ✨🦋",
    "Published with love! Another future shaped by Yasmin 🌸",
    "A new door is officially open 🚪✨",
    "Opportunity unleashed! The right leader is on their way 🌟",
    "Crafted with care, live for the world 💎",
  ],
  activate: [
    "Turned on! Go find that superstar 💫",
    "Active and radiating opportunity 🦋",
    "Back in flight! Ready for talent 🌟",
    "Reactivated and shining bright! Let's connect great minds ✨",
    "Open for talent again! Exciting times ahead 🚀",
  ],
} as const;

export type CelebrationToastType = keyof typeof CELEBRATION_TOASTS;

export function extractFirstName(
  displayName: string | null | undefined,
): string {
  if (!displayName || !displayName.trim()) return "Yasmin";
  return displayName.trim().split(" ")[0]!;
}

export function splitTrailingEmoji(str: string): {
  text: string;
  emoji: string;
} {
  const emojiRegex =
    /(\s*(?:[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]+\s*)*)$/u;
  const match = str.match(emojiRegex);
  if (match && match[0].trim()) {
    const emoji = match[0].trimStart();
    const text = str.slice(0, str.length - match[0].length);
    return { text: text.trimEnd(), emoji };
  }
  return { text: str, emoji: "" };
}

export function getGreeting(hour: number): string {
  if (hour >= 5 && hour <= 11) return "Good morning";
  if (hour >= 12 && hour <= 16) return "Good afternoon";
  return "Good evening";
}

export function truncateUserIdentifier(user: {
  displayName?: string | null;
  email?: string | null;
}): string {
  const identifier = user.displayName || user.email || "";
  if (identifier.length <= 30) return identifier;
  return identifier.substring(0, 30) + "…";
}

export function getContextualGreetings(date: Date = new Date()): Array<(name: string) => string> {
  const hour = date.getHours();
  const day = date.getDay();
  const greetings: Array<(name: string) => string> = [];

  if (hour >= 5 && hour <= 11) {
    greetings.push(
      (name) => `Good morning, ${name} ☀️`,
      (name) => `Morning sunshine, ${name} ☕`,
      (name) => `Early morning momentum, ${name} 🌅`,
    );
  } else if (hour >= 12 && hour <= 16) {
    greetings.push(
      (name) => `Good afternoon, ${name} 🌤️`,
      (name) => `Afternoon inspiration, ${name} 💫`,
      (name) => `Midday brilliance, ${name} 🌷`,
    );
  } else {
    greetings.push(
      (name) => `Good evening, ${name} 🌙`,
      (name) => `Evening glow, ${name} ✨`,
      (name) => `Unwinding in style, ${name} 🕯️`,
    );
  }

  switch (day) {
    case 0: // Sunday
      greetings.push(
        (name) => `Happy Sunday, ${name} 🌸`,
        (name) => `Sunday serenity, ${name} 🌿`,
      );
      break;
    case 1: // Monday
      greetings.push(
        (name) => `Happy Monday, ${name}! Fresh week ahead 🚀`,
        (name) => `Monday energy, ${name} 💫`,
      );
      break;
    case 2: // Tuesday
      greetings.push((name) => `Terrific Tuesday, ${name} 🌟`);
      break;
    case 3: // Wednesday
      greetings.push((name) => `Happy Wednesday, ${name}! Halfway through 🌈`);
      break;
    case 4: // Thursday
      greetings.push((name) => `Thriving Thursday, ${name} ✨`);
      break;
    case 5: // Friday
      greetings.push(
        (name) => `Happy Friday, ${name}! Finishing strong 🎉`,
        (name) => `Friday magic, ${name} 🥂`,
      );
      break;
    case 6: // Saturday
      greetings.push(
        (name) => `Happy Saturday, ${name} 🌷`,
        (name) => `Weekend peace, ${name} 🍃`,
      );
      break;
  }

  return greetings;
}

export function pickGreeting(
  displayName: string | null | undefined,
  random = Math.random,
  date = new Date(),
): { greeting: string; subtitle: string; subtitleText: string; subtitleEmoji: string } {
  const firstName = extractFirstName(displayName);
  const contextual = getContextualGreetings(date);
  const templates = [...GREETING_TEMPLATES, ...contextual];
  const template =
    templates[Math.floor(random() * templates.length)]!;
  const greeting = template(firstName);
  const subtitle =
    SUBTITLES[Math.floor(random() * SUBTITLES.length)]!;
  const { text: subtitleText, emoji: subtitleEmoji } =
    splitTrailingEmoji(subtitle);
  return { greeting, subtitle, subtitleText, subtitleEmoji };
}

export function pickAffirmation(random = Math.random): string {
  const index = Math.floor(random() * DAILY_AFFIRMATIONS.length);
  return DAILY_AFFIRMATIONS[index]!;
}

export function getCelebrationToast(
  type: CelebrationToastType,
  random = Math.random,
): string {
  const pool = CELEBRATION_TOASTS[type];
  const index = Math.floor(random() * pool.length);
  return pool[index]!;
}
