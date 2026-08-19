import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("official YUNO brand assets exist", async () => {
  await access("public/img/logo.png");
  await access("public/img/favicon.png");
});

test("local development uses port 3001", async () => {
  const pkg = JSON.parse(await readFile("package.json", "utf8"));

  assert.equal(pkg.scripts.dev, "next dev -p 3001");
  assert.equal(pkg.scripts.start, "next start -p 3001");
});

test("legacy starter infrastructure is removed", async () => {
  for (const path of [
    ".openai",
    "worker",
    "build",
    "examples",
    "vite.config.ts",
    "app/chatgpt-auth.ts"
  ]) {
    await assert.rejects(access(path));
  }
});

test("components reference the official YUNO assets", async () => {
  const logo = await readFile("app/components/Logo.tsx", "utf8");
  const home = await readFile("app/components/HomePage.tsx", "utf8");
  const layout = await readFile("app/layout.tsx", "utf8");

  assert.match(logo, /\/img\/logo\.png/);
  assert.match(logo, /\/img\/favicon\.png/);
  assert.match(home, /\/img\/favicon\.png/);
  assert.match(layout, /\/img\/favicon\.png/);
});
