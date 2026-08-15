import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders AME Balance Care with free and pro plans", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>AME Balance Care/);
  assert.match(html, /Registro directo/);
  assert.match(html, /Plan activo/);
  assert.match(html, /AME PRO/);
  assert.match(html, /BH acumulado/);
  assert.match(html, /Bibliografía sustentatoria/);
  assert.match(html, /中文/);
});

test("ships the direct-entry and professional export capabilities", async () => {
  const page = await import("node:fs/promises").then(({readFile})=>readFile(new URL("../app/page.tsx", import.meta.url), "utf8"));
  assert.match(page, /function addMovement/);
  assert.match(page, /function exportReport/);
  assert.match(page, /function exportWord/);
  assert.match(page, /window\.print/);
  assert.match(page, /freeLimit = 12/);
  assert.match(page, /\/api\/balances/);
  assert.match(page, /Heces líquidas o cuantificadas/);
  assert.match(page, /Secreción por fístula/);
  assert.match(page, /Aspirado nasogástrico/);
  assert.match(page, /filas separadas conservando la misma hora/);
});
