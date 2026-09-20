import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";

const requests = Number(process.env.LOAD_REQUESTS ?? 500);
const concurrency = Number(process.env.LOAD_CONCURRENCY ?? 25);
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("load", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
let cursor = 0;
const latencies = [];
let failures = 0;
const started = performance.now();

await Promise.all(Array.from({ length: concurrency }, async () => {
  while (cursor < requests) {
    cursor += 1;
    const before = performance.now();
    const response = await worker.fetch(new Request("http://localhost/"), env, ctx);
    await response.arrayBuffer();
    latencies.push(performance.now() - before);
    if (response.status !== 200) failures += 1;
  }
}));

latencies.sort((a, b) => a - b);
const elapsed = performance.now() - started;
const p95 = latencies[Math.floor(latencies.length * 0.95)] ?? 0;
const rps = requests / (elapsed / 1000);
assert.equal(failures, 0);
assert.ok(p95 < 2000, `p95 ${p95.toFixed(1)} ms exceeded 2000 ms`);
console.log(JSON.stringify({ requests, concurrency, failures, elapsedMs: +elapsed.toFixed(1), requestsPerSecond: +rps.toFixed(1), p95Ms: +p95.toFixed(1) }));
