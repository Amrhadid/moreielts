/**
 * Browser smoke test of the public surface: renders, navigation, the Arabic
 * interface, PWA files. Needs no backend (a dead Supabase URL is fine).
 *
 *   npm run build && npx vite preview --port 4173 &
 *   BASE_URL=http://localhost:4173 npm run test:e2e
 */
import assert from "node:assert/strict";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4173";
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

let passed = 0;
async function check(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}\n    ${err.message}`);
    process.exitCode = 1;
  }
}

await check("landing page renders for visitors", async () => {
  await page.goto(BASE + "/");
  await page.waitForLoadState("networkidle");
  assert.match(await page.title(), /MoreIELTS/);
  assert.ok(await page.locator("a[href='/login'], a[href='/signup']").count());
});

await check("strategy guides list every question type", async () => {
  await page.goto(BASE + "/guides");
  assert.equal(await page.locator("a[href^='/guides/']").count(), 15);
});

await check("a guide has its steps, traps and example", async () => {
  await page.goto(BASE + "/guides/true-false-not-given");
  await page.getByRole("heading", { name: "True / False / Not Given" }).waitFor();
  assert.ok(await page.getByText("Common traps").isVisible());
  assert.ok(await page.getByText("Worked example").isVisible());
  assert.match(await page.title(), /True \/ False \/ Not Given/);
});

await check("unknown guide is a not-found page", async () => {
  const res = await page.goto(BASE + "/guides/no-such-type");
  assert.ok(res.status() === 404 || (await page.getByText(/not found/i).count()) > 0);
});

await check("vocabulary asks visitors to sign in (Premium only)", async () => {
  await page.goto(BASE + "/vocabulary");
  await page.getByText("Sign in to continue").waitFor();
});

await check("learn page is public and links to guides", async () => {
  await page.goto(BASE + "/learn");
  assert.ok((await page.locator("a[href^='/guides/']").count()) >= 15);
});

await check("Arabic interface flips the page to right-to-left", async () => {
  await page.goto(BASE + "/learn");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Switch interface language" }).click();
  await page.waitForFunction(() => document.documentElement.dir === "rtl");
  assert.equal(await page.evaluate(() => document.documentElement.lang), "ar");
  await page.getByRole("button", { name: "Switch interface language" }).click();
  await page.waitForFunction(() => document.documentElement.dir === "ltr");
});

await check("PWA manifest, service worker and sitemap are served", async () => {
  for (const path of ["/manifest.webmanifest", "/sw.js", "/sitemap.xml", "/robots.txt", "/offline.html"]) {
    const res = await page.request.get(BASE + path);
    assert.equal(res.status(), 200, path);
  }
  const manifest = await (await page.request.get(BASE + "/manifest.webmanifest")).json();
  assert.equal(manifest.display, "standalone");
});

await check("protected pages ask visitors to sign in", async () => {
  await page.goto(BASE + "/review");
  await page.getByText("Sign in to continue").waitFor();
});

await check("no uncaught page errors", async () => {
  assert.deepEqual(errors, []);
});

await browser.close();
console.log(`${passed} checks passed`);
