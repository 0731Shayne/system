import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /交互式系统框图/);
  assert.match(html, /空调室内机/);
  assert.match(html, /咖啡机/);
  assert.match(html, /Sensors/);
  assert.match(html, /Analog front-end/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Southchip|南芯|SYSTEM ATLAS/i);
});
