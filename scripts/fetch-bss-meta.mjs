const token = "70c255c5ecada3b898f44697af57490e";

const queries = [
  `{ metaobject(handle: { handle: "bss_sl_metaobject_data", type: "$app:bss_sl_data" }) { fields { key value } } }`,
  `{ metaobject(handle: { handle: "bss_sl_metaobject_data", type: "$app:bss_sl_data_v1" }) { fields { key value } }`,
];

async function run(query) {
  const res = await fetch("https://zya5ny-rw.myshopify.com/api/2025-01/graphql.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query }),
  });
  return res.json();
}

for (const query of queries) {
  const json = await run(query);
  const fields = json?.data?.metaobject?.fields || [];
  console.log("fields:", fields.length, json.errors?.[0]?.message || "");
  for (const field of fields) {
    if (field.key === "locations" || field.key === "data" || field.value?.length > 200) {
      console.log("KEY", field.key, "LEN", field.value?.length);
      try {
        const parsed = JSON.parse(field.value);
        console.log(JSON.stringify(parsed, null, 2).slice(0, 12000));
      } catch {
        console.log(field.value?.slice(0, 500));
      }
    }
  }
}