// Verdant Botanicals fake database. Re-exports each collection plus
// helper accessors. The full database is small enough to fit in a
// single LLM context window — getDatabase() returns the whole thing
// for system-prompt assembly when we wire up the Claude composer.

import { SKUS, SKU_BY_ID } from "./skus.js";
import { CUSTOMERS, CUSTOMER_BY_ID, ORIGIN } from "./customers.js";
import { ORDERS, ORDER_BY_ID } from "./orders.js";
import { SHIPMENTS, SHIPMENT_BY_ID, TODAY } from "./shipments.js";
import { INVOICES, INVOICE_BY_ID } from "./invoices.js";
import { DOSSIERS, DOSSIER_BY_ID } from "./dossiers.js";

export {
  SKUS, SKU_BY_ID,
  CUSTOMERS, CUSTOMER_BY_ID, ORIGIN,
  ORDERS, ORDER_BY_ID,
  SHIPMENTS, SHIPMENT_BY_ID, TODAY,
  INVOICES, INVOICE_BY_ID,
  DOSSIERS, DOSSIER_BY_ID,
};

// Snapshot of the entire database. Useful for shipping into an LLM
// system prompt or for high-level queries.
export function getDatabase() {
  return {
    today: TODAY,
    origin: ORIGIN,
    skus: SKUS,
    customers: CUSTOMERS,
    orders: ORDERS,
    shipments: SHIPMENTS,
    invoices: INVOICES,
    dossiers: DOSSIERS,
  };
}

// Common queries — pre-built so the chat layer (and the LLM) doesn't
// have to filter every time. Add more as the prototype grows.

export function getOpenDossiers() {
  return DOSSIERS.filter(d => d.dispute && !d.resolution);
}

export function getDossiersAwaitingYourCall() {
  return DOSSIERS.filter(d => d.dispute && d.dispute.status === "awaiting-your-call");
}

export function getSealedDossiers() {
  return DOSSIERS.filter(d => d.resolution);
}

export function getSealedThisMonth() {
  // "This month" frame matches the demo recap (Oct 1 - Oct 28).
  return DOSSIERS.filter(d => d.resolution && d.resolution.closedDate >= "2024-10-01" && d.resolution.closedDate <= TODAY);
}

export function getTotalRecoveredThisMonth() {
  return getSealedThisMonth().reduce((sum, d) => sum + (d.resolution.creditAmount || 0), 0);
}

export function getMissingScans() {
  return DOSSIERS.filter(d => d.transitLog && d.transitLog.guaranteeBreached);
}
