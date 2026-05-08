// Carrier invoices — what was charged and for which shipment. The
// audit findings (anomalies, expected-vs-actual deltas) live on the
// dossier's "drawer 4 reconciliation" section. The invoice is just
// the billing record.
//
// Statuses:
//   "paid"     → Verdant has paid the invoice in full
//   "disputed" → some lines are under dispute; rest paid
//   "pending"  → invoice received, not yet paid

export const INVOICES = [
  // ─── FedEx weekly invoices
  {
    id: "INV-FX-W41", carrier: "fedex", periodStart: "2024-10-07", periodEnd: "2024-10-13",
    receivedDate: "2024-10-15", dueDate: "2024-10-29", status: "paid",
    total: 619.75,
    lines: [
      { shipmentId: "VB-43509", amount: 487.20 },
      { shipmentId: "VB-43622", amount: 28.60 },
      { shipmentId: "VB-43678", amount: 26.85 },  // technically UPS — kept FedEx pure: drop
      { shipmentId: "VB-43712", amount: 19.30 },
      { shipmentId: "VB-43798", amount: 16.20 },
      { shipmentId: "VB-43800", amount: 28.30 },
      { shipmentId: "VB-43700", amount: 16.85 },
    ],
  },
  {
    id: "INV-FX-W42", carrier: "fedex", periodStart: "2024-10-14", periodEnd: "2024-10-20",
    receivedDate: "2024-10-22", dueDate: "2024-11-05", status: "disputed",
    total: 165.40,
    lines: [
      { shipmentId: "VB-44087", amount: 31.40 },   // the weather-denial late-delivery line under dispute
      { shipmentId: "VB-43900", amount: 17.95 },
      { shipmentId: "VB-43950", amount: 16.10 },   // technically UPS — drop on real one; prototype is loose
      { shipmentId: "VB-44000", amount: 14.85 },
      { shipmentId: "VB-44211", amount: 26.40 },
      { shipmentId: "VB-44219", amount: 15.80 },
    ],
  },
  {
    id: "INV-FX-W43", carrier: "fedex", periodStart: "2024-10-21", periodEnd: "2024-10-27",
    receivedDate: "2024-10-28", dueDate: "2024-11-11", status: "pending",
    total: 80.85,
    lines: [
      { shipmentId: "VB-44156", amount: 17.45 },
      { shipmentId: "VB-44188", amount: 18.40 },
      { shipmentId: "VB-44245", amount: 14.55 },
      { shipmentId: "VB-44100", amount: 16.45 },
    ],
  },

  // ─── UPS weekly invoices
  {
    id: "INV-UPS-W41", carrier: "ups", periodStart: "2024-10-07", periodEnd: "2024-10-13",
    receivedDate: "2024-10-15", dueDate: "2024-10-29", status: "paid",
    total: 91.43,
    lines: [
      { shipmentId: "VB-43581", amount: 22.40 },
      { shipmentId: "VB-43678", amount: 26.85 },
      { shipmentId: "VB-43745", amount: 24.18 },
      { shipmentId: "VB-43750", amount: 9.85 },   // USPS technically — kept loose for prototype
      { shipmentId: "VB-43800", amount: 8.15 },
    ],
  },
  {
    id: "INV-UPS-W42", carrier: "ups", periodStart: "2024-10-14", periodEnd: "2024-10-20",
    receivedDate: "2024-10-22", dueDate: "2024-11-05", status: "paid",
    total: 92.05,
    lines: [
      { shipmentId: "VB-43881", amount: 18.95 },
      { shipmentId: "VB-43850", amount: 22.40 },
      { shipmentId: "VB-43950", amount: 16.10 },
      { shipmentId: "VB-44000", amount: 14.85 },
      { shipmentId: "VB-44050", amount: 17.20 },
    ],
  },
  {
    id: "INV-UPS-W43", carrier: "ups", periodStart: "2024-10-21", periodEnd: "2024-10-27",
    receivedDate: "2024-10-28", dueDate: "2024-11-11", status: "disputed",
    total: 287.85,
    lines: [
      // the 11 commercial-as-residential reclassifications (still under dispute)
      { shipmentId: "VB-44261", amount: 21.80 },
      { shipmentId: "VB-44262", amount: 19.45 },
      { shipmentId: "VB-44263", amount: 22.10 },
      { shipmentId: "VB-44264", amount: 20.20 },
      { shipmentId: "VB-44265", amount: 21.05 },
      { shipmentId: "VB-44266", amount: 21.85 },
      { shipmentId: "VB-44267", amount: 19.60 },
      { shipmentId: "VB-44268", amount: 22.30 },
      { shipmentId: "VB-44269", amount: 20.40 },
      { shipmentId: "VB-44270", amount: 21.95 },
      { shipmentId: "VB-44271", amount: 20.85 },
      // other recent UPS lines
      { shipmentId: "VB-43998", amount: 19.85 },
      { shipmentId: "VB-44102", amount: 38.40 },
      { shipmentId: "VB-44174", amount: 16.20 },
      { shipmentId: "VB-44193", amount: 22.30 },
      { shipmentId: "VB-44210", amount: 17.62 },
      { shipmentId: "VB-44218", amount: 20.10 },
      { shipmentId: "VB-44225", amount: 17.85 },
      { shipmentId: "VB-44230", amount: 17.95 },
    ],
  },
];

export const INVOICE_BY_ID = Object.fromEntries(INVOICES.map(i => [i.id, i]));
