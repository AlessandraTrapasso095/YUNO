import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render(pathname = "/", requestHeaders = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html", ...requestHeaders },
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
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<title>YUNO — Teach what you know\. Learn what you want\.<\/title>/i);
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
  assert.match(html, /<title>Discover people &amp; skills — YUNO<\/title>/i);
  assert.match(html, /What do you want to learn today\?/);
  assert.match(html, /96(?:<!-- -->)?%/);
  assert.match(html, /Skill Match/);
  assert.match(html, /4(?:<!-- -->)?\.5/);

  const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("app/_sites-preview", projectRoot)));
});

test("server-renders the complete Italian locale from the persisted preference", async () => {
  const [homeResponse, discoverResponse] = await Promise.all([
    render("/", { cookie: "yuno_locale=it" }),
    render("/discover", { cookie: "yuno_locale=it" }),
  ]);

  const homeHtml = await homeResponse.text();
  const discoverHtml = await discoverResponse.text();

  assert.match(homeHtml, /<html lang="it">/);
  assert.match(homeHtml, /<title>YUNO — Insegna ciò che sai\. Impara ciò che vuoi\.<\/title>/);
  assert.match(homeHtml, /Insegna ciò che sai./);
  assert.match(homeHtml, /Tutti sanno qualcosa che vale la pena condividere./);
  assert.match(homeHtml, /Unisciti a YUNO/);
  assert.doesNotMatch(homeHtml, />Start matching</);

  assert.match(discoverHtml, /<html lang="it">/);
  assert.match(discoverHtml, /<title>Scopri persone e competenze — YUNO<\/title>/);
  assert.match(discoverHtml, /Cosa vuoi imparare oggi\?/);
  assert.match(discoverHtml, /VOGLIO IMPARARE/);
  assert.match(discoverHtml, /Le tue Skill Hours/);
  assert.doesNotMatch(discoverHtml, />What do you want to learn today\?</);
});

test("detects Italian browsers on their first visit", async () => {
  const response = await render("/", { "accept-language": "it-IT,it;q=0.9,en;q=0.8" });
  const html = await response.text();

  assert.match(html, /<html lang="it">/);
  assert.match(html, /Inizia a scoprire/);
});
