// Morning briefings — turns dossiers into the card content rendered at
// the top of the chat. Each briefing is a ready-to-render card with
// headline, body, lean, label, and the metadata the conversation flow
// needs to route picks back to the underlying dossier(s).
//
// For now, copy is templated per issueType (with shipment IDs and
// counts injected from real dossier data). When we wire the composer
// to Claude, the copy itself will be model-authored from the same
// dossier records.

import { C } from "../tokens.js";
import { getDossiersAwaitingYourCall, SHIPMENT_BY_ID } from "./db/index.js";

const carrierWord = (c) => c === "fedex" ? "fedex" : c === "ups" ? "ups" : c === "usps" ? "usps" : c;

// Single-dossier templates — keyed by dispute.issueType.
const SINGLE_TEMPLATES = {
  "weather-denial": (d) => {
    const ship = SHIPMENT_BY_ID[d.shipmentId];
    const carrier = carrierWord(ship.carrier);
    return {
      id: `briefing-${d.id}`,
      refKey: "card1",
      label: "carrier pushback",
      headlineHtml: `${carrier} denied <em style="font-style:italic;font-weight:500">#${d.id}</em>'s late-delivery claim`,
      bodyHtml: `they said weather exception. i pulled noaa data for that zip on that day — no advisory issued. ready to re-file with the noaa attachment.`,
      lean: `i'd re-file. the weather story doesn't hold up.`,
      contextLabel: `#${d.id}`,
      chipKind: "card1",
      sourceDossierIds: [d.id],
    };
  },
};

// Batched-dossier templates — keyed by dispute.batchKey prefix.
const BATCH_TEMPLATES = {
  "ups-resi-aw": (batch) => {
    const ship = SHIPMENT_BY_ID[batch[0].shipmentId];
    const carrier = carrierWord(ship.carrier);
    return {
      id: `briefing-batch-${batch[0].dispute.batchKey}`,
      refKey: "card2",
      label: "judgment call",
      headlineHtml: `${batch.length} ${carrier} commercial addresses got the residential fee`,
      bodyHtml: `same warehouse, same accounts, last 4 days. i can file all ${batch.length} as one batch claim, or wait a week to see if the pattern grows. <span style="color:${C.amber}">$1,832</span> at stake.`,
      lean: `lean toward filing — the pattern's already clear.`,
      contextLabel: `the ${batch.length} ${carrier} reclassifications`,
      chipKind: "card2",
      sourceDossierIds: batch.map(d => d.id),
    };
  },
};

// Build the morning's briefings from dossiers awaiting your call.
// Single dossiers each become one briefing; dossiers sharing a
// batchKey collapse into one briefing card.
export function buildMorningBriefings() {
  const awaiting = getDossiersAwaitingYourCall();

  // Group: collect batchKey-grouped dossiers, leave singles alone.
  const groups = [];
  const seen = new Set();
  for (const d of awaiting) {
    if (seen.has(d.id)) continue;
    const batchKey = d.dispute && d.dispute.batchKey;
    if (batchKey) {
      const batch = awaiting.filter(x => x.dispute && x.dispute.batchKey === batchKey);
      batch.forEach(x => seen.add(x.id));
      groups.push({ kind: "batch", batchKey, items: batch });
    } else {
      seen.add(d.id);
      groups.push({ kind: "single", items: [d] });
    }
  }

  // Order: singles first (the "bigger one" framing), batches after.
  groups.sort((a, b) => {
    if (a.kind === "single" && b.kind === "batch") return -1;
    if (a.kind === "batch" && b.kind === "single") return 1;
    return 0;
  });

  // Map each group through its template.
  return groups
    .map(g => {
      if (g.kind === "single") {
        const tpl = SINGLE_TEMPLATES[g.items[0].dispute.issueType];
        return tpl ? tpl(g.items[0]) : null;
      } else {
        const prefix = g.batchKey.split("-").slice(0, 3).join("-"); // "ups-resi-aw-w43" → "ups-resi-aw"
        const tpl = BATCH_TEMPLATES[prefix];
        return tpl ? tpl(g.items) : null;
      }
    })
    .filter(Boolean);
}
