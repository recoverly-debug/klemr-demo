// Orders — what the customer bought. Each order is fulfilled by one or
// more shipments (most are 1:1; wholesale orders to Apothecary West
// split across multiple warehouse addresses).

export const ORDERS = [
  // ─── Retail orders (1 shipment each)
  { id: "o-001", customerId: "cust-001", date: "2024-09-27", items: [{ sku: "VB-CL-ROSE", qty: 1 }, { sku: "VB-MO-DAY", qty: 1 }], total: 102, shipmentIds: ["VB-43412"] },
  { id: "o-002", customerId: "cust-002", date: "2024-09-29", items: [{ sku: "VB-GIFT-START", qty: 1 }],                              total: 78,  shipmentIds: ["VB-43445"] },
  { id: "o-003", customerId: "cust-003", date: "2024-09-30", items: [{ sku: "VB-SE-VITC", qty: 1 }],                                 total: 68,  shipmentIds: ["VB-43476"] },

  // The "$1,232 claim" order — David Lee placed a wholesale-style bulk
  // gift-set order (10 sets) for a corporate wellness program. Heavy
  // package, big shipping bill, big disputable surcharge.
  { id: "o-004", customerId: "cust-004", date: "2024-10-03", items: [{ sku: "VB-GIFT-GLOW", qty: 8 }, { sku: "VB-GIFT-WIND", qty: 6 }], total: 1612, shipmentIds: ["VB-43509"] },

  { id: "o-005", customerId: "cust-005", date: "2024-10-04", items: [{ sku: "VB-MA-CLAY", qty: 1 }, { sku: "VB-LIP-BALM", qty: 2 }],  total: 82,  shipmentIds: ["VB-43544"] },
  { id: "o-006", customerId: "cust-006", date: "2024-10-06", items: [{ sku: "VB-GIFT-WIND", qty: 1 }],                               total: 98,  shipmentIds: ["VB-43581"] },
  { id: "o-007", customerId: "cust-007", date: "2024-10-07", items: [{ sku: "VB-SE-RET", qty: 1 }],                                  total: 72,  shipmentIds: ["VB-43622"] },
  { id: "o-008", customerId: "cust-008", date: "2024-10-09", items: [{ sku: "VB-BO-LOTION", qty: 1 }, { sku: "VB-BO-OIL", qty: 1 }], total: 84,  shipmentIds: ["VB-43678"] },
  { id: "o-009", customerId: "cust-009", date: "2024-10-10", items: [{ sku: "VB-CL-CHAR", qty: 1 }, { sku: "VB-MA-HONEY", qty: 1 }], total: 86,  shipmentIds: ["VB-43712"] },
  { id: "o-010", customerId: "cust-010", date: "2024-10-11", items: [{ sku: "VB-MO-NIGHT", qty: 1 }],                                total: 62,  shipmentIds: ["VB-43745"] },
  { id: "o-011", customerId: "cust-011", date: "2024-10-13", items: [{ sku: "VB-EY-BRIGHT", qty: 1 }, { sku: "VB-SE-NIA", qty: 1 }], total: 106, shipmentIds: ["VB-43798"] },
  { id: "o-012", customerId: "cust-012", date: "2024-10-16", items: [{ sku: "VB-TO-CHAM", qty: 1 }],                                 total: 36,  shipmentIds: ["VB-43881"] },
  { id: "o-013", customerId: "cust-013", date: "2024-10-21", items: [{ sku: "VB-GIFT-START", qty: 1 }],                              total: 78,  shipmentIds: ["VB-44102"] },
  { id: "o-014", customerId: "cust-014", date: "2024-10-24", items: [{ sku: "VB-CL-ROSE", qty: 1 }],                                 total: 48,  shipmentIds: ["VB-44210"] },

  // VB-44087 — Aisha Bello in Chicago, the FedEx weather-denial morning card.
  { id: "o-015", customerId: "cust-009", date: "2024-10-17", items: [{ sku: "VB-GIFT-WIND", qty: 1 }],                               total: 98,  shipmentIds: ["VB-44087"] },

  { id: "o-016", customerId: "cust-001", date: "2024-10-20", items: [{ sku: "VB-SE-VITC", qty: 1 }, { sku: "VB-MO-DAY", qty: 1 }],   total: 122, shipmentIds: ["VB-43998"] },
  { id: "o-017", customerId: "cust-016", date: "2024-10-22", items: [{ sku: "VB-MA-CLAY", qty: 1 }, { sku: "VB-TO-CHAM", qty: 1 }],  total: 74,  shipmentIds: ["VB-44156"] },
  { id: "o-018", customerId: "cust-006", date: "2024-10-22", items: [{ sku: "VB-LIP-BALM", qty: 2 }, { sku: "VB-EY-BRIGHT", qty: 1 }], total: 92, shipmentIds: ["VB-44174"] },
  { id: "o-019", customerId: "cust-008", date: "2024-10-23", items: [{ sku: "VB-BO-OIL", qty: 1 }, { sku: "VB-MO-NIGHT", qty: 1 }],  total: 108, shipmentIds: ["VB-44188"] },
  { id: "o-020", customerId: "cust-004", date: "2024-10-23", items: [{ sku: "VB-GIFT-GLOW", qty: 1 }],                               total: 128, shipmentIds: ["VB-44193"] },
  { id: "o-021", customerId: "cust-010", date: "2024-10-24", items: [{ sku: "VB-HA-SHAMP", qty: 1 }, { sku: "VB-HA-COND", qty: 1 }], total: 64,  shipmentIds: ["VB-44218"] },
  { id: "o-022", customerId: "cust-013", date: "2024-10-24", items: [{ sku: "VB-CL-ROSE", qty: 1 }, { sku: "VB-MA-HONEY", qty: 1 }], total: 92,  shipmentIds: ["VB-44225"] },
  { id: "o-023", customerId: "cust-011", date: "2024-10-18", items: [{ sku: "VB-SE-VITC", qty: 1 }],                                 total: 68,  shipmentIds: ["VB-44211"] },
  { id: "o-024", customerId: "cust-015", date: "2024-10-19", items: [{ sku: "VB-MO-DAY", qty: 1 }, { sku: "VB-TO-NIA", qty: 1 }],    total: 112, shipmentIds: ["VB-44219"] },
  { id: "o-025", customerId: "cust-014", date: "2024-10-21", items: [{ sku: "VB-BO-LOTION", qty: 1 }, { sku: "VB-BO-SCRUB", qty: 1 }], total: 72, shipmentIds: ["VB-44230"] },
  { id: "o-026", customerId: "cust-003", date: "2024-10-22", items: [{ sku: "VB-MA-HONEY", qty: 1 }],                                total: 44,  shipmentIds: ["VB-44245"] },

  // Generic clean retail orders
  { id: "o-027", customerId: "cust-001", date: "2024-10-03", items: [{ sku: "VB-LIP-BALM", qty: 2 }],                                total: 44,  shipmentIds: ["VB-43520"] },
  { id: "o-028", customerId: "cust-002", date: "2024-10-05", items: [{ sku: "VB-CL-CHAR", qty: 1 }],                                 total: 42,  shipmentIds: ["VB-43560"] },
  { id: "o-029", customerId: "cust-003", date: "2024-10-07", items: [{ sku: "VB-MO-NIGHT", qty: 1 }],                                total: 62,  shipmentIds: ["VB-43605"] },
  { id: "o-030", customerId: "cust-005", date: "2024-10-08", items: [{ sku: "VB-BO-OIL", qty: 1 }],                                  total: 46,  shipmentIds: ["VB-43650"] },
  { id: "o-031", customerId: "cust-006", date: "2024-10-10", items: [{ sku: "VB-CL-ROSE", qty: 1 }],                                 total: 48,  shipmentIds: ["VB-43700"] },
  { id: "o-032", customerId: "cust-007", date: "2024-10-11", items: [{ sku: "VB-LIP-BALM", qty: 1 }],                                total: 22,  shipmentIds: ["VB-43750"] },
  { id: "o-033", customerId: "cust-008", date: "2024-10-13", items: [{ sku: "VB-SE-RET", qty: 1 }],                                  total: 72,  shipmentIds: ["VB-43800"] },
  { id: "o-034", customerId: "cust-009", date: "2024-10-15", items: [{ sku: "VB-EY-BRIGHT", qty: 1 }],                               total: 48,  shipmentIds: ["VB-43850"] },
  { id: "o-035", customerId: "cust-010", date: "2024-10-16", items: [{ sku: "VB-CL-CHAR", qty: 1 }, { sku: "VB-MA-CLAY", qty: 1 }],  total: 80,  shipmentIds: ["VB-43900"] },
  { id: "o-036", customerId: "cust-011", date: "2024-10-17", items: [{ sku: "VB-TO-CHAM", qty: 1 }],                                 total: 36,  shipmentIds: ["VB-43950"] },
  { id: "o-037", customerId: "cust-012", date: "2024-10-18", items: [{ sku: "VB-MA-HONEY", qty: 1 }],                                total: 44,  shipmentIds: ["VB-44000"] },
  { id: "o-038", customerId: "cust-013", date: "2024-10-19", items: [{ sku: "VB-BO-SCRUB", qty: 1 }],                                total: 34,  shipmentIds: ["VB-44050"] },
  { id: "o-039", customerId: "cust-014", date: "2024-10-21", items: [{ sku: "VB-MO-DAY", qty: 1 }],                                  total: 54,  shipmentIds: ["VB-44100"] },

  // ─── Wholesale orders to Apothecary West (the 11 UPS reclassifications)
  // Each PO splits across multiple warehouses (the wholesale buyer wants
  // stock distributed). 5 POs covering 11 shipments.
  { id: "o-100", customerId: "cust-200", date: "2024-10-23", items: [{ sku: "VB-CL-ROSE", qty: 12 }, { sku: "VB-MO-DAY", qty: 12 }, { sku: "VB-SE-VITC", qty: 8 }],   total: 1768, shipmentIds: ["VB-44261", "VB-44262"] },
  { id: "o-101", customerId: "cust-200", date: "2024-10-24", items: [{ sku: "VB-CL-CHAR", qty: 14 }, { sku: "VB-TO-CHAM", qty: 12 }, { sku: "VB-LIP-BALM", qty: 24 }], total: 1556, shipmentIds: ["VB-44263", "VB-44264"] },
  { id: "o-102", customerId: "cust-200", date: "2024-10-25", items: [{ sku: "VB-MO-NIGHT", qty: 10 }, { sku: "VB-EY-BRIGHT", qty: 10 }, { sku: "VB-MA-HONEY", qty: 10 }], total: 1540, shipmentIds: ["VB-44265", "VB-44266"] },
  { id: "o-103", customerId: "cust-200", date: "2024-10-26", items: [{ sku: "VB-BO-OIL", qty: 12 }, { sku: "VB-BO-LOTION", qty: 12 }, { sku: "VB-HA-SHAMP", qty: 10 }, { sku: "VB-HA-COND", qty: 10 }], total: 1648, shipmentIds: ["VB-44267", "VB-44268", "VB-44269"] },
  { id: "o-104", customerId: "cust-200", date: "2024-10-27", items: [{ sku: "VB-GIFT-WIND", qty: 8 }, { sku: "VB-GIFT-GLOW", qty: 6 }, { sku: "VB-GIFT-START", qty: 8 }], total: 2176, shipmentIds: ["VB-44270", "VB-44271"] },
];

export const ORDER_BY_ID = Object.fromEntries(ORDERS.map(o => [o.id, o]));
