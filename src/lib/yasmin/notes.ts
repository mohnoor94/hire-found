export type YasminNoteTag = "Candidates" | "Managers" | "Interviews" | "CVs";
export type YasminNoteAudience = "candidates" | "employers";

export type YasminNote = {
  id: string;
  audience: YasminNoteAudience;
  tag: YasminNoteTag;
  /** Original Arabic quote - must be verbatim; render with dir=rtl, lang=ar. */
  ar: string;
  /** Short faithful English gloss for non-Arabic readers. */
  gloss: string;
  /** Link to the original post, or activity page when no URL exists. */
  url: string;
};

// Source: /uploads/yasmin-linkedin-research_abde.md (Advice themes)
// Do NOT invent quotes. For entries without a specific post URL, link to her activity feed.
const ACTIVITY_URL = "https://www.linkedin.com/in/yasminblasi/recent-activity/all/";

export const YASMIN_NOTES: YasminNote[] = [
  {
    id: "managers-keep-your-talent",
    audience: "employers",
    tag: "Managers",
    ar: "فيا مدير، موظفك الشاطر، دير بالك عليه، وما تطفشه!",
    gloss: "Managers: protect your top performers, do not push them away.",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7501206646296043520/",
  },
  {
    id: "not-every-top-employee-is-a-manager",
    audience: "employers",
    tag: "Managers",
    ar: "موظف ناجح مش معناته مدير ناجح … اذا ما كان جاهز يكون قائد، رح يخربلك الفريق",
    gloss:
      "A great individual contributor is not automatically a great manager; without readiness to lead, they can break the team.",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7499460571541676032/",
  },
  {
    id: "attitude-matters",
    audience: "candidates",
    tag: "Candidates",
    ar: "الدنيا كلها عشان تمشي بدها اسلوب … اسلوبك حلو وال attitude تاعك لطيف ومحترم، قديش حتكسب!",
    gloss: "Your manner and attitude open doors: respectful wins so much.",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7483198061951954944/",
  },
  {
    id: "interview-etiquette",
    audience: "candidates",
    tag: "Interviews",
    ar: "الذوق والرتابة والنظافة ابدا مش مربوطة لا بعمر ولا بمنصب",
    gloss: "Grooming and neatness are not about age or title. Show up well.",
    url: ACTIVITY_URL,
  },
  {
    id: "cv-small-details",
    audience: "candidates",
    tag: "CVs",
    ar: "تفاصيل صغيرة بتزيد من فرصك",
    gloss: "Small details on your CV can raise your chances.",
    url: ACTIVITY_URL,
  },
  {
    id: "boundaries-are-your-responsibility",
    audience: "candidates",
    tag: "Candidates",
    ar: "وقتك، مالك، صحتك النفسية والجسدية، هدول مسؤوليتك",
    gloss: "Your time, money, and mental and physical health are your responsibility.",
    url: ACTIVITY_URL,
  },
  {
    id: "post-original-value",
    audience: "candidates",
    tag: "Candidates",
    ar: "يا بتنشر اشي مفيد، من كلامك وفكرك وبطريقتك، يا تنشرش",
    gloss: "Either share something useful in your own words and style, or do not post.",
    url: ACTIVITY_URL,
  },
];

