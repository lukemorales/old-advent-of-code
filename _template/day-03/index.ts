import assert from "assert";
import * as fs from "fs";
import path from "path";
import { functionalProgramA, functionalProgramB } from "./functional";
import { programA, programB } from "./standard";

const INPUT = fs.readFileSync(path.join(__dirname, "_input.txt"), "utf-8");
const SAMPLE = fs.readFileSync(path.join(__dirname, "_sample.txt"), "utf-8");

const [a, b, fa, fb] = [
  programA,
  programB,
  functionalProgramA,
  functionalProgramB,
].map((fn) => fn(INPUT));

// @ts-expect-error
assert.deepStrictEqual(programA(SAMPLE), X);
// assert.deepStrictEqual(programB(SAMPLE), Y);

console.log(
  `${path.basename(__dirname)} => Part A: ${a} (${a === fa}) | Part B: ${b} (${
    b === fb
  })`
);
