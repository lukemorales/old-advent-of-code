import assert from "assert";
import * as fs from "fs";
import path from "path";
import { beltProgramA, beltProgramB } from "./belt";
import { functionalProgramA, functionalProgramB } from "./functional";
import { programA, programB } from "./standard";

const INPUT = fs.readFileSync(path.join(__dirname, "_input.txt"), "utf-8");
const SAMPLE = fs.readFileSync(path.join(__dirname, "_sample.txt"), "utf-8");

const [a, b, fa, fb, ba, bb] = [
  programA,
  programB,
  functionalProgramA,
  functionalProgramB,
  beltProgramA,
  beltProgramB,
].map((fn) => fn(INPUT));

assert.deepStrictEqual(programA(SAMPLE), 24000);
assert.deepStrictEqual(programB(SAMPLE), 45000);

console.log(
  `${path.basename(__dirname)} => Part A: ${a} (${
    a === fa && fa === ba
  }) | Part B: ${b} (${b === fb && fb === bb})`
);
