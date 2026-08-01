import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

test("ships six original scenarios", () => {
  for (const scenario of ["智能气候环", "光储微电网", "协作机器人单元", "轻型电驱平台", "数据中心电源架", "智慧充电枢纽"]) {
    assert.match(page, new RegExp(scenario));
  }
});

test("marks every component as fictional demo content", () => {
  assert.match(page, /所有型号与参数均为界面演示用途/);
  assert.match(page, /DEMO-GATE-06/);
  assert.match(readme, /fictional/);
});

test("contains no excluded brand or part-number references", () => {
  assert.doesNotMatch(page, /Southchip|南芯|Texas Instruments|SC\d{3,}/i);
});
