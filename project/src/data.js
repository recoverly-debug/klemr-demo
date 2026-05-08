import { C } from "./tokens.js";

export const MERCHANT = { name: "Verdant Botanicals", tier: "Skincare · DTC · $24M revenue" };

export const ACTIVITY_TEMPLATES = [
  { stage: "invoice", text: "A new fedex invoice just landed. I'm starting the audit." },
  { stage: "pickup",  text: "Sealed evidence on #VB-44218 — ups picked it up at the warehouse." },
  { stage: "invoice", text: "I caught a zone mismatch on #VB-44193 — ups billed for a longer route than the package actually took. Filing now." },
  { stage: "transit", text: "Following weather along the route for #VB-44188. Light rain in louisville, but no service guarantee waivers triggered." },
  { stage: "filed",   text: "Ups acknowledged the dispute on #VB-43998. Now waiting for their decision." },
  { stage: "label",   text: "I opened a dossier on #VB-44225 — ups label printed at dock 2." },
  { stage: "paid",    text: "Ups returned $4 on #VB-44210 for a zone-mismatch credit — small win, but every one counts.", amount: 4.18 },
  { stage: "invoice", text: "I matched the invoice line for #VB-44174 to the manifest. The charge is correct — nothing to file." },
  { stage: "pushback",text: "Fedex denied the late-delivery dispute on #VB-44156. I'm refiling with the noaa data — their weather exception doesn't hold up." },
  { stage: "filed",   text: "I batched 11 residential surcharge disputes for tomorrow morning. Easier on the carrier's queue, faster credit." },
  { stage: "paid",    text: "Ups returned $1,232 across 18 shipments on the tuesday dimensional weight pattern.", amount: 1232.45 },
  { stage: "label",   text: "I opened 3 new dossiers this hour — two ups, one fedex. Evidence collection is in flight." },
];

export const LIFECYCLE = [
  { id: 1, key: "label",    short: "Label",    color: C.mint },
  { id: 2, key: "pickup",   short: "Pickup",   color: C.mint },
  { id: 3, key: "transit",  short: "Transit",  color: C.mint },
  { id: 4, key: "invoice",  short: "Invoice",  color: C.red },
  { id: 5, key: "filed",    short: "Filed",    color: C.blue },
  { id: 6, key: "pushback", short: "Pushback", color: C.violet },
  { id: 7, key: "paid",     short: "Paid",     color: C.amber },
];
export const STAGE_BY_KEY = Object.fromEntries(LIFECYCLE.map(s => [s.key, s]));

export const NEEDS_YOU = [
  {
    id: "vb-44087",
    label: "carrier pushback",
    headline: "fedex denied #VB-44087's late-delivery claim",
    briefing: "they said weather exception. i pulled noaa data for that zip on that day — no advisory issued. ready to re-file with the noaa attachment.",
    lean: "i'd re-file. the weather story doesn't hold up.",
    primary: "re-file with noaa data",
    secondary: ["call dispute line", "let it go"],
    dossierId: "vb-44087",
  },
  {
    id: "pat-resi-q",
    label: "judgment call",
    summary: "11 ups commercial-to-residential reclassifications · same warehouse · $1,832 at stake",
    cta: "review",
  },
];

export const QUICK_ACTIONS = [
  { id: "qa-today",   label: "show me what you filed today",      reply: "3 filings today: ups dim challenge on #VB-43998 ($12.47 · live), ups appeal on #VB-44102 ($487.32 · paid), fedex re-file on #VB-44156 ($93.40 · awaiting)." },
  { id: "qa-stuck",   label: "is anything stuck?",                 reply: "two filings flagged for your call. fedex denial on #VB-44087 (weather story), and a batch question on the 11 reclassifications. both are at the top of this thread." },
  { id: "qa-scans",   label: "find shipments missing scans",       reply: "4 shipments without a delivery scan past their guarantee window: #VB-44211, #VB-44219, #VB-44230, #VB-44245. i'm watching them. if no scan by tomorrow am, i'll file." },
  { id: "qa-changed", label: "what changed since yesterday",       reply: "two credits posted ($487 + $214), one new denial (the fedex one above), one new pattern caught (tuesday scale drift, $1,832/mo)." },
  { id: "qa-big",     label: "show me the $1,232 claim",           reply: "fedex appeal on #VB-43509 — overweight surcharge on a 14-lb package they billed as 28 lb. paid oct 14. evidence packet had the warehouse-photo + scale-tape match. clean win." },
];

export const PROMPTS_CARD1 = [
  "show me the noaa data",
  "how did the last weather appeal go?",
  "what did fedex's denial say?",
];
export const PROMPTS_CARD2 = [
  "show me the 11 shipments",
  "what's our recovery rate on these?",
  "is this a new ups policy?",
];
export const PROMPTS_RECAP = [
  "is anything stuck?",
  "what changed since yesterday",
  "show me the $1,232 claim",
];

export const PROMPT_REPLIES = {
  "is anything stuck?":           "two filings flagged for your call. fedex denial on #VB-44087 (weather story), and a batch question on the 11 reclassifications. both are at the top of this thread.",
  "what changed since yesterday": "two credits posted ($487 + $214), one new denial (the fedex one above), one new pattern caught (tuesday scale drift, $1,832/mo).",
  "show me the $1,232 claim":     "fedex appeal on #VB-43509 — overweight surcharge on a 14-lb package they billed as 28 lb. paid oct 14. evidence packet had the warehouse-photo + scale-tape match. clean win.",
  "show me the noaa data":              "pulled the noaa archive for zip 60601 on oct 23. no advisory, no watch, no warning. closest event was 84 miles south. attaching the screenshot to the appeal.",
  "how did the last weather appeal go?": "last 3 weather denials: 2 reversed with noaa data attached, 1 settled at 50%. average turnaround: 11 days. fedex tends to fold when the data is specific.",
  "what did fedex's denial say?":       "their reason code was WX-04 — generic 'weather impact'. no zip cited, no timestamp. that's the weak point. our re-file pins them to noaa for that exact zip and hour.",
  "show me the 11 shipments":           "11 shipments to the same warehouse cluster, oct 24–28. all billed as residential at +$3.95/each. addresses match commercial in the usps DB. listing them in the patterns view.",
  "what's our recovery rate on these?": "we've filed 6 reclassification claims like this in the last 90 days — 5 reversed, 1 partial. avg recovery $167/claim. this batch of 11 is the biggest single set we've seen.",
  "is this a new ups policy?":          "doesn't look like policy — looks like a misclassified address record on ups's side. the fee started oct 24 with no warning. one batch claim should clean it up.",
};
