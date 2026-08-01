import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

test("ships two complete engineering architectures", () => {
  for (const scenario of ["空调室内机", "咖啡机", "环境与人体传感", "电机与负载功率级", "电流与电压检测"]) {
    assert.match(page, new RegExp(scenario));
  }
});

test("renders interactive SVG and official product links", () => {
  assert.match(page, /id="system-diagram"/);
  assert.match(page, /downloadSvg/);
  assert.match(page, /https:\/\/www\.ti\.com\.cn\/product\/cn\//);
  assert.match(page, /IWRL6432AOP/);
  assert.match(page, /DRV8304/);
  assert.match(readme, /TI 官方产品页/);
});

test("states ownership clearly and excludes Southchip material", () => {
  assert.match(readme, /不是 TI 官方页面/);
  assert.match(readme, /没有复制 TI 的 SVG 文件或网页代码/);
  assert.doesNotMatch(page, /Southchip|南芯|SC\d{3,}|SYSTEM ATLAS/i);
});
