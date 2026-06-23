const HUMIDITY_IMG =
  "https://www.leaflock.com.au/cdn/shop/files/Untitled_design_-_2025-11-11T233208.411.png?v=1780013371&width=700";

window.LEAFLOCK_PRODUCTS = [
  {
    id: "humidity-pack-62",
    name: "LeafLock 2-Way Humidity Pack 62%",
    category: "humidity",
    categoryLabel: "Humidity Control",
    price: 2.39,
    priceLabel: "From $4.20 · $2.39 bulk",
    compareAt: null,
    badge: "Best seller",
    singlePrice: 4.2,
    bulkUnitPrice: 2.39,
    image: "https://www.leaflock.com.au/cdn/shop/files/Untitled_design_-_2025-11-11T233208.411.png?v=1780013371&width=1200",
    images: [
      "https://www.leaflock.com.au/cdn/shop/files/Untitled_design_-_2025-11-11T233208.411.png?v=1780013371&width=1200",
      "https://www.leaflock.com.au/cdn/shop/files/7da755cb-09e6d7_4a92cc8537134a90938828698e80dea4_mv2.png?v=1780013371&width=800"
    ],
    variants: [
      { id: "1-pack", label: "1 Pack — novelty single", price: 4.2 },
      { id: "2-pack", label: "2 Pack", price: 7.0 },
      { id: "5-pack", label: "5 Pack", price: 13.5 },
      { id: "10-pack", label: "10 Pack", price: 25.0 },
      { id: "23-pack", label: "23 Pack — $2.39/ea", price: 55.0 }
    ],
    description: "Australian-designed two-way humidity packs that automatically balance moisture in jars, bags, and tins. Singles are $4.20 (postage makes it a novelty cop). Real value is $2.39 per pack when you grab 23 for $55.",
    features: ["62% RH target", "Two-way control", "23 for $55 ($2.39 ea)", "1 pack $4.20 single ship"]
  },
  {
    id: "curing-bag-1lb",
    name: "LeafLock 2-Way Curing Bag 1 Pound",
    category: "humidity",
    categoryLabel: "Humidity Control",
    price: 39.99,
    priceLabel: "From $39.99",
    compareAt: null,
    badge: null,
    image: "https://www.leaflock.com.au/cdn/shop/files/1LBCuringBag.png?v=1780020577&width=1200",
    images: ["https://www.leaflock.com.au/cdn/shop/files/1LBCuringBag.png?v=1780020577&width=1200"],
    variants: [{ id: "default", label: "1 Pound", price: 39.99 }],
    description: "Advanced fibre curing bag engineered to maintain a stable environment for long-term storage and cure support.",
    features: ["1lb capacity", "Two-way humidity", "Reusable design", "Retail ready"]
  },
  {
    id: "gummy-mix-90g",
    name: "LeafLock Gummy Mix 90g",
    category: "gummies",
    categoryLabel: "Gummies",
    price: 29.99,
    priceLabel: "$29.99",
    compareAt: null,
    badge: null,
    image: "https://www.leaflock.com.au/cdn/shop/files/LeafLockGummyMix1.png?v=1780014860&width=1200",
    images: [
      "https://www.leaflock.com.au/cdn/shop/files/LeafLockGummyMix1.png?v=1780014860&width=1200",
      "https://www.leaflock.com.au/cdn/shop/files/LeafLockGummyMixPouchMockup_5.png?v=1780014860&width=1200"
    ],
    variants: [{ id: "default", label: "90g pouch", price: 29.99 }],
    description: "DIY gummy kit from LeafLock. Mix, mould, and enjoy consistent results at home with multiple flavour profiles.",
    features: ["90g mix", "Easy home prep", "Multiple flavours", "LeafLock quality"]
  },
  {
    id: "gummy-mix-179g",
    name: "LeafLock Gummy Mix 179g",
    category: "gummies",
    categoryLabel: "Gummies",
    price: 49.99,
    priceLabel: "$49.99",
    compareAt: null,
    badge: null,
    image: "https://www.leaflock.com.au/cdn/shop/files/LeafLock_Gummy_Mix_Strawberry.png?v=1780023389&width=1200",
    images: ["https://www.leaflock.com.au/cdn/shop/files/LeafLock_Gummy_Mix_Strawberry.png?v=1780023389&width=1200"],
    variants: [{ id: "default", label: "179g", price: 49.99 }],
    description: "Larger format DIY gummy mix for repeat makers and small-batch production.",
    features: ["179g format", "Bold flavours", "Consistent texture", "Great value"]
  },
  {
    id: "gummy-mix-2pk",
    name: "LeafLock Gummy Mix 2pk 179g",
    category: "gummies",
    categoryLabel: "Gummies",
    price: 79.99,
    priceLabel: "$79.99",
    compareAt: 99.98,
    badge: "-20%",
    image: "https://www.leaflock.com.au/cdn/shop/files/LeafLock_Gummy_2pk.png?v=1780023279&width=1200",
    images: ["https://www.leaflock.com.au/cdn/shop/files/LeafLock_Gummy_2pk.png?v=1780023279&width=1200"],
    variants: [{ id: "default", label: "2 pack", price: 79.99 }],
    description: "Bundle two 179g mixes and save. Ideal for flavour variety or gifting.",
    features: ["2 × 179g", "Bundle savings", "Mix & match flavours", "Party ready"]
  },
  {
    id: "gummy-mix-3pk",
    name: "LeafLock Gummy Mix 3pk 179g",
    category: "gummies",
    categoryLabel: "Gummies",
    price: 124.99,
    priceLabel: "$124.99",
    compareAt: 149.97,
    badge: "-17%",
    image: "https://www.leaflock.com.au/cdn/shop/files/LeafLock_Gummy_Mix_3pk.png?v=1780023275&width=1200",
    images: ["https://www.leaflock.com.au/cdn/shop/files/LeafLock_Gummy_Mix_3pk.png?v=1780023275&width=1200"],
    variants: [{ id: "default", label: "3 pack", price: 124.99 }],
    description: "Maximum bundle value for enthusiasts running multiple batches.",
    features: ["3 × 179g", "Best bundle rate", "Stock up", "Share with mates"]
  },
  {
    id: "gummy-90g-2-bundle",
    name: "Gummy Mix 90g — 2 Pack Bundle",
    category: "gummies",
    categoryLabel: "Gummies",
    price: 49.99,
    priceLabel: "$49.99",
    compareAt: null,
    badge: "Bundle",
    image: "https://www.leaflock.com.au/cdn/shop/files/LeafLockGummyMix1.png?v=1780014860&width=1200",
    images: ["https://www.leaflock.com.au/cdn/shop/files/LeafLockGummyMix1.png?v=1780014860&width=1200"],
    variants: [{ id: "default", label: "2 × 90g", price: 49.99 }],
    description: "Starter bundle for trying two 90g pouches at a better per-unit price.",
    features: ["2 × 90g", "Starter bundle", "Easy gifting", "Fast prep"]
  },
  {
    id: "gummy-90g-3-bundle",
    name: "Gummy Mix 90g — 3 Pack Bundle",
    category: "gummies",
    categoryLabel: "Gummies",
    price: 69.99,
    priceLabel: "$69.99",
    compareAt: null,
    badge: "Bundle",
    image: "https://www.leaflock.com.au/cdn/shop/files/LeafLockGummyMix1.png?v=1780014860&width=1200",
    images: ["https://www.leaflock.com.au/cdn/shop/files/LeafLockGummyMixPouchMockup_5.png?v=1780014860&width=1200"],
    variants: [{ id: "default", label: "3 × 90g", price: 69.99 }],
    description: "Three-pouch value pack for regular home makers.",
    features: ["3 × 90g", "Value pack", "Multiple sessions", "LeafLock quality"]
  },
  {
    id: "branch-whisperers",
    name: "Branch Whisperers",
    category: "grow",
    categoryLabel: "Grow Tools",
    price: 17.99,
    priceLabel: "$17.99",
    compareAt: 19.99,
    badge: "-10%",
    image: "https://www.leaflock.com.au/cdn/shop/files/Untitled_design_-_2025-11-11T171334.195.png?v=1762845311&width=1200",
    images: ["https://www.leaflock.com.au/cdn/shop/files/Untitled_design_-_2025-11-11T171334.195.png?v=1762845311&width=1200"],
    variants: [{ id: "default", label: "Standard", price: 17.99 }],
    description: "Low-stress training tools designed to help you shape plants gently and maximise canopy potential.",
    features: ["LST friendly", "Durable build", "Grower essential", "LeafLock design"]
  },
  {
    id: "master-ties",
    name: "LeafLock Master Ties",
    category: "grow",
    categoryLabel: "Grow Tools",
    price: 19.99,
    priceLabel: "$19.99",
    compareAt: 24.99,
    badge: "-20%",
    image: "https://www.leaflock.com.au/cdn/shop/files/Master_Ties_LeafLock.png?v=1780023066&width=1200",
    images: ["https://www.leaflock.com.au/cdn/shop/files/Master_Ties_LeafLock.png?v=1780023066&width=1200"],
    variants: [{ id: "default", label: "Standard", price: 19.99 }],
    description: "Reusable plant ties for training, support, and tidy grows without damaging stems.",
    features: ["Reusable", "Gentle grip", "Training ready", "Pro results"]
  },
  {
    id: "biscotti-wax-wizard",
    name: "Biscotti Wax Wizard",
    category: "wax",
    categoryLabel: "Wax Wizard",
    price: 55.0,
    priceLabel: "From $55.00",
    compareAt: null,
    badge: null,
    image: "https://www.leaflock.com.au/cdn/shop/files/BiscottiWaxWizard.png?v=1780020989&width=1200",
    images: ["https://www.leaflock.com.au/cdn/shop/files/BiscottiWaxWizard.png?v=1780020989&width=1200"],
    variants: [
      { id: "10ml", label: "10ml", price: 55.0 },
      { id: "30ml", label: "30ml", price: 85.0 }
    ],
    description: "Terp-rich wax liquidizer blend in the Biscotti profile. Built for smooth consistency and bold character.",
    features: ["Biscotti profile", "Multiple sizes", "Blend ready", "LeafLock Wax Wizard"]
  },
  {
    id: "gold-pendant",
    name: "18k Gold Plated Pendant & Chain",
    category: "merch",
    categoryLabel: "Merch",
    price: 69.99,
    priceLabel: "$69.99",
    compareAt: null,
    badge: "New",
    image: "https://www.leaflock.com.au/cdn/shop/files/LeaflockNecklace.jpg?v=1779965114&width=1200",
    images: [
      "https://www.leaflock.com.au/cdn/shop/files/LeaflockNecklace.jpg?v=1779965114&width=1200",
      "https://www.leaflock.com.au/cdn/shop/files/rn-image_picker_lib_temp_a4ee25bf-12f5-4d2d-9af2-1993d6f0638c.png?v=1780010122&width=1200"
    ],
    variants: [
      { id: "gold-black", label: "Gold & Black", price: 69.99 },
      { id: "gold-pink", label: "Gold & Pink", price: 69.99 }
    ],
    description: "LeafLock branded pendant and chain. Wear the brand that preserves the essence.",
    features: ["18k gold plated", "Two colourways", "Gift ready", "LeafLock mark"]
  }
];

window.LEAFLOCK_CATEGORIES = [
  { id: "all", label: "All products", image: null },
  { id: "humidity", label: "Humidity Control", image: HUMIDITY_IMG },
  { id: "grow", label: "Grow Tools", image: "https://www.leaflock.com.au/cdn/shop/collections/Grow_Tools.png?v=1762841799&width=700" },
  { id: "gummies", label: "Gummies", image: "https://www.leaflock.com.au/cdn/shop/collections/Gummy_Mix.png?v=1762546912&width=700" },
  { id: "wax", label: "Wax Wizard", image: "https://www.leaflock.com.au/cdn/shop/collections/Terp_Blendz.png?v=1762548028&width=700" },
  { id: "merch", label: "Merch", image: "https://www.leaflock.com.au/cdn/shop/collections/Leaflock_clothing.png?v=1762548244&width=700" }
];

window.getProduct = function getProduct(id) {
  return window.LEAFLOCK_PRODUCTS.find((p) => p.id === id) || null;
};

window.formatMoney = function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
};

const BRAND_CORE_IDS = new Set([
  "humidity-pack-62",
  "curing-bag-1lb",
  "gummy-mix-90g",
  "gummy-mix-179g",
  "gummy-mix-2pk",
  "gummy-mix-3pk",
  "branch-whisperers",
  "master-ties",
  "biscotti-wax-wizard"
]);

window.LEAFLOCK_PRODUCTS.forEach((product) => {
  product.brandCore = BRAND_CORE_IDS.has(product.id);
});

window.LEAFLOCK_BRAND_COUNT = window.LEAFLOCK_PRODUCTS.filter((p) => p.brandCore).length;
window.LEAFLOCK_CATALOG_COUNT = window.LEAFLOCK_PRODUCTS.length;

window.getDefaultVariant = function getDefaultVariant(product) {
  if (!product?.variants?.length) return null;
  if (product.id === "humidity-pack-62") {
    return product.variants.find((v) => v.id === "23-pack") || product.variants[0];
  }
  return product.variants[0];
};