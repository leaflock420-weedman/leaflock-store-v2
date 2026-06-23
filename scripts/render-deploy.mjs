import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const REPO = "leaflock-store-v2";
const SERVICE_NAME = "leaflock-store";
const ONRENDER = "leaflock-store.onrender.com";
const GITHUB_REPO = "https://github.com/leaflock420-weedman/leaflock-store-v2";
const PROFILE_CANDIDATES = [
  path.join(root, ".chrome-deploy-profile"),
  path.join(path.dirname(root), "leaflock-pharmacy-crm", ".chrome-jsonbin-profile"),
  path.join(path.dirname(root), "leaflock-pharmacy-crm", ".chrome-render-profile"),
];
const CDP_PORTS = [9225, 9224, 9223, 9222, 9333];
const DEPLOY_PROFILE = path.join(root, ".chrome-deploy-profile");

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function screenshot(page, name) {
  const file = path.join(root, name);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`Screenshot: ${name}`);
}

async function connectCdp() {
  for (const port of CDP_PORTS) {
    try {
      const browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
      console.log(`Connected to Chrome CDP on port ${port}`);
      return browser;
    } catch {}
  }
  return null;
}

async function launchDebugChrome() {
  const { spawn } = await import("child_process");
  const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  await mkdir(DEPLOY_PROFILE, { recursive: true });
  spawn(
    chrome,
    [
      `--remote-debugging-port=9225`,
      `--user-data-dir=${DEPLOY_PROFILE}`,
      "--no-first-run",
      "--no-default-browser-check",
      `https://render.com/deploy?repo=${encodeURIComponent(GITHUB_REPO)}`,
    ],
    { detached: true, stdio: "ignore" }
  ).unref();
  console.log("Started Chrome on debug port 9225");
  for (let i = 0; i < 20; i++) {
    await sleep(1000);
    const browser = await connectCdp();
    if (browser) return browser;
  }
  return null;
}

async function clickFirst(page, makers, timeout = 4000) {
  for (const make of makers) {
    try {
      const el = make(page).first();
      if (await el.isVisible({ timeout })) {
        await el.click();
        return true;
      }
    } catch {}
  }
  return false;
}

async function waitForLogin(page) {
  const body = await page.locator("body").innerText().catch(() => "");
  if (!/sign in to render/i.test(body)) return true;

  console.log("Sign in to Render in the Chrome window (up to 3 minutes)...");
  const start = Date.now();
  while (Date.now() - start < 180000) {
    await sleep(3000);
    const text = await page.locator("body").innerText().catch(() => "");
    if (!/sign in to render/i.test(text)) {
      console.log("Render login detected");
      return true;
    }
  }
  return false;
}

async function openExistingService(page) {
  const link = page.getByRole("link", { name: new RegExp(SERVICE_NAME, "i") }).first();
  if (await link.isVisible({ timeout: 5000 }).catch(() => false)) {
    await link.click();
    await sleep(3000);
    return true;
  }
  return false;
}

async function fillBlueprintName(page) {
  const makers = [
    (p) => p.getByLabel(/blueprint name/i),
    (p) => p.locator("input").filter({ has: p.locator("xpath=ancestor::*[contains(.,'Blueprint Name')][1]") }),
  ];

  for (const make of makers) {
    const input = make(page).first();
    if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
      await input.fill("leaflock-store-v2");
      console.log("Filled Blueprint Name");
      return true;
    }
  }
  return false;
}

async function deployViaOneClick(page) {
  console.log("Opening one-click Blueprint deploy...");
  await page.goto(`https://render.com/deploy?repo=${encodeURIComponent(GITHUB_REPO)}`, {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
  await sleep(5000);
  await waitForLogin(page);
  await fillBlueprintName(page);
  await screenshot(page, "render-step-1-deploy.png");

  const clicked = await clickFirst(page, [
    (p) => p.getByRole("button", { name: /deploy blueprint/i }),
    (p) => p.getByRole("button", { name: /^apply$/i }),
    (p) => p.getByRole("button", { name: /^continue$/i }),
    (p) => p.locator("button:has-text('Deploy Blueprint')"),
    (p) => p.locator("button:has-text('Apply')"),
  ], 10000);

  if (clicked) {
    console.log("One-click deploy button clicked");
    await sleep(5000);
    await screenshot(page, "render-step-2-submitted.png");
    return true;
  }
  return false;
}

async function deployViaPublicRepo(page) {
  console.log("Using public Git repository URL on Blueprint page...");
  await page.goto("https://dashboard.render.com/select-repo?type=blueprint", {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
  await sleep(4000);
  await waitForLogin(page);

  const input = page.locator("input").filter({ has: page.locator("xpath=ancestor::*[contains(.,'Public Git Repository')]") }).first();
  const publicInput = page.getByPlaceholder(/github\.com/i).or(page.locator("input[value*='github.com']")).first();
  const target = (await publicInput.isVisible({ timeout: 3000 }).catch(() => false)) ? publicInput : input;

  if (await target.isVisible({ timeout: 5000 }).catch(() => false)) {
    await target.click();
    await target.fill(GITHUB_REPO);
    console.log("Filled public repo URL");
  }

  const continued = await clickFirst(page, [
    (p) => p.locator("button:has-text('Continue')"),
    (p) => p.getByRole("button", { name: /^continue$/i }),
  ], 5000);

  if (!continued) {
    console.log("Continue button not found");
    await screenshot(page, "render-step-public-fail.png");
    return false;
  }

  await sleep(5000);
  await fillBlueprintName(page);
  await screenshot(page, "render-step-3-blueprint.png");

  const deployed = await clickFirst(page, [
    (p) => p.getByRole("button", { name: /deploy blueprint/i }),
    (p) => p.getByRole("button", { name: /^apply$/i }),
    (p) => p.locator("button:has-text('Deploy Blueprint')"),
    (p) => p.locator("button:has-text('Apply')"),
  ], 10000);

  if (deployed) {
    console.log("Deploy Blueprint clicked (public repo flow)");
    await sleep(5000);
    await screenshot(page, "render-step-4-submitted.png");
    return true;
  }
  return false;
}

async function deployViaWebService(page) {
  console.log("Creating Web Service directly...");
  await page.goto(`https://dashboard.render.com/new/web?repo=${encodeURIComponent(GITHUB_REPO)}`, {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
  await sleep(5000);
  await waitForLogin(page);
  await screenshot(page, "render-step-web.png");

  const created = await clickFirst(page, [
    (p) => p.getByRole("button", { name: /create web service/i }),
    (p) => p.getByRole("button", { name: /^deploy/i }),
    (p) => p.locator("button:has-text('Create Web Service')"),
  ], 12000);

  console.log(created ? "Create Web Service clicked" : "Create Web Service not found");
  return created;
}

async function waitForLive(page) {
  console.log("Waiting for service page to show LIVE...");
  const start = Date.now();
  while (Date.now() - start < 480000) {
    const text = await page.locator("body").innerText().catch(() => "");
    if (/live|deployed|your service is live/i.test(text)) {
      console.log("Service appears LIVE on Render");
      return true;
    }
    await sleep(15000);
    await page.reload({ waitUntil: "domcontentloaded" }).catch(() => {});
  }
  return false;
}

async function verifyLive() {
  const url = `https://${ONRENDER}/`;
  for (let attempt = 1; attempt <= 30; attempt++) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      console.log(`${url} -> ${res.status} (attempt ${attempt})`);
      if (res.status === 200) return true;
    } catch (e) {
      console.log(`${url} -> error: ${e.message} (attempt ${attempt})`);
    }
    await sleep(15000);
  }
  return false;
}

async function main() {
  let context;
  let ownsContext = false;

  let browser = await connectCdp();
  if (!browser) browser = await launchDebugChrome();
  if (browser) {
    context = browser.contexts()[0];
  } else {
    const profile = PROFILE_CANDIDATES.find((p) => existsSync(p)) || DEPLOY_PROFILE;
    console.log(`Launching Chrome with profile: ${profile}`);
    await mkdir(profile, { recursive: true });
    context = await chromium.launchPersistentContext(profile, {
      channel: "chrome",
      headless: false,
      viewport: { width: 1440, height: 900 },
      args: ["--disable-blink-features=AutomationControlled", "--remote-debugging-port=9225"],
    });
    ownsContext = true;
  }

  const page = context.pages().find((p) => /render/i.test(p.url())) || context.pages()[0] || (await context.newPage());
  await page.bringToFront();
  await page.goto("https://dashboard.render.com/", { waitUntil: "domcontentloaded", timeout: 120000 });
  await sleep(3000);
  await waitForLogin(page);

  let onService = await openExistingService(page);
  if (!onService) {
    let ok = await deployViaOneClick(page);
    if (!ok) ok = await deployViaPublicRepo(page);
    if (!ok) ok = await deployViaWebService(page);

    await sleep(5000);
    await page.goto("https://dashboard.render.com/", { waitUntil: "domcontentloaded" });
    onService = await openExistingService(page);
  }

  if (onService) await waitForLive(page);

  await screenshot(page, "render-deploy.png");

  const ok = await verifyLive();
  console.log(ok ? `SUCCESS — https://${ONRENDER}` : `Deploy may still be building — check https://${ONRENDER}`);

  if (ownsContext) console.log("Chrome left open for any remaining steps.");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});