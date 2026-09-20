import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders free AME Balance Care and its clinical disclaimer", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html lang="en"/);
  assert.match(html, /AME Balance Care/);
  assert.match(html, /Clinical and legal notice/);
  assert.match(html, /Supporting bibliography/);
  assert.match(html, /Free, all features/);
  assert.match(html, /English/);
  assert.match(html, /Español/);
  assert.match(html, /简体中文/);
  assert.match(html, /Português/);
  assert.match(html, /Cumulative fluid balance by hospitalization/);
  assert.doesNotMatch(html, /Store\/backend integration pending\./);
  assert.doesNotMatch(html, /Comparar planes/);
});

test("ships unrestricted direct entry, offline history and export", async () => {
  const page = await import("node:fs/promises").then(({readFile})=>readFile(new URL("../app/page.tsx", import.meta.url), "utf8"));
  assert.match(page, /function addMovement/);
  assert.match(page, /function exportReport/);
  assert.match(page, /function exportWord/);
  assert.match(page, /window\.print/);
  assert.doesNotMatch(page, /freeLimit = 12|canUsePro|setPlan\(/);
  assert.match(page, /ame_balance_days_v1/);
  assert.match(page, /function exportHistory/);
  assert.match(page, /navigator\.serviceWorker\.register/);
  assert.match(page, /Heces líquidas o cuantificadas/);
  assert.match(page, /Secreción por fístula/);
  assert.match(page, /Aspirado nasogástrico/);
  assert.match(page, /filas separadas conservando la misma hora/);
  assert.match(page, /baselineInsensible/);
  assert.match(page, /feverInsensible/);
  assert.match(page, /Temperatura máxima/);
  assert.match(page, /Frecuencia respiratoria/);
  assert.match(page, /Quemaduras o piel abierta/);
  assert.match(page, /Balance ajustado estimado/);

  const manifest = await import("node:fs/promises").then(({readFile})=>readFile(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"));
  assert.equal(JSON.parse(manifest).display, "standalone");
});
