// Dossiers — the evidence file cabinet for each shipment. One drawer
// per lifecycle stage. Drawers 1-4 are filled for every shipment;
// drawers 5-7 only exist if there's a dispute.
//
// Drawer shape:
//   labelCapture    → what we saw at label print (weight, dims, photos)
//   pickupSeal      → tamper-proof record of carrier first scan
//   transitLog      → carrier scans + weather snapshots along the route
//   reconciliation  → invoice line vs expected; anomalies if any
//   dispute         → issue type, amount at stake, klemr's lean, status
//   pushback        → denials received + counters klemr prepared
//   resolution      → credit received, short-pay delta, klemr fee
//
// Dispute statuses:
//   "gathering"          → klemr collecting evidence, not yet filed
//   "filed"              → submitted to carrier, awaiting first response
//   "awaiting-response"  → carrier acknowledged, working their queue
//   "awaiting-your-call" → klemr needs you to decide before next move
//   "in-pushback"        → carrier denied; klemr has counter ready
//   "won"                → full recovery
//   "partial"            → partial recovery
//   "lost"               → final denial, closed

import { ORIGIN } from "./customers.js";

// Helper for clean dossiers (no dispute). Just drawers 1-4 filled.
const clean = ({ id, shipDate, weightOz, dims, service, paid, deliveredDate, invoiceId, invoiceLineAmount }) => ({
  id, shipmentId: id,
  labelCapture: {
    timestamp: `${shipDate}T08:14:00Z`,
    declaredWeightOz: weightOz,
    declaredDims: dims,
    serviceLabel: service,
    paid,
    photoCount: 3, // package on scale + 2 item photos
  },
  pickupSeal: {
    timestamp: `${shipDate}T15:30:00Z`,
    firstScan: { weight: weightOz, service, recordedDims: dims },
    mismatches: [],
  },
  transitLog: {
    scans: deliveredDate ? [
      { timestamp: `${shipDate}T15:30:00Z`,    location: ORIGIN.city,         status: "picked up" },
      { timestamp: `${deliveredDate}T11:00:00Z`, location: "destination zone", status: "delivered" },
    ] : [
      { timestamp: `${shipDate}T15:30:00Z`, location: ORIGIN.city, status: "picked up" },
    ],
    weatherSnapshots: [],
  },
  reconciliation: invoiceId ? {
    invoiceId,
    invoiceLineAmount,
    expectedAmount: invoiceLineAmount,
    anomalies: [],
  } : null,
  dispute: null,
  pushback: null,
  resolution: null,
});

export const DOSSIERS = [
  // ─── SEALED dossiers (14). Full lifecycle 1-7.

  // VB-43412 — UPS dim-weight overcharge. Won $156.
  {
    id: "VB-43412", shipmentId: "VB-43412",
    labelCapture: { timestamp: "2024-09-28T08:30:00Z", declaredWeightOz: 12, declaredDims: "10x6x4", serviceLabel: "FedEx Ground", paid: 14.32, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-09-28T15:30:00Z", firstScan: { weight: 12, service: "Ground", recordedDims: "12x8x6" }, mismatches: ["dim mismatch — recorded 12x8x6 vs declared 10x6x4"] },
    transitLog:   { scans: [
      { timestamp: "2024-09-28T15:30:00Z", location: "Portland OR",  status: "picked up" },
      { timestamp: "2024-10-02T11:14:00Z", location: "Brooklyn NY",  status: "delivered" },
    ], weatherSnapshots: [] },
    reconciliation: { invoiceId: "INV-FX-W40", invoiceLineAmount: 18.40, expectedAmount: 14.32, anomalies: [{ type: "dim-weight", amount: 4.08, note: "carrier billed dim 12x8x6 vs declared 10x6x4" }] },
    dispute: { issueType: "dim-weight", filedDate: "2024-10-04", amountAtStake: 156, evidenceDrawers: [1,2,4], klemrLean: "file — declared dims match scale photo", status: "won" },
    pushback: null,
    resolution: { creditAmount: 156.00, closedDate: "2024-10-15", matchesClaim: true, shortPayDelta: 0, klemrFee: 31.20 },
  },

  // VB-43445 — UPS late delivery. Won $87.
  {
    id: "VB-43445", shipmentId: "VB-43445",
    labelCapture: { timestamp: "2024-09-30T08:14:00Z", declaredWeightOz: 14, declaredDims: "10x8x4", serviceLabel: "UPS Ground", paid: 11.87, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-09-30T15:42:00Z", firstScan: { weight: 14, service: "Ground", recordedDims: "10x8x4" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-09-30T15:42:00Z", location: "Portland OR",  status: "picked up" },
      { timestamp: "2024-10-04T09:00:00Z", location: "Austin TX",    status: "out for delivery (late)" },
      { timestamp: "2024-10-06T14:20:00Z", location: "Austin TX",    status: "delivered" },
    ], weatherSnapshots: [{ timestamp: "2024-10-04T12:00:00Z", location: "Austin TX 78704", source: "NOAA", conditions: "clear; 78°F; no advisories" }] },
    reconciliation: { invoiceId: "INV-UPS-W40", invoiceLineAmount: 16.85, expectedAmount: 16.85, anomalies: [] },
    dispute: { issueType: "late-delivery", filedDate: "2024-10-08", amountAtStake: 87, evidenceDrawers: [3], klemrLean: "file — service guarantee triggered, no weather cover", status: "won" },
    pushback: null,
    resolution: { creditAmount: 87.00, closedDate: "2024-10-17", matchesClaim: true, shortPayDelta: 0, klemrFee: 17.40 },
  },

  // VB-43476 — FedEx zone mismatch. Partial $42 of $89.
  {
    id: "VB-43476", shipmentId: "VB-43476",
    labelCapture: { timestamp: "2024-10-01T08:14:00Z", declaredWeightOz: 4, declaredDims: "8x4x3", serviceLabel: "FedEx Express Saver", paid: 24.50, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-01T15:30:00Z", firstScan: { weight: 4, service: "Express Saver", recordedDims: "8x4x3" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-10-01T15:30:00Z", location: "Portland OR",  status: "picked up" },
      { timestamp: "2024-10-04T10:50:00Z", location: "Seattle WA",   status: "delivered" },
    ], weatherSnapshots: [] },
    reconciliation: { invoiceId: "INV-FX-W40", invoiceLineAmount: 32.10, expectedAmount: 24.50, anomalies: [{ type: "zone-mismatch", amount: 7.60, note: "billed zone 5; correct zone is 3 (97214→98101)" }] },
    dispute: { issueType: "zone-mismatch", filedDate: "2024-10-08", amountAtStake: 89, evidenceDrawers: [1,4], klemrLean: "file — usps zone tables back us up", status: "partial" },
    pushback: { denials: [{ timestamp: "2024-10-13T09:00:00Z", reasonCode: "ZN-99", carrierNote: "Zone correctly applied per our internal lookup" }], counters: [{ against: "ZN-99", counter: "USPS zone calculator output for the OD pair shows zone 3" }], refilings: [{ timestamp: "2024-10-15T10:00:00Z", added: "USPS zone screenshot" }] },
    resolution: { creditAmount: 42.00, closedDate: "2024-10-19", matchesClaim: false, shortPayDelta: 47, klemrFee: 8.40 },
  },

  // VB-43509 — FedEx overweight surcharge. Won $1,232. The "biggest claim this month".
  {
    id: "VB-43509", shipmentId: "VB-43509",
    labelCapture: { timestamp: "2024-10-04T07:50:00Z", declaredWeightOz: 224, declaredDims: "22x18x12", serviceLabel: "FedEx Home Delivery", paid: 487.20, photoCount: 5 },
    pickupSeal:   { timestamp: "2024-10-04T15:30:00Z", firstScan: { weight: 448, service: "Home Delivery", recordedDims: "22x18x12" }, mismatches: ["weight mismatch — recorded 28lb vs declared 14lb"] },
    transitLog:   { scans: [
      { timestamp: "2024-10-04T15:30:00Z", location: "Portland OR", status: "picked up" },
      { timestamp: "2024-10-09T13:42:00Z", location: "Denver CO",   status: "delivered" },
    ], weatherSnapshots: [] },
    reconciliation: { invoiceId: "INV-FX-W41", invoiceLineAmount: 487.20, expectedAmount: 243.60, anomalies: [{ type: "overweight", amount: 243.60, note: "billed at 28lb; warehouse scale photo + scale tape confirm 14lb" }] },
    dispute: { issueType: "overweight", filedDate: "2024-10-07", amountAtStake: 1232, evidenceDrawers: [1,2,4], klemrLean: "file — warehouse photo + scale tape match", status: "won" },
    pushback: null,
    resolution: { creditAmount: 1232.00, closedDate: "2024-10-14", matchesClaim: true, shortPayDelta: 0, klemrFee: 246.40 },
  },

  // VB-43544 — FedEx residential surcharge. Auto-corrected. Won $19.
  {
    id: "VB-43544", shipmentId: "VB-43544",
    labelCapture: { timestamp: "2024-10-05T08:14:00Z", declaredWeightOz: 8, declaredDims: "8x6x4", serviceLabel: "FedEx Ground", paid: 11.00, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-05T15:30:00Z", firstScan: { weight: 8, service: "Ground", recordedDims: "8x6x4" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-10-05T15:30:00Z", location: "Portland OR", status: "picked up" },
      { timestamp: "2024-10-09T10:20:00Z", location: "Boston MA",   status: "delivered" },
    ], weatherSnapshots: [] },
    reconciliation: { invoiceId: "INV-FX-W40", invoiceLineAmount: 14.95, expectedAmount: 11.00, anomalies: [{ type: "residential-surcharge", amount: 3.95, note: "destination 02108 is residential — surcharge correct on this one, but applied at wrong rate" }] },
    dispute: { issueType: "residential-rate", filedDate: "2024-10-07", amountAtStake: 19, evidenceDrawers: [4], klemrLean: "file — rate sheet mismatch, easy fix", status: "won" },
    pushback: null,
    resolution: { creditAmount: 19.00, closedDate: "2024-10-09", matchesClaim: true, shortPayDelta: 0, klemrFee: 3.80 },
  },

  // VB-43581 — UPS lost package. Won $214.
  {
    id: "VB-43581", shipmentId: "VB-43581",
    labelCapture: { timestamp: "2024-10-07T08:14:00Z", declaredWeightOz: 18, declaredDims: "10x8x6", serviceLabel: "UPS Ground", paid: 22.40, photoCount: 4 },
    pickupSeal:   { timestamp: "2024-10-07T15:30:00Z", firstScan: { weight: 18, service: "Ground", recordedDims: "10x8x6" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-10-07T15:30:00Z", location: "Portland OR",  status: "picked up" },
      { timestamp: "2024-10-09T03:00:00Z", location: "Louisville KY hub", status: "in transit" },
      { timestamp: "2024-10-11T08:00:00Z", location: "Atlanta GA",   status: "carrier acknowledged lost" },
    ], weatherSnapshots: [] },
    reconciliation: { invoiceId: "INV-UPS-W41", invoiceLineAmount: 22.40, expectedAmount: 22.40, anomalies: [] },
    dispute: { issueType: "lost", filedDate: "2024-10-11", amountAtStake: 214, evidenceDrawers: [1,3], klemrLean: "file claim — declared value $98 + shipping refund", status: "won" },
    pushback: null,
    resolution: { creditAmount: 214.00, closedDate: "2024-10-22", matchesClaim: true, shortPayDelta: 0, klemrFee: 42.80 },
  },

  // VB-43622 — FedEx late delivery. Lost (final denial).
  {
    id: "VB-43622", shipmentId: "VB-43622",
    labelCapture: { timestamp: "2024-10-08T08:14:00Z", declaredWeightOz: 6, declaredDims: "8x4x3", serviceLabel: "FedEx Express Saver", paid: 28.60, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-08T15:30:00Z", firstScan: { weight: 6, service: "Express Saver", recordedDims: "8x4x3" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-10-08T15:30:00Z", location: "Portland OR",  status: "picked up" },
      { timestamp: "2024-10-10T10:00:00Z", location: "Portland OR",  status: "delayed — local sort failure" },
      { timestamp: "2024-10-13T11:30:00Z", location: "Portland OR",  status: "delivered" },
    ], weatherSnapshots: [{ timestamp: "2024-10-10T12:00:00Z", location: "Portland OR 97214", source: "NOAA", conditions: "clear; 64°F" }] },
    reconciliation: { invoiceId: "INV-FX-W41", invoiceLineAmount: 28.60, expectedAmount: 28.60, anomalies: [] },
    dispute: { issueType: "late-delivery", filedDate: "2024-10-13", amountAtStake: 28.60, evidenceDrawers: [3], klemrLean: "file — service guarantee triggered", status: "lost" },
    pushback: { denials: [
      { timestamp: "2024-10-15T09:00:00Z", reasonCode: "OPS-12", carrierNote: "Operational delay covered by service exception clause" },
      { timestamp: "2024-10-19T11:00:00Z", reasonCode: "OPS-12-FINAL", carrierNote: "Final denial; clause applies to local hub failures" },
    ], counters: [{ against: "OPS-12", counter: "Local hub failure is not enumerated in carrier's published exception list" }], refilings: [{ timestamp: "2024-10-17T10:00:00Z", added: "Carrier exception list excerpt" }] },
    resolution: { creditAmount: 0, closedDate: "2024-10-19", matchesClaim: false, shortPayDelta: 28.60, klemrFee: 0 },
  },

  // VB-43678 — UPS dim weight. Won $93.
  {
    id: "VB-43678", shipmentId: "VB-43678",
    labelCapture: { timestamp: "2024-10-10T08:14:00Z", declaredWeightOz: 22, declaredDims: "12x8x6", serviceLabel: "UPS Ground", paid: 18.50, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-10T15:30:00Z", firstScan: { weight: 22, service: "Ground", recordedDims: "14x10x8" }, mismatches: ["dim mismatch — recorded 14x10x8 vs declared 12x8x6"] },
    transitLog:   { scans: [
      { timestamp: "2024-10-10T15:30:00Z", location: "Portland OR", status: "picked up" },
      { timestamp: "2024-10-15T13:00:00Z", location: "Miami FL",    status: "delivered" },
    ], weatherSnapshots: [] },
    reconciliation: { invoiceId: "INV-UPS-W41", invoiceLineAmount: 26.85, expectedAmount: 18.50, anomalies: [{ type: "dim-weight", amount: 8.35, note: "carrier billed dim 14x10x8 vs declared 12x8x6" }] },
    dispute: { issueType: "dim-weight", filedDate: "2024-10-15", amountAtStake: 93, evidenceDrawers: [1,2,4], klemrLean: "file — scale photo backs declared dims", status: "won" },
    pushback: null,
    resolution: { creditAmount: 93.00, closedDate: "2024-10-23", matchesClaim: true, shortPayDelta: 0, klemrFee: 18.60 },
  },

  // VB-43712 — FedEx duplicate charge. Won $164.
  {
    id: "VB-43712", shipmentId: "VB-43712",
    labelCapture: { timestamp: "2024-10-11T08:14:00Z", declaredWeightOz: 16, declaredDims: "10x8x6", serviceLabel: "FedEx Ground", paid: 19.30, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-11T15:30:00Z", firstScan: { weight: 16, service: "Ground", recordedDims: "10x8x6" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-10-11T15:30:00Z", location: "Portland OR", status: "picked up" },
      { timestamp: "2024-10-15T12:00:00Z", location: "Chicago IL",  status: "delivered" },
    ], weatherSnapshots: [] },
    reconciliation: { invoiceId: "INV-FX-W41", invoiceLineAmount: 19.30, expectedAmount: 19.30, anomalies: [{ type: "duplicate-charge", amount: 19.30, note: "shipment also billed on INV-FX-W42 in error" }] },
    dispute: { issueType: "duplicate-charge", filedDate: "2024-10-22", amountAtStake: 164, evidenceDrawers: [4], klemrLean: "file — same shipment billed twice", status: "won" },
    pushback: null,
    resolution: { creditAmount: 164.00, closedDate: "2024-10-26", matchesClaim: true, shortPayDelta: 0, klemrFee: 32.80 },
  },

  // VB-43745 — UPS zone mismatch. Won $38.
  {
    id: "VB-43745", shipmentId: "VB-43745",
    labelCapture: { timestamp: "2024-10-12T08:14:00Z", declaredWeightOz: 12, declaredDims: "10x6x4", serviceLabel: "UPS 3 Day Select", paid: 22.00, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-12T15:30:00Z", firstScan: { weight: 12, service: "3 Day Select", recordedDims: "10x6x4" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-10-12T15:30:00Z", location: "Portland OR", status: "picked up" },
      { timestamp: "2024-10-16T10:00:00Z", location: "Phoenix AZ",  status: "delivered" },
    ], weatherSnapshots: [] },
    reconciliation: { invoiceId: "INV-UPS-W41", invoiceLineAmount: 24.18, expectedAmount: 22.00, anomalies: [{ type: "zone-mismatch", amount: 2.18, note: "97214→85001 is zone 5; billed zone 6" }] },
    dispute: { issueType: "zone-mismatch", filedDate: "2024-10-17", amountAtStake: 38, evidenceDrawers: [4], klemrLean: "file", status: "won" },
    pushback: null,
    resolution: { creditAmount: 38.00, closedDate: "2024-10-21", matchesClaim: true, shortPayDelta: 0, klemrFee: 7.60 },
  },

  // VB-43798 — FedEx weather denial then reversed. Won $122.
  {
    id: "VB-43798", shipmentId: "VB-43798",
    labelCapture: { timestamp: "2024-10-14T08:14:00Z", declaredWeightOz: 10, declaredDims: "8x6x4", serviceLabel: "FedEx Home Delivery", paid: 16.20, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-14T15:30:00Z", firstScan: { weight: 10, service: "Home Delivery", recordedDims: "8x6x4" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-10-14T15:30:00Z", location: "Portland OR",  status: "picked up" },
      { timestamp: "2024-10-17T08:00:00Z", location: "Nashville TN", status: "delayed — weather exception" },
      { timestamp: "2024-10-19T13:30:00Z", location: "Nashville TN", status: "delivered" },
    ], weatherSnapshots: [{ timestamp: "2024-10-17T08:00:00Z", location: "Nashville TN 37201", source: "NOAA", conditions: "clear; 71°F; no advisory" }] },
    reconciliation: { invoiceId: "INV-FX-W42", invoiceLineAmount: 16.20, expectedAmount: 16.20, anomalies: [] },
    dispute: { issueType: "weather-denial", filedDate: "2024-10-19", amountAtStake: 122, evidenceDrawers: [3], klemrLean: "re-file with NOAA — same weather story they tried before", status: "won" },
    pushback: { denials: [{ timestamp: "2024-10-20T11:00:00Z", reasonCode: "WX-04", carrierNote: "Weather impact — generic" }], counters: [{ against: "WX-04", counter: "NOAA archive shows clear conditions for that zip and timestamp" }], refilings: [{ timestamp: "2024-10-21T09:00:00Z", added: "NOAA screenshot" }] },
    resolution: { creditAmount: 122.00, closedDate: "2024-10-25", matchesClaim: true, shortPayDelta: 0, klemrFee: 24.40 },
  },

  // VB-43881 — UPS residential + zone bundle. Won $214 (paid yesterday).
  {
    id: "VB-43881", shipmentId: "VB-43881",
    labelCapture: { timestamp: "2024-10-17T08:14:00Z", declaredWeightOz: 8, declaredDims: "8x6x4", serviceLabel: "UPS Ground", paid: 16.00, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-17T15:30:00Z", firstScan: { weight: 8, service: "Ground", recordedDims: "8x6x4" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-10-17T15:30:00Z", location: "Portland OR",   status: "picked up" },
      { timestamp: "2024-10-22T13:30:00Z", location: "Minneapolis MN",status: "delivered" },
    ], weatherSnapshots: [] },
    reconciliation: { invoiceId: "INV-UPS-W42", invoiceLineAmount: 18.95, expectedAmount: 16.00, anomalies: [{ type: "residential-misclass", amount: 2.95, note: "billed residential; address indeed residential — surcharge correct, but billed at commercial rate then re-applied" }] },
    dispute: { issueType: "rate-bundle", filedDate: "2024-10-23", amountAtStake: 214, evidenceDrawers: [4], klemrLean: "file — duplicated surcharge across 12 shipments this week", status: "won" },
    pushback: null,
    resolution: { creditAmount: 214.00, closedDate: "2024-10-27", matchesClaim: true, shortPayDelta: 0, klemrFee: 42.80 },
  },

  // VB-44102 — UPS appeal won today 11:47a. $487.32.
  {
    id: "VB-44102", shipmentId: "VB-44102",
    labelCapture: { timestamp: "2024-10-22T08:14:00Z", declaredWeightOz: 14, declaredDims: "10x8x4", serviceLabel: "UPS 2nd Day Air", paid: 32.00, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-22T15:30:00Z", firstScan: { weight: 14, service: "2nd Day Air", recordedDims: "10x8x4" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-10-22T15:30:00Z", location: "Portland OR", status: "picked up" },
      { timestamp: "2024-10-24T11:00:00Z", location: "Dallas TX",   status: "delivered" },
    ], weatherSnapshots: [] },
    reconciliation: { invoiceId: "INV-UPS-W43", invoiceLineAmount: 38.40, expectedAmount: 32.00, anomalies: [{ type: "service-mismatch", amount: 6.40, note: "billed as Next Day Air rate; service was 2nd Day Air" }] },
    dispute: { issueType: "service-mismatch", filedDate: "2024-10-25", amountAtStake: 487.32, evidenceDrawers: [1,4], klemrLean: "appeal — pattern across 18 shipments this quarter", status: "won" },
    pushback: { denials: [{ timestamp: "2024-10-26T10:00:00Z", reasonCode: "SVC-LOOKUP", carrierNote: "Service correctly applied per our system" }], counters: [{ against: "SVC-LOOKUP", counter: "label scan reads 2nd Day Air; carrier system mismapped" }], refilings: [{ timestamp: "2024-10-27T09:00:00Z", added: "label scan + service code crosswalk" }] },
    resolution: { creditAmount: 487.32, closedDate: "2024-10-28", matchesClaim: true, shortPayDelta: 0, klemrFee: 97.46 },
  },

  // VB-44210 — UPS small zone-mismatch credit just paid. $4.18.
  {
    id: "VB-44210", shipmentId: "VB-44210",
    labelCapture: { timestamp: "2024-10-25T08:14:00Z", declaredWeightOz: 9, declaredDims: "8x6x4", serviceLabel: "UPS Ground", paid: 13.44, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-25T15:30:00Z", firstScan: { weight: 9, service: "Ground", recordedDims: "8x6x4" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-10-25T15:30:00Z", location: "Portland OR",  status: "picked up" },
      { timestamp: "2024-10-28T10:30:00Z", location: "Los Angeles CA", status: "delivered" },
    ], weatherSnapshots: [] },
    reconciliation: { invoiceId: "INV-UPS-W43", invoiceLineAmount: 17.62, expectedAmount: 13.44, anomalies: [{ type: "zone-mismatch", amount: 4.18, note: "97214→90001 is zone 5; billed zone 6" }] },
    dispute: { issueType: "zone-mismatch", filedDate: "2024-10-27", amountAtStake: 4.18, evidenceDrawers: [4], klemrLean: "auto-file — carrier processed in 24h", status: "won" },
    pushback: null,
    resolution: { creditAmount: 4.18, closedDate: "2024-10-28", matchesClaim: true, shortPayDelta: 0, klemrFee: 0.84 },
  },

  // ─── AWAITING-YOUR-CALL (12). The morning's pile.

  // VB-44087 — FedEx weather denial. CARD 1 of the morning briefing.
  {
    id: "VB-44087", shipmentId: "VB-44087",
    labelCapture: { timestamp: "2024-10-18T08:14:00Z", declaredWeightOz: 12, declaredDims: "10x6x4", serviceLabel: "FedEx Express Saver", paid: 31.40, photoCount: 4 },
    pickupSeal:   { timestamp: "2024-10-18T15:42:00Z", firstScan: { weight: 12, service: "Express Saver", recordedDims: "10x6x4" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-10-18T15:42:00Z", location: "Portland OR",  status: "picked up" },
      { timestamp: "2024-10-19T03:10:00Z", location: "Memphis TN hub", status: "in transit" },
      { timestamp: "2024-10-22T08:30:00Z", location: "Chicago IL",   status: "out for delivery" },
      { timestamp: "2024-10-22T16:45:00Z", location: "Chicago IL",   status: "delivery exception · weather" },
      { timestamp: "2024-10-24T10:12:00Z", location: "Chicago IL",   status: "delivered" },
    ], weatherSnapshots: [{ timestamp: "2024-10-22T16:45:00Z", location: "Chicago IL 60601", source: "NOAA", conditions: "clear; 58°F; no advisories; closest event 84mi south" }] },
    reconciliation: { invoiceId: "INV-FX-W42", invoiceLineAmount: 31.40, expectedAmount: 31.40, anomalies: [] },
    dispute: { issueType: "weather-denial", filedDate: "2024-10-23", amountAtStake: 31.40, evidenceDrawers: [3], klemrLean: "re-file with NOAA — the weather story doesn't hold up", status: "awaiting-your-call" },
    pushback: { denials: [{ timestamp: "2024-10-24T09:00:00Z", reasonCode: "WX-04", carrierNote: "Weather impact — generic; no zip cited" }], counters: [{ against: "WX-04", counter: "NOAA archive for zip 60601 on 2024-10-22 16:00 shows clear; no advisory; closest event 84mi south" }], refilings: [] },
    resolution: null,
  },

  // 11 UPS commercial-as-residential reclassifications. CARD 2 of the morning.
  // All to Apothecary West warehouses, last 4 days.
  ...["VB-44261","VB-44262","VB-44263","VB-44264","VB-44265","VB-44266","VB-44267","VB-44268","VB-44269","VB-44270","VB-44271"].map((sid, i) => {
    const dates = ["2024-10-24","2024-10-24","2024-10-25","2024-10-25","2024-10-26","2024-10-26","2024-10-27","2024-10-27","2024-10-27","2024-10-28","2024-10-28"];
    const zips  = ["45202","45203","45215","45236","45237","45239","45241","45249","45252","45254","45255"];
    const billed = [21.80,19.45,22.10,20.20,21.05,21.85,19.60,22.30,20.40,21.95,20.85];
    return {
      id: sid, shipmentId: sid,
      labelCapture: { timestamp: `${dates[i]}T08:14:00Z`, declaredWeightOz: 26, declaredDims: "13x10x7", serviceLabel: "UPS Ground", paid: billed[i] - 3.95, photoCount: 3 },
      pickupSeal:   { timestamp: `${dates[i]}T15:30:00Z`, firstScan: { weight: 26, service: "Ground", recordedDims: "13x10x7" }, mismatches: [] },
      transitLog:   { scans: [
        { timestamp: `${dates[i]}T15:30:00Z`, location: "Portland OR", status: "picked up" },
        { timestamp: `${dates[i]}T22:00:00Z`, location: "Louisville KY hub", status: "in transit" },
      ], weatherSnapshots: [] },
      reconciliation: { invoiceId: "INV-UPS-W43", invoiceLineAmount: billed[i], expectedAmount: billed[i] - 3.95, anomalies: [{ type: "residential-misclass", amount: 3.95, note: `destination ${zips[i]} matches commercial in USPS DB; UPS billed residential` }] },
      dispute: { issueType: "residential-misclass", filedDate: null, amountAtStake: 3.95, evidenceDrawers: [4], klemrLean: "batch-file all 11 — pattern across same warehouse cluster, $1,832 monthly exposure", status: "awaiting-your-call", batchKey: "ups-resi-aw-w43" },
      pushback: null,
      resolution: null,
    };
  }),

  // ─── IN-FLIGHT OTHER (11). Filed, in pushback, in transit, etc.

  // VB-43998 — UPS dim weight, filed, awaiting carrier response. $12.47.
  {
    id: "VB-43998", shipmentId: "VB-43998",
    labelCapture: { timestamp: "2024-10-21T08:14:00Z", declaredWeightOz: 14, declaredDims: "10x8x4", serviceLabel: "UPS Ground", paid: 17.38, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-21T15:30:00Z", firstScan: { weight: 14, service: "Ground", recordedDims: "11x9x5" }, mismatches: ["dim mismatch — recorded 11x9x5 vs declared 10x8x4"] },
    transitLog:   { scans: [
      { timestamp: "2024-10-21T15:30:00Z", location: "Portland OR", status: "picked up" },
      { timestamp: "2024-10-25T11:00:00Z", location: "Brooklyn NY", status: "delivered" },
    ], weatherSnapshots: [] },
    reconciliation: { invoiceId: "INV-UPS-W43", invoiceLineAmount: 19.85, expectedAmount: 17.38, anomalies: [{ type: "dim-weight", amount: 2.47, note: "carrier recorded larger dims than declared" }] },
    dispute: { issueType: "dim-weight", filedDate: "2024-10-26", amountAtStake: 12.47, evidenceDrawers: [1,2,4], klemrLean: "file — small but pattern", status: "filed" },
    pushback: null,
    resolution: null,
  },

  // VB-44156 — FedEx late delivery, denied once, refiling with NOAA. $93.40.
  {
    id: "VB-44156", shipmentId: "VB-44156",
    labelCapture: { timestamp: "2024-10-23T08:14:00Z", declaredWeightOz: 11, declaredDims: "10x6x4", serviceLabel: "FedEx Home Delivery", paid: 17.45, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-23T15:30:00Z", firstScan: { weight: 11, service: "Home Delivery", recordedDims: "10x6x4" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-10-23T15:30:00Z", location: "Portland OR",   status: "picked up" },
      { timestamp: "2024-10-26T08:00:00Z", location: "Philadelphia PA", status: "delayed — weather exception" },
      { timestamp: "2024-10-28T14:30:00Z", location: "Philadelphia PA", status: "delivered" },
    ], weatherSnapshots: [{ timestamp: "2024-10-26T08:00:00Z", location: "Philadelphia PA 19103", source: "NOAA", conditions: "clear; 62°F; no advisory" }] },
    reconciliation: { invoiceId: "INV-FX-W43", invoiceLineAmount: 17.45, expectedAmount: 17.45, anomalies: [] },
    dispute: { issueType: "late-delivery", filedDate: "2024-10-27", amountAtStake: 93.40, evidenceDrawers: [3], klemrLean: "re-file with NOAA", status: "in-pushback" },
    pushback: { denials: [{ timestamp: "2024-10-27T15:00:00Z", reasonCode: "WX-04", carrierNote: "Weather impact" }], counters: [{ against: "WX-04", counter: "NOAA archive shows clear conditions for that zip and timestamp" }], refilings: [{ timestamp: "2024-10-28T10:00:00Z", added: "NOAA screenshot for 19103 on 2024-10-26" }] },
    resolution: null,
  },

  // VB-44174 — clean delivery, invoice line matched, no dispute.
  clean({ id: "VB-44174", shipDate: "2024-10-23", weightOz: 9, dims: "8x6x4", service: "UPS Ground", paid: 16.20, deliveredDate: "2024-10-28", invoiceId: "INV-UPS-W43", invoiceLineAmount: 16.20 }),

  // VB-44188 — FedEx ground in transit; weather pulled along route.
  {
    id: "VB-44188", shipmentId: "VB-44188",
    labelCapture: { timestamp: "2024-10-24T08:14:00Z", declaredWeightOz: 13, declaredDims: "10x8x4", serviceLabel: "FedEx Ground", paid: 18.40, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-24T15:30:00Z", firstScan: { weight: 13, service: "Ground", recordedDims: "10x8x4" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-10-24T15:30:00Z", location: "Portland OR",       status: "picked up" },
      { timestamp: "2024-10-26T04:00:00Z", location: "Louisville KY hub", status: "in transit" },
    ], weatherSnapshots: [{ timestamp: "2024-10-26T04:00:00Z", location: "Louisville KY", source: "NOAA", conditions: "light rain; 54°F; no service guarantee waiver" }] },
    reconciliation: { invoiceId: "INV-FX-W43", invoiceLineAmount: 18.40, expectedAmount: 18.40, anomalies: [] },
    dispute: null, pushback: null, resolution: null,
  },

  // VB-44193 — UPS zone mismatch, just filed.
  {
    id: "VB-44193", shipmentId: "VB-44193",
    labelCapture: { timestamp: "2024-10-24T08:14:00Z", declaredWeightOz: 16, declaredDims: "10x8x6", serviceLabel: "UPS Ground", paid: 19.42, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-24T15:30:00Z", firstScan: { weight: 16, service: "Ground", recordedDims: "10x8x6" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-10-24T15:30:00Z", location: "Portland OR", status: "picked up" },
      { timestamp: "2024-10-28T11:30:00Z", location: "Denver CO",   status: "delivered" },
    ], weatherSnapshots: [] },
    reconciliation: { invoiceId: "INV-UPS-W43", invoiceLineAmount: 22.30, expectedAmount: 19.42, anomalies: [{ type: "zone-mismatch", amount: 2.88, note: "97214→80201 is zone 6; billed zone 7" }] },
    dispute: { issueType: "zone-mismatch", filedDate: "2024-10-28", amountAtStake: 38, evidenceDrawers: [4], klemrLean: "file — same pattern as VB-43745", status: "filed" },
    pushback: null,
    resolution: null,
  },

  // VB-44218 — UPS just picked up. Drawer 1+2.
  {
    id: "VB-44218", shipmentId: "VB-44218",
    labelCapture: { timestamp: "2024-10-25T08:14:00Z", declaredWeightOz: 18, declaredDims: "10x8x6", serviceLabel: "UPS Ground", paid: 20.10, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-25T15:30:00Z", firstScan: { weight: 18, service: "Ground", recordedDims: "10x8x6" }, mismatches: [] },
    transitLog:   { scans: [{ timestamp: "2024-10-25T15:30:00Z", location: "Portland OR", status: "picked up" }], weatherSnapshots: [] },
    reconciliation: null, dispute: null, pushback: null, resolution: null,
  },

  // VB-44225 — UPS label printed, not yet picked up. Drawer 1 only.
  {
    id: "VB-44225", shipmentId: "VB-44225",
    labelCapture: { timestamp: "2024-10-25T16:00:00Z", declaredWeightOz: 12, declaredDims: "10x6x4", serviceLabel: "UPS Ground", paid: 17.85, photoCount: 3 },
    pickupSeal: null, transitLog: null, reconciliation: null, dispute: null, pushback: null, resolution: null,
  },

  // VB-44211, VB-44219, VB-44230, VB-44245 — missing scans, in transit past
  // guarantee. Drawers 1-3, klemr watching. Will auto-file if no scan tomorrow.
  {
    id: "VB-44211", shipmentId: "VB-44211",
    labelCapture: { timestamp: "2024-10-19T08:14:00Z", declaredWeightOz: 7, declaredDims: "8x4x3", serviceLabel: "FedEx Express Saver", paid: 26.40, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-19T15:30:00Z", firstScan: { weight: 7, service: "Express Saver", recordedDims: "8x4x3" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-10-19T15:30:00Z", location: "Portland OR", status: "picked up" },
      { timestamp: "2024-10-20T03:00:00Z", location: "Memphis TN hub", status: "in transit" },
    ], weatherSnapshots: [], guaranteeBreached: true },
    reconciliation: null, dispute: null, pushback: null, resolution: null,
  },
  {
    id: "VB-44219", shipmentId: "VB-44219",
    labelCapture: { timestamp: "2024-10-20T08:14:00Z", declaredWeightOz: 9, declaredDims: "8x6x4", serviceLabel: "FedEx Home Delivery", paid: 15.80, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-20T15:30:00Z", firstScan: { weight: 9, service: "Home Delivery", recordedDims: "8x6x4" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-10-20T15:30:00Z", location: "Portland OR", status: "picked up" },
    ], weatherSnapshots: [], guaranteeBreached: true },
    reconciliation: null, dispute: null, pushback: null, resolution: null,
  },
  {
    id: "VB-44230", shipmentId: "VB-44230",
    labelCapture: { timestamp: "2024-10-22T08:14:00Z", declaredWeightOz: 11, declaredDims: "10x6x4", serviceLabel: "UPS Ground", paid: 17.95, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-22T15:30:00Z", firstScan: { weight: 11, service: "Ground", recordedDims: "10x6x4" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-10-22T15:30:00Z", location: "Portland OR", status: "picked up" },
      { timestamp: "2024-10-24T03:00:00Z", location: "Louisville KY hub", status: "in transit" },
    ], weatherSnapshots: [], guaranteeBreached: true },
    reconciliation: null, dispute: null, pushback: null, resolution: null,
  },
  {
    id: "VB-44245", shipmentId: "VB-44245",
    labelCapture: { timestamp: "2024-10-23T08:14:00Z", declaredWeightOz: 8, declaredDims: "8x6x4", serviceLabel: "FedEx Ground", paid: 14.55, photoCount: 3 },
    pickupSeal:   { timestamp: "2024-10-23T15:30:00Z", firstScan: { weight: 8, service: "Ground", recordedDims: "8x6x4" }, mismatches: [] },
    transitLog:   { scans: [
      { timestamp: "2024-10-23T15:30:00Z", location: "Portland OR", status: "picked up" },
    ], weatherSnapshots: [], guaranteeBreached: true },
    reconciliation: null, dispute: null, pushback: null, resolution: null,
  },

  // ─── CLEAN dossiers (13). Drawers 1-4 only. The boring majority.
  clean({ id: "VB-43520", shipDate: "2024-10-04", weightOz: 10, dims: "8x6x4",   service: "FedEx Ground",        paid: 15.20, deliveredDate: "2024-10-08", invoiceId: "INV-FX-W40",  invoiceLineAmount: 15.20 }),
  clean({ id: "VB-43560", shipDate: "2024-10-06", weightOz: 13, dims: "10x8x4",  service: "UPS Ground",          paid: 17.40, deliveredDate: "2024-10-09", invoiceId: "INV-UPS-W40", invoiceLineAmount: 17.40 }),
  clean({ id: "VB-43605", shipDate: "2024-10-08", weightOz: 8,  dims: "8x6x4",   service: "FedEx Home Delivery", paid: 14.10, deliveredDate: "2024-10-11", invoiceId: "INV-FX-W41",  invoiceLineAmount: 14.10 }),
  clean({ id: "VB-43650", shipDate: "2024-10-09", weightOz: 15, dims: "10x8x6",  service: "UPS Ground",          paid: 18.95, deliveredDate: "2024-10-12", invoiceId: "INV-UPS-W41", invoiceLineAmount: 18.95 }),
  clean({ id: "VB-43700", shipDate: "2024-10-11", weightOz: 12, dims: "10x6x4",  service: "FedEx Ground",        paid: 16.85, deliveredDate: "2024-10-14", invoiceId: "INV-FX-W41",  invoiceLineAmount: 16.85 }),
  clean({ id: "VB-43750", shipDate: "2024-10-12", weightOz: 6,  dims: "8x4x3",   service: "USPS Priority Mail",  paid: 9.85,  deliveredDate: "2024-10-14", invoiceId: null,           invoiceLineAmount: null }),
  clean({ id: "VB-43800", shipDate: "2024-10-14", weightOz: 11, dims: "10x6x4",  service: "FedEx Express Saver", paid: 28.30, deliveredDate: "2024-10-16", invoiceId: "INV-FX-W41",  invoiceLineAmount: 28.30 }),
  clean({ id: "VB-43850", shipDate: "2024-10-16", weightOz: 9,  dims: "8x6x4",   service: "UPS 3 Day Select",    paid: 22.40, deliveredDate: "2024-10-19", invoiceId: "INV-UPS-W42", invoiceLineAmount: 22.40 }),
  clean({ id: "VB-43900", shipDate: "2024-10-17", weightOz: 14, dims: "10x8x4",  service: "FedEx Ground",        paid: 17.95, deliveredDate: "2024-10-21", invoiceId: "INV-FX-W42",  invoiceLineAmount: 17.95 }),
  clean({ id: "VB-43950", shipDate: "2024-10-18", weightOz: 10, dims: "8x6x4",   service: "UPS Ground",          paid: 16.10, deliveredDate: "2024-10-21", invoiceId: "INV-UPS-W42", invoiceLineAmount: 16.10 }),
  clean({ id: "VB-44000", shipDate: "2024-10-19", weightOz: 8,  dims: "8x6x4",   service: "FedEx Home Delivery", paid: 14.85, deliveredDate: "2024-10-22", invoiceId: "INV-FX-W42",  invoiceLineAmount: 14.85 }),
  clean({ id: "VB-44050", shipDate: "2024-10-20", weightOz: 11, dims: "10x6x4",  service: "UPS Ground",          paid: 17.20, deliveredDate: "2024-10-23", invoiceId: "INV-UPS-W42", invoiceLineAmount: 17.20 }),
  clean({ id: "VB-44100", shipDate: "2024-10-22", weightOz: 12, dims: "10x6x4",  service: "FedEx Ground",        paid: 16.45, deliveredDate: "2024-10-25", invoiceId: "INV-FX-W43",  invoiceLineAmount: 16.45 }),
];

export const DOSSIER_BY_ID = Object.fromEntries(DOSSIERS.map(d => [d.id, d]));
