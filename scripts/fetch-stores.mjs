const token = "70c255c5ecada3b898f44697af57490e";

const types = [
  "$app:bss_sl_data_v1",
  "$app:bss_sl_location_v1",
  "bss_sl_data_v1",
  "bss_sl_location",
  "store_locator",
  "bss_store_locator",
  "ta_mappy_store_locator",
  "store_location",
  "retail_store",
  "stockist",
  "location",
  "mappy_store",
];

async function query(type) {
  const q = `{ metaobjects(type: "${type}", first: 50) { nodes { handle fields { key value } } } }`;
  const res = await fetch("https://zya5ny-rw.myshopify.com/api/2025-01/graphql.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query: q }),
  });
  return res.json();
}

for (const type of types) {
  const json = await query(type);
  const nodes = json?.data?.metaobjects?.nodes || [];
  if (nodes.length) {
    console.log("TYPE", type, nodes.length);
    console.log(JSON.stringify(nodes, null, 2));
  } else if (json.errors?.length) {
    console.log("ERR", type, json.errors[0].message);
  }
}

// Try BSS app proxy endpoint
const endpoints = [
  "https://www.leaflock.com.au/apps/locator/locations",
  "https://www.leaflock.com.au/apps/locator/get-locations",
  "https://www.leaflock.com.au/apps/locator/stores",
  "https://www.leaflock.com.au/apps/locator/config",
];
for (const url of endpoints) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    if (res.ok && text.length > 10) {
      console.log("ENDPOINT", url, text.slice(0, 500));
    }
  } catch (e) {
    console.log("FAIL", url, e.message);
  }
}