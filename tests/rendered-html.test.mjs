import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the YUNO homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>YUNO — Teach what you know\. Learn what you want\. \| YUNO<\/title>/i);
  assert.match(html, /Teach what you know\./);
  assert.match(html, /Learn what you want\./);
  assert.match(html, /Skill Hours/);
  assert.match(html, /href="\/discover"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("server-renders Discover and removes starter artifacts", async () => {
  const response = await render("/discover");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Discover people &amp; skills — YUNO \| YUNO<\/title>/i);
  assert.match(html, /What do you want to learn today\?/);
  assert.match(html, /96(?:<!-- -->)?% Skill Match/);
  assert.match(html, /4(?:<!-- -->)?\.5/);

  const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("app/_sites-preview", projectRoot)));
});
