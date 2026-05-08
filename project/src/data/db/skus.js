// Verdant Botanicals product catalog. Skincare DTC.
// Weights are package-shipped weight (oz), used by dossiers to compute
// declared-weight expectations and catch dim-weight overcharges.

export const SKUS = [
  { sku: "VB-CL-ROSE",   name: "Rose Cleansing Balm 4oz",         price: 48,  weightOz: 8,  category: "cleanser" },
  { sku: "VB-CL-CHAR",   name: "Charcoal Cleanser 6oz",           price: 42,  weightOz: 10, category: "cleanser" },
  { sku: "VB-TO-CHAM",   name: "Chamomile Toner 4oz",             price: 36,  weightOz: 6,  category: "toner" },
  { sku: "VB-TO-NIA",    name: "Niacinamide Serum 1oz",           price: 58,  weightOz: 3,  category: "serum" },
  { sku: "VB-SE-VITC",   name: "Vitamin C Serum 1oz",             price: 68,  weightOz: 3,  category: "serum" },
  { sku: "VB-SE-RET",    name: "Retinol Serum 1oz",               price: 72,  weightOz: 3,  category: "serum" },
  { sku: "VB-MO-DAY",    name: "Daily Moisturizer 2oz",           price: 54,  weightOz: 5,  category: "moisturizer" },
  { sku: "VB-MO-NIGHT",  name: "Night Cream 2oz",                 price: 62,  weightOz: 5,  category: "moisturizer" },
  { sku: "VB-EY-BRIGHT", name: "Brightening Eye Cream 0.5oz",     price: 48,  weightOz: 2,  category: "eye" },
  { sku: "VB-MA-CLAY",   name: "Clay Mask 4oz",                   price: 38,  weightOz: 7,  category: "mask" },
  { sku: "VB-MA-HONEY",  name: "Honey Mask 4oz",                  price: 44,  weightOz: 7,  category: "mask" },
  { sku: "VB-LIP-BALM",  name: "Tinted Lip Balm",                 price: 22,  weightOz: 1,  category: "lip" },
  { sku: "VB-BO-OIL",    name: "Body Oil 4oz",                    price: 46,  weightOz: 8,  category: "body" },
  { sku: "VB-BO-LOTION", name: "Botanical Body Lotion 8oz",       price: 38,  weightOz: 12, category: "body" },
  { sku: "VB-BO-SCRUB",  name: "Sugar Body Scrub 8oz",            price: 34,  weightOz: 14, category: "body" },
  { sku: "VB-HA-SHAMP",  name: "Botanical Shampoo 8oz",           price: 32,  weightOz: 11, category: "hair" },
  { sku: "VB-HA-COND",   name: "Botanical Conditioner 8oz",       price: 32,  weightOz: 11, category: "hair" },
  { sku: "VB-GIFT-WIND", name: "Wind Down Gift Set",              price: 98,  weightOz: 22, category: "gift" },
  { sku: "VB-GIFT-GLOW", name: "Glow Gift Set",                   price: 128, weightOz: 26, category: "gift" },
  { sku: "VB-GIFT-START",name: "Starter Gift Set",                price: 78,  weightOz: 18, category: "gift" },
];

export const SKU_BY_ID = Object.fromEntries(SKUS.map(s => [s.sku, s]));
