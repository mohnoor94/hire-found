/**
 * Greeting helpers - from yasmin/js/app.js.
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

export function pickGreeting(
  displayName: string | null | undefined,
  random = Math.random,
): { greeting: string; subtitle: string; subtitleText: string; subtitleEmoji: string } {
  const firstName = extractFirstName(displayName);
  const template =
    GREETING_TEMPLATES[Math.floor(random() * GREETING_TEMPLATES.length)]!;
  const greeting = template(firstName);
  const subtitle =
    SUBTITLES[Math.floor(random() * SUBTITLES.length)]!;
  const { text: subtitleText, emoji: subtitleEmoji } =
    splitTrailingEmoji(subtitle);
  return { greeting, subtitle, subtitleText, subtitleEmoji };
}
