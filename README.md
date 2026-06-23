# LeafLock Store v2

Standalone LeafLock ecommerce site (separate from the live Shopify theme).

## Local dev

```bash
npm install
npm run dev
```

Open http://localhost:3848

## Deploy on Render

1. Push this repo to GitHub.
2. In [Render](https://render.com), **New → Blueprint** and connect the repo (uses `render.yaml`),  
   **or** **New → Web Service** → connect repo → Build: `npm install` → Start: `npm start`.
3. Render sets `PORT` automatically. First deploy may take a few minutes on the free tier.

## Checkout

PayPal Friends & Family via `paypal.me/leaflockstore` (configured in `js/config.js`).