import assert from "assert";
import { parseChallengeInput } from "../../utils/parse-challenge-input";

const splitIntoMatrix = (str: string, length: number) => {
  const chunks: Array<string | null> = [];

  for (let i = 0, charsLength = str.length; i < charsLength; i += 4) {
    chunks.push(str.substring(i, i + 3).trim() || null);
  }

  if (chunks.length < length) {
    const previousLength = chunks.length;
    chunks.length = length;

    return chunks.fill(null, previousLength, length);
  }

  return chunks;
};

const performSetup = (input: string) => {
  const data = parseChallengeInput(input);

  const stacksPositionIndex = data.findIndex((str) => str.startsWith(" 1"));
  const numberOfStacks =
    data[stacksPositionIndex]
      ?.trim()
      .match(/(\d)$/g)
      ?.map((str) => parseInt(str))[0] ?? 0;

  const stacks = data
    .splice(0, stacksPositionIndex)
    .map((str) => splitIntoMatrix(str, numberOfStacks));

  const instructions = data
    .filter((str) => str.startsWith("move"))
    .map((instruction) => {
      const groups =
        /move (?<crates>[0-9]+) from (?<target>[0-9]+) to (?<destination>[0-9])/i.exec(
          instruction
        )?.groups;

      if (!groups) {
        throw new Error(`Failed to parse instruction (${instruction})`);
      }

      return groups as unknown as Record<
        "crates" | "target" | "destination",
        string
      >;
    });

  return { stacks, instructions, numberOfStacks };
};

const createArrayWithSize = <T>(
  size: number,
  cb: (a: undefined, i: number) => T
) => Array.from({ length: size }, cb);

export const programA = (input: string) => {
  const { instructions, numberOfStacks, stacks } = performSetup(input);

  for (const instruction of instructions) {
    const targetIndex = parseInt(instruction.target) - 1;
    const destinationIndex = parseInt(instruction.destination) - 1;

    let cratesToMove = parseInt(instruction.crates);

    while (cratesToMove--) {
      let crateLine = -1;

      for (let i = 0; i <= stacks.length; i++) {
        const crate = stacks[i]?.[targetIndex];

        if (!crate) {
          continue;
        }

        crateLine = i;
        break;
      }

      if (crateLine < 0) {
        throw new Error(`Unable to find crate at stack ${targetIndex}`);
      }

      const crate = stacks[crateLine]![targetIndex]!;
      stacks[crateLine]![targetIndex] = null;

      let rows = stacks.length;

      while (rows--) {
        const spaceOrCrate = stacks[rows]?.[destinationIndex];

        if (spaceOrCrate) {
          if (rows === 0) {
            stacks.unshift(
              createArrayWithSize(numberOfStacks, (_, i) =>
                i === destinationIndex ? crate : null
              )
            );
            break;
          }

          continue;
        }

        stacks[rows]![destinationIndex] = crate;
        break;
      }
    }
  }

  const topCratesByStack = stacks.reduce((lookup, stack) => {
    const existingCrates = stack.filter((createOrEmpty) => !!createOrEmpty);

    for (const crate of existingCrates) {
      const crateIndex = stack.indexOf(crate);

      const value = stack[crateIndex]!;
      stack[crateIndex] = null;

      if (!lookup[crateIndex]) {
        lookup[crateIndex] = value.substring(1, 2);
      }
    }

    return lookup;
  }, {} as Record<number, string>);

  return Object.values(topCratesByStack).join("");
};

export const programB = (input: string) => {
  const { instructions, numberOfStacks, stacks } = performSetup(input);

  for (const instruction of instructions) {
    const targetIndex = parseInt(instruction.target) - 1;
    const destinationIndex = parseInt(instruction.destination) - 1;

    let crateLine = -1;

    for (let i = 0; i <= stacks.length; i++) {
      const crate = stacks[i]?.[targetIndex];

      if (!crate) {
        continue;
      }

      crateLine = i;
      break;
    }

    if (crateLine < 0) {
      throw new Error(`Unable to find crate at stack ${targetIndex}`);
    }

    const cratesToMove = parseInt(instruction.crates);

    const movingCrates: string[] = [];

    for (let i = 0; i < cratesToMove; i++) {
      const currentLine = crateLine + i;

      const crate = stacks[currentLine]![targetIndex]!;
      stacks[currentLine]![targetIndex] = null;

      movingCrates.unshift(crate);
    }

    let rows = stacks.length;

    while (rows--) {
      const spaceOrCrate = stacks[rows]?.[destinationIndex];

      if (spaceOrCrate) {
        if (rows === 0) {
          let crate = movingCrates.shift();

          while (crate) {
            const value = crate;
            crate = movingCrates.shift();

            assert.ok(value);

            stacks.unshift(
              createArrayWithSize(numberOfStacks, (_, i) =>
                i === destinationIndex ? value : null
              )
            );
          }

          break;
        }

        continue;
      }

      const crate = movingCrates.shift();

      if (!crate) {
        break;
      }

      stacks[rows]![destinationIndex] = crate;

      if (rows === 0) {
        let crate = movingCrates.shift();

        while (crate) {
          const value = crate;
          crate = movingCrates.shift();

          assert.ok(value);

          stacks.unshift(
            createArrayWithSize(numberOfStacks, (_, i) =>
              i === destinationIndex ? value : null
            )
          );
        }
      }
    }
  }

  const topCratesByStack = stacks.reduce((lookup, stack) => {
    const existingCrates = stack.filter((createOrEmpty) => !!createOrEmpty);

    for (const crate of existingCrates) {
      const crateIndex = stack.indexOf(crate);

      const value = stack[crateIndex]!;
      stack[crateIndex] = null;

      if (!lookup[crateIndex]) {
        lookup[crateIndex] = value.substring(1, 2);
      }
    }

    return lookup;
  }, {} as Record<number, string>);

  return Object.values(topCratesByStack).join("");
};
