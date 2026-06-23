import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const token = "70c255c5ecada3b898f44697af57490e";
const query = `{ metaobject(handle: { handle: "bss_sl_metaobject_data", type: "$app:bss_sl_data" }) { fields { key value } } }`;

const res = await fetch("https://zya5ny-rw.myshopify.com/api/2025-01/graphql.json", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": token,
  },
  body: JSON.stringify({ query }),
});

const json = await res.json();
const field = json?.data?.metaobject?.fields?.find((f) => f.key.startsWith("locationData"));
if (!field) {
  console.error("No location data found", json);
  process.exit(1);
}

const wrapper = JSON.parse(field.value);
const stores = JSON.parse(wrapper.value).map((store) => ({
  id: store.id,
  name: store.storeName,
  address: store.address?.trim(),
  city: store.city?.trim(),
  state: store.state?.trim(),
  zip: store.zipCode,
  country: store.country || "Australia",
  phone: store.phone?.trim(),
  email: store.email,
  website: store.web,
  lat: Number(store.lat),
  lng: Number(store.lng),
  marker: store.marker,
  tags: store.tags ? store.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
}));

const out = `window.LEAFLOCK_STORES = ${JSON.stringify(stores, null, 2)};\n`;
const root = dirname(dirname(fileURLToPath(import.meta.url)));
writeFileSync(join(root, "js", "stores.js"), out, "utf8");
console.log(`Exported ${stores.length} stores to js/stores.js`);