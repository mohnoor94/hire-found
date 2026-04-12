# HireFound - Cal.com Booking Integration Plan

**Decision:** Popup + Floating button (both using Cal.com embed via iframe)

**Demo reference:** `booking-demo.html` (scratch file, delete after integration)

---

## What Yasmin needs to do first

1. Sign up at cal.com (free tier)
2. Connect her Google Calendar
3. Set availability (e.g. Sun-Thu 10am-5pm, Asia/Amman)
4. Create event types:
   - Discovery Call (15 min) - quick intro for anyone
   - Employer Consultation (30 min) - companies with hiring needs
   - Career Chat (20 min) - candidates feeling stuck
5. Share her Cal.com username so we can plug it in

---

## Integration changes to index.html

### 1. Popup in Contact Section

- Add a "Book a Call" button next to the existing WhatsApp CTA in the `#contact` section
- Button opens a modal overlay containing an iframe to `cal.com/{yasmin-username}`
- Modal has a slim header with Yasmin's photo + name + close button
- Iframe fills the rest of the modal
- Clicking outside the modal closes it

### 2. Floating buttons (bottom-right corner)

Current state: Single WhatsApp circle button, fixed bottom-right.

New state: Two floating buttons stacked vertically, matching style:

```
  [  Book a Call  ]   <-- Cal.com popup trigger (primary color pill)
  [   WhatsApp    ]   <-- Existing WhatsApp link (whatsapp green pill)
```

Changes:
- Wrap both buttons in a flex-col container, `fixed bottom-6 right-6`
- Convert WhatsApp from a plain circle icon to a pill button with text label to match booking button style
- Both get: rounded-full pill shape, icon + text, same sizing, shadow, hover lift
- Booking button: `bg-primary`, calendar icon + "Book a Call"
- WhatsApp button: `bg-whatsapp`, WhatsApp icon + "WhatsApp"
- Booking button opens the same popup modal as the contact section button
- Stack order: booking on top, WhatsApp below (or vice versa - test both)

### 3. No backend code

- Zero JS logic for calendar/timezones/booking - Cal.com handles everything
- We only write: iframe src, modal open/close toggle, button styling
- When Yasmin shares her username, swap the iframe src URL

---

## Files to change

- `index.html` - contact section CTA, floating buttons, modal markup, minimal JS for modal toggle
- `booking-demo.html` - DELETE after integration is complete (scratch file)

---

## Stretch (optional, discuss later)

- Embed specific event type links directly (e.g. `cal.com/yasmin/discovery-call`) instead of the profile page
- Match Cal.com theme colors to HireFound brand via their embed config
- Add booking CTA in the hero section or vacancy cards
