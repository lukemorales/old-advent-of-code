import assert from "assert";
import * as fs from "fs";
import path from "path";
import { parseChallengeInput } from "../../utils/parse-challenge-input";
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

parseChallengeInput(SAMPLE).forEach((sampleInput, sampleLine) => {
  assert.deepStrictEqual(programA(sampleInput), [7, 5, 6, 10, 11][sampleLine]);
  assert.deepStrictEqual(programB(sampleInput), [19, 23, 23, 29, 26][sampleLine]);
});

console.log(
  `${path.basename(__dirname)} => Part A: ${a} (${a === fa}) | Part B: ${b} (${
    b === fb
  })`
);
