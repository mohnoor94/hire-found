# HireFound Website - Creative Plan

**Client:** Yasmin Blasi, Founder of HireFound

**Status:** Current site is a Squarespace "Coming Soon" placeholder

**Goal:** Demoable prototype ASAP that represents the final shape, then iterate

---

## The Conclusion: "The Yasmin Experience"

After evaluating three distinct concepts against Yasmin's brand, audience, and business reality, here's the verdict.

### Why Not Pure Chat (Concept 1)

The full chat-UI is the most memorable idea, but it has real problems:
- Scrolling through bubbles to find services/pricing gets tedious on repeat visits
- SEO suffers badly with chat-structured content
- Screen readers and accessibility are a nightmare
- Breaks if she ever adds team members
- First visit = "wow!". Third visit = "where's the services page?"

**Verdict:** The energy is right. The execution as a full-page pattern isn't.

### Why Not Pure Matchmaker (Concept 2)

The dating-app metaphor is clever and on-brand, but:
- Corporate clients (the ones paying) may find swipe-to-hire too playful
- Match scores need backend logic or feel fake
- Building real interactive swipe cards is slow for a demo
- The metaphor risks alienating the employer side

**Verdict:** The visual language (cards, warmth, pairing) is gold. Literal swipe UI isn't.

### Why Not Pure Stories (Concept 3)

Instagram Stories as navigation is familiar, but:
- Linear navigation frustrates return visitors who want specific info
- Desktop experience suffers (stories are inherently phone-vertical)
- Can't bookmark or share specific sections
- Updating content means rebuilding stories
- Tap-to-advance isn't standard web - accessibility issues

**Verdict:** The immersive full-screen sections and concise content blocks are great. The navigation model isn't.

### The Winning Hybrid

Take the BEST of each, drop the weaknesses:

| Layer | From | What We Take |
|-------|------|--------------|
| **Opening energy** | Chat | Conversational hero, typed greeting, two-door CTA |
| **Content structure** | Matchmaker | Warm card-based layout, scannable, accessible |
| **Section rhythm** | Stories | Full-viewport sections on mobile, one idea per screen |
| **Personality** | All three | Her voice in every line, emojis where natural, zero corporate tone |

**What this gives us:**
- Chat hero captures attention + converts the Instagram/LinkedIn click-through visitor
- Card body is scannable, accessible, SEO-friendly, scales as business grows
- Full-screen mobile sections feel immersive without trapping users in linear navigation
- Both audiences (employers AND candidates) get what they need
- It's buildable as a demo in one sitting

---

## Target Audiences (Prioritized)

1. **Link-in-bio visitors** (HIGHEST PRIORITY) - people who just saw her on Instagram/LinkedIn, clicked through on their phone, and have 5-10 seconds of attention. They already like her personality. The site needs to convert "interesting" to "I want to work with her."

2. **Employers** (REVENUE) - founders, HR directors, C-suite in MENA. They want credibility, professionalism, and a fast path to "how do I engage you?"

3. **Candidates** (TALENT POOL) - ambitious professionals in Jordan/Iraq/GCC. They want open roles, process clarity, and to feel cared for.

---

## Design System

### Color Palette

| Role | Color | Hex | Why |
|------|-------|-----|-----|
| Background | Warm off-white | `#FFFAF5` | Soft, inviting, not clinical white |
| Primary | Deep rose/burgundy | `#9B2C5E` | Confident, feminine, warm, premium |
| Secondary | Warm gold/amber | `#C8956C` | Approachable luxury, CTA highlights |
| Cards | Clean white | `#FFFFFF` | Contrast against warm background |
| Text | Deep warm charcoal | `#2D2926` | Readable, warmer than pure black |
| Muted | Warm gray | `#8A8380` | Subtitles, secondary info |
| Success | Sage green | `#7A9E7E` | Trust, growth, positive outcomes |

### Typography

- **Headlines:** Inter or Outfit (modern, geometric, warm at heavier weights)
- **Body:** Inter (clean, readable on all screens)
- **Accent:** One script/handwritten font for "Yasmin" signature moments (sparingly)

### Visual Language

- Rounded corners everywhere (16-24px) - nothing sharp or rigid
- Soft warm shadows on cards
- Generous whitespace - let content breathe
- Yasmin's photo prominent (not hidden behind stock)
- Emoji used naturally in copy (matches her IG/LinkedIn voice)
- Micro-animations: chat bubble entrance, card reveals on scroll, subtle hover states
- NO stock photos of handshakes, conference rooms, or people in suits

---

## Page Sections (Single Page)

### 1. Hero - "The Conversation"

Full viewport. Warm gradient background.

Content:
- Chat bubble animation typing in: "Hey! Looking for your next game-changer? Or maybe... you ARE one? 😏"
- Yasmin's photo (circular, warm border)
- Her name + "Founder, HireFound"
- Two CTA buttons: **"I'm Hiring"** | **"I Want to Be Found"**
- Subtle scroll indicator

The two buttons smooth-scroll to the same services section but could later route to personalized paths.

### 2. The Anti-Pitch

"I'm not your usual recruiter."

Three value cards:
- **Matchmaking, Not Seat-Filling** - "I find people who fit your culture, not just your job description."
- **Your Story, Not Just Keywords** - "Every candidate is more than a CV. Every company is more than a job post."
- **From First Call to First Day** - "I don't disappear after the offer letter. I'm here for the whole journey."

### 3. About Yasmin

Personal, warm section. Her story in her voice:
- 10+ years in HR and recruitment
- Worked across MENA (Jordan, Iraq, GCC)
- "I left the corporate HR world because I found my true calling - connecting people with where they belong."
- Key stats in clean badges: 10+ Years | MENA-Wide | Junior to C-Suite

### 4. Services (Cards)

Two groups, subtle tab or visual separation:

**For Employers:**
- Executive Search and Headhunting
- Hiring Strategy Consulting
- Cultural Fit Assessment
- End-to-End Recruitment

**For Candidates:**
- Career Matchmaking
- CV Polishing
- Interview Preparation
- Personalized Career Guidance

### 5. How It Works

Three steps, matchmaker metaphor:
1. **We Talk** - "Tell me everything. The role, the culture, the dream. I listen like it matters - because it does."
2. **We Match** - "I go find your person. Not the most available - the most right."
3. **You Grow** - "The hire sticks. The career takes off. And I'm still just a message away."

### 6. Trust Signals

"As seen in" bar: Leaders of Arabia, Arab Icons, Career Spotlight Jordan.

Testimonial cards (2-3 placeholder for demo, real ones later).

### 7. Let's Talk (Footer CTA)

"Your next game-changer is just a conversation away."

- Primary: WhatsApp button (huge, unmissable on mobile)
- Secondary: Simple name + email + message form
- Social links: LinkedIn, Instagram
- "HireFound - You want a hire? We got you found." tagline

### Floating Element

WhatsApp button - fixed bottom-right on mobile, always accessible. This is her primary conversion channel.

---

## Demo Build Plan (ASAP Path)

### What the demo IS

A single, polished, fully responsive page that looks and feels like the final product. Real copy, real colors, real animations. Someone could look at this on their phone and believe it's the live site.

### What the demo ISN'T

- A wireframe or mockup
- A framework-heavy app
- Connected to any backend
- Bilingual (AR comes later)

### Tech Stack (Demo)

| Choice | Why |
|--------|-----|
| Single `index.html` | Zero build step. Open in browser. Send the file. Done. |
| Tailwind CSS via CDN | Mobile-first utilities, rapid styling, no build |
| Vanilla JS | Chat typing animation, scroll reveals, smooth scroll. No framework needed. |
| Google Fonts CDN | Inter + one accent font |
| CSS animations | Chat bubble entrance, card fade-in on scroll, button hover states |

### Build Sequence

**Phase 1 - The Demo (target: this session)**
1. HTML structure with all 7 sections
2. Tailwind styling, mobile-first
3. Chat bubble typing animation in hero
4. Scroll-reveal animations for cards
5. Floating WhatsApp button
6. Test on mobile viewport

**Phase 2 - Production Ready (next session)**
1. Migrate to Next.js or Astro
2. Add bilingual EN/AR with RTL support
3. Open roles section with real data
4. Contact form with actual submission (Formspree or similar)
5. SEO optimization (meta tags, OG images, structured data)
6. Deploy to Vercel + connect domain (hirefound.com)

**Phase 3 - Growth Features (later)**
1. Blog/tips section (syndicate her LinkedIn/IG content)
2. Application portal for candidates
3. Client dashboard concept
4. Analytics integration

---

## Copy Direction

All copy should sound like Yasmin talking - not a copywriter writing for a recruitment agency. Here are the rules:

- **First person.** "I find people" not "HireFound finds people"
- **Short sentences.** Punchy. Like her Instagram captions.
- **Questions.** She asks before she tells.
- **Emojis.** Sparingly in headers/CTAs. Natural, not forced.
- **No jargon.** "I find the right person" not "we leverage our talent acquisition pipeline"
- **Confident.** "I will find them" not "we can help you try to find them"
- **Warm.** Like a friend who happens to be incredible at her job.

---

## Success Criteria for the Demo

- [ ] Opens on phone and looks like a real site, not a prototype
- [ ] Chat bubble animation plays smoothly and captures attention
- [ ] Two-door CTA is clear and clickable
- [ ] All sections scroll smoothly with reveal animations
- [ ] WhatsApp floating button works
- [ ] Colors, fonts, and spacing feel premium and warm
- [ ] Copy sounds like Yasmin, not a template
- [ ] Total page load under 2 seconds (it's just HTML + CDN)
- [ ] Yasmin could share this link and feel proud

---

## File Structure

```
hirefound-demo/
  index.html          # The entire demo - single file
  assets/
    yasmin.jpg         # Her photo (placeholder for demo)
    og-image.png       # Social share preview
```

That's it for the demo. One file. Maximum impact.
