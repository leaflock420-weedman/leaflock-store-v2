import { chromium } from "playwright";

const CDP_PORTS = [9225, 9224, 9223, 9222];

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  let browser;
  for (const port of CDP_PORTS) {
    try {
      browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
      break;
    } catch {}
  }
  if (!browser) {
    console.log("No Chrome CDP");
    process.exit(1);
  }

  const page = browser.contexts()[0].pages()[0] || (await browser.contexts()[0].newPage());
  await page.goto("https://dashboard.render.com/", { waitUntil: "domcontentloaded", timeout: 120000 });
  await sleep(3000);

  const link = page.getByRole("link", { name: /leaflock-store/i }).first();
  if (await link.isVisible({ timeout: 8000 }).catch(() => false)) {
    await link.click();
    await sleep(4000);
  } else {
    await page.goto("https://dashboard.render.com/", { waitUntil: "domcontentloaded" });
    await sleep(2000);
  }

  const text = await page.locator("body").innerText();
  const lines = text.split("\n").filter((l) => /live|deploy|build|failed|leaflock|onrender/i.test(l)).slice(0, 30);
  console.log(lines.join("\n"));

  const urlMatch = text.match(/https?:\/\/[a-z0-9-]+\.onrender\.com/i);
  if (urlMatch) console.log(`URL: ${urlMatch[0]}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});