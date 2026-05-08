// Customer pool for Verdant orders. Mostly retail (DTC) with one
// wholesale buyer (Apothecary West) responsible for the 11 UPS
// commercial-as-residential reclassifications referenced in the
// morning briefing.
//
// "addresses" is a list because wholesale buyers ship to multiple
// warehouses; retail customers usually just have one.

export const CUSTOMERS = [
  // Retail (DTC) — single shipping address each
  { id: "cust-001", name: "Sarah Kim",      kind: "retail", addresses: [{ city: "Brooklyn",     state: "NY", zip: "11201", commercial: false }] },
  { id: "cust-002", name: "Marcus Tate",    kind: "retail", addresses: [{ city: "Austin",       state: "TX", zip: "78704", commercial: false }] },
  { id: "cust-003", name: "Priya Rao",      kind: "retail", addresses: [{ city: "Seattle",      state: "WA", zip: "98101", commercial: false }] },
  { id: "cust-004", name: "David Lee",      kind: "retail", addresses: [{ city: "Denver",       state: "CO", zip: "80201", commercial: false }] },
  { id: "cust-005", name: "Emma Cho",       kind: "retail", addresses: [{ city: "Boston",       state: "MA", zip: "02108", commercial: false }] },
  { id: "cust-006", name: "James Okafor",   kind: "retail", addresses: [{ city: "Atlanta",      state: "GA", zip: "30301", commercial: false }] },
  { id: "cust-007", name: "Lily Hahn",      kind: "retail", addresses: [{ city: "Portland",     state: "OR", zip: "97214", commercial: false }] },
  { id: "cust-008", name: "Carlos Mendez",  kind: "retail", addresses: [{ city: "Miami",        state: "FL", zip: "33101", commercial: false }] },
  { id: "cust-009", name: "Aisha Bello",    kind: "retail", addresses: [{ city: "Chicago",      state: "IL", zip: "60601", commercial: false }] },
  { id: "cust-010", name: "Tom Walsh",      kind: "retail", addresses: [{ city: "Phoenix",      state: "AZ", zip: "85001", commercial: false }] },
  { id: "cust-011", name: "Hannah Greene",  kind: "retail", addresses: [{ city: "Nashville",    state: "TN", zip: "37201", commercial: false }] },
  { id: "cust-012", name: "Ben Sato",       kind: "retail", addresses: [{ city: "Minneapolis",  state: "MN", zip: "55401", commercial: false }] },
  { id: "cust-013", name: "Olivia Patel",   kind: "retail", addresses: [{ city: "Dallas",       state: "TX", zip: "75201", commercial: false }] },
  { id: "cust-014", name: "Rachel Diaz",    kind: "retail", addresses: [{ city: "Los Angeles",  state: "CA", zip: "90001", commercial: false }] },
  { id: "cust-015", name: "Noah Park",      kind: "retail", addresses: [{ city: "San Francisco",state: "CA", zip: "94110", commercial: false }] },
  { id: "cust-016", name: "Maya Reeves",    kind: "retail", addresses: [{ city: "Philadelphia", state: "PA", zip: "19103", commercial: false }] },

  // Wholesale — multiple commercial warehouses across Cincinnati metro.
  // All 11 UPS reclassifications shipped to addresses on this account.
  {
    id: "cust-200", name: "Apothecary West", kind: "wholesale",
    addresses: [
      { city: "Cincinnati",      state: "OH", zip: "45202", commercial: true, label: "Apothecary West · Downtown WH" },
      { city: "Cincinnati",      state: "OH", zip: "45203", commercial: true, label: "Apothecary West · Riverside WH" },
      { city: "Cincinnati",      state: "OH", zip: "45215", commercial: true, label: "Apothecary West · Lockland WH" },
      { city: "Cincinnati",      state: "OH", zip: "45236", commercial: true, label: "Apothecary West · Kenwood WH" },
      { city: "Cincinnati",      state: "OH", zip: "45237", commercial: true, label: "Apothecary West · Roselawn WH" },
      { city: "Cincinnati",      state: "OH", zip: "45239", commercial: true, label: "Apothecary West · Mt Healthy WH" },
      { city: "Cincinnati",      state: "OH", zip: "45241", commercial: true, label: "Apothecary West · Blue Ash WH" },
      { city: "Cincinnati",      state: "OH", zip: "45249", commercial: true, label: "Apothecary West · Symmes WH" },
      { city: "Cincinnati",      state: "OH", zip: "45252", commercial: true, label: "Apothecary West · Colerain WH" },
      { city: "Cincinnati",      state: "OH", zip: "45254", commercial: true, label: "Apothecary West · Anderson WH" },
      { city: "Cincinnati",      state: "OH", zip: "45255", commercial: true, label: "Apothecary West · Mt Carmel WH" },
    ],
  },
];

export const CUSTOMER_BY_ID = Object.fromEntries(CUSTOMERS.map(c => [c.id, c]));

// Verdant ships from a single warehouse in Portland, OR.
export const ORIGIN = { city: "Portland", state: "OR", zip: "97214", facility: "Verdant Warehouse · Portland" };
