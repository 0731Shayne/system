import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

test("ships six detailed engineering architectures", () => {
  for (const scenario of ["家用变频空调", "商用多联机空调", "三相组串逆变器", "工业伺服驱动器", "储能双向 PCS", "48V 低压 BMS"]) {
    assert.match(page, new RegExp(scenario));
  }
});

test("renders interactive SVG and official product links", () => {
  assert.match(page, /id="system-diagram"/);
  assert.match(page, /downloadSvg/);
  assert.match(page, /https:\/\/www\.ti\.com\/product\//);
  assert.match(page, /UCC21520/);
  assert.match(page, /BQ76952/);
  assert.match(readme, /TI 官方产品页/);
});

test("states ownership clearly and excludes Southchip material", () => {
  assert.match(page, /不隶属于 Texas Instruments/);
  assert.match(page, /未复制 TI 官方框图或页面代码/);
  assert.doesNotMatch(page, /Southchip|南芯|SC\d{3,}/i);
});
