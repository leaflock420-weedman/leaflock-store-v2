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

  const ctx = browser.contexts()[0];
  let page = ctx.pages().find((p) => /render/i.test(p.url())) || ctx.pages()[0];
  await page.bringToFront();

  const link = page.getByRole("link", { name: /^leaflock-store$/i }).first();
  if (await link.isVisible({ timeout: 5000 }).catch(() => false)) {
    await link.click();
    await sleep(4000);
  }

  const events = page.getByRole("link", { name: /events|logs/i }).first();
  if (await events.isVisible({ timeout: 3000 }).catch(() => false)) {
    await events.click();
    await sleep(3000);
  }

  const text = await page.locator("body").innerText();
  const interesting = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && /live|deploy|build|failed|error|success|npm|node|leaflock|onrender|status|running/i.test(l))
    .slice(0, 60);
  console.log(interesting.join("\n"));
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});