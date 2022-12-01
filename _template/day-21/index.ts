import * as fs from "fs";
import path from "path";
import { functionalProgramA, functionalProgramB } from "./functional";
import { programA, programB } from "./standard";

const input = fs.readFileSync(path.join(__dirname, "_input.txt"), "utf-8");

const [a, b, fa, fb] = [
  programA,
  programB,
  functionalProgramA,
  functionalProgramB,
].map((fn) => fn(input));

console.log({ A: a, B: b });
console.log({ equalA: a === fa, equalB: b === fb });
