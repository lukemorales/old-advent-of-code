import {
  option as O,
  string as S,
  number as N,
  readonlyArray as A,
  readonlyRecord as R,
  function as F,
} from "fp-ts";
import { parseChallengeInput } from "../../utils/parse-challenge-input";

const splitIntoMatrix = (length: number) => {
  return (str: string) => {
    const chunks: Array<O.Option<string>> = [];

    for (let i = 0, charsLength = str.length; i < charsLength; i += 4) {
      chunks.push(
        F.pipe(
          str.substring(i, i + 3),
          S.trim,
          O.fromPredicate((str) => !S.isEmpty(str))
        )
      );
    }

    if (chunks.length < length) {
      const previousLength = F.pipe(chunks, A.size);
      chunks.length = length;

      return chunks.fill(O.none, previousLength, length);
    }

    return chunks;
  };
};

const matchRegex = (regex: RegExp) => {
  return (str: string) => F.pipe(str.match(regex), O.fromNullable);
};

const getRegexGroups = (regex: RegExp) => {
  return (str: string) =>
    F.pipe(
      regex.exec(str),
      O.fromNullable,
      O.flatMapNullableK((match) => match?.groups)
    );
};

const getInstructionMetadata = (instruction: string) => {
  return F.pipe(
    instruction,
    getRegexGroups(
      /move (?<crates>[0-9]+) from (?<target>[0-9]+) to (?<destination>[0-9])/i
    ),
    O.map(
      F.unsafeCoerce<
        Record<string, string>,
        Record<"crates" | "target" | "destination", string>
      >
    ),
    O.getOrElse(() => {
      throw new Error(`Failed to parse instruction (${instruction})`);
    })
  );
};

const performSetup = (input: string) => {
  const data = parseChallengeInput(input);

  const stacksPositionIndex = F.pipe(
    data,
    A.findIndex(F.flow(S.startsWith(" 1"))),
    O.getOrElse(() => {
      throw new Error("Invalid input");
    })
  );

  const numberOfStacks = F.pipe(
    data,
    A.lookup(stacksPositionIndex),
    O.map(S.trim),
    O.flatMap(matchRegex(/(\d)$/g)),
    O.flatMap(F.flow(A.map(parseInt), A.head)),
    O.getOrElse(() => 0)
  );

  const stacks = F.pipe(
    data,
    A.takeLeft(stacksPositionIndex),
    A.map(splitIntoMatrix(numberOfStacks))
  );

  const instructions = F.pipe(
    data,
    A.filter(S.startsWith("move")),
    A.map(getInstructionMetadata)
  );

  return { stacks, instructions, numberOfStacks };
};

const createArrayWithSize = <T>(
  size: number,
  callback: (a: undefined, i: number) => T
) => Array.from({ length: size }, callback);

export const functionalProgramA = (input: string) => {
  const { instructions, numberOfStacks, stacks } = performSetup(input);

  const mutableStacks = F.pipe(
    stacks,
    F.unsafeCoerce<unknown, Array<O.Option<string>[]>>
  );

  for (const instruction of instructions) {
    const targetIndex = F.pipe(instruction.target, parseInt, N.Field.sub(1));
    const destinationIndex = F.pipe(
      instruction.destination,
      parseInt,
      N.Field.sub(1)
    );

    let cratesToMove = F.pipe(instruction.crates, parseInt);

    while (cratesToMove--) {
      let crateRowIndex = -1;

      for (let i = 0; i <= mutableStacks.length; i++) {
        const crate = F.pipe(
          mutableStacks,
          A.lookup(i),
          O.flatMap(A.lookup(targetIndex)),
          O.flatten
        );

        if (O.isNone(crate)) {
          continue;
        }

        crateRowIndex = i;
        break;
      }

      if (crateRowIndex < 0) {
        throw new Error(`Unable to find crate at stack ${targetIndex}`);
      }

      const crate = F.pipe(
        mutableStacks,
        A.lookup(crateRowIndex),
        O.flatMap(A.lookup(targetIndex)),
        O.flatten
      );

      F.pipe(
        mutableStacks,
        A.lookup(crateRowIndex),
        O.tap((currentRow) => {
          currentRow[targetIndex] = O.none;
          return O.none;
        })
      );

      let currentRow = F.pipe(mutableStacks, A.size);

      while (currentRow--) {
        const someCrateOrNone = F.pipe(
          mutableStacks,
          A.lookup(currentRow),
          O.flatMap(A.lookup(destinationIndex)),
          O.flatten
        );

        if (O.isSome(someCrateOrNone)) {
          if (currentRow === 0) {
            mutableStacks.unshift(
              createArrayWithSize(numberOfStacks, (_, i) =>
                F.pipe(
                  crate,
                  O.flatMap(O.fromPredicate(() => i === destinationIndex))
                )
              )
            );
            break;
          }

          continue;
        }

        F.pipe(
          mutableStacks,
          A.lookup(currentRow),
          O.tap((currentRow) => {
            currentRow[destinationIndex] = crate;
            return O.none;
          })
        );
        break;
      }
    }
  }

  const topCratesByStack = F.pipe(
    mutableStacks,
    A.reduce({} as Record<number, O.Option<string>>, (lookup, stack) => {
      const existingCrates = F.pipe(stack, A.filter(O.isSome));

      for (const crate of existingCrates) {
        const crateIndex = stack.indexOf(crate);

        const value = F.pipe(stack, A.lookup(crateIndex), O.flatten);
        stack[crateIndex] = O.none;

        if (!lookup[crateIndex]) {
          lookup[crateIndex] = F.pipe(
            value,
            O.map((str) => str.substring(1, 2))
          );
        }
      }

      return lookup;
    })
  );

  return F.pipe(topCratesByStack, R.compact, Object.values, (values) =>
    values.join("")
  );
};

export const functionalProgramB = (input: string) => {
  const { instructions, numberOfStacks, stacks } = performSetup(input);

  const mutableStacks = F.pipe(
    stacks,
    F.unsafeCoerce<unknown, Array<O.Option<string>[]>>
  );

  for (const instruction of instructions) {
    const targetIndex = F.pipe(instruction.target, parseInt, N.Field.sub(1));
    const destinationIndex = F.pipe(
      instruction.destination,
      parseInt,
      N.Field.sub(1)
    );

    let crateRowIndex = -1;

    for (let i = 0; i <= mutableStacks.length; i++) {
      const crate = F.pipe(
        mutableStacks,
        A.lookup(i),
        O.flatMap(A.lookup(targetIndex)),
        O.flatten
      );

      if (O.isNone(crate)) {
        continue;
      }

      crateRowIndex = i;
      break;
    }

    if (crateRowIndex < 0) {
      throw new Error(`Unable to find crate at stack ${targetIndex}`);
    }

    const cratesToMove = F.pipe(instruction.crates, parseInt);

    const movingCrates: O.Option<string>[] = [];

    for (let i = 0; i < cratesToMove; i++) {
      const currentRowIndex = crateRowIndex + i;

      const crate = F.pipe(
        mutableStacks,
        A.lookup(currentRowIndex),
        O.flatMap(A.lookup(targetIndex)),
        O.flatten
      );

      F.pipe(
        mutableStacks,
        A.lookup(currentRowIndex),
        O.tap((currentRow) => {
          currentRow[targetIndex] = O.none;
          return O.none;
        })
      );

      movingCrates.unshift(crate);
    }

    let currentRow = mutableStacks.length;

    while (currentRow--) {
      const someCrateOrNone = F.pipe(
        mutableStacks,
        A.lookup(currentRow),
        O.flatMap(A.lookup(destinationIndex)),
        O.flatten
      );

      if (O.isSome(someCrateOrNone)) {
        if (currentRow === 0) {
          let crate = F.pipe(movingCrates.shift(), O.fromNullable, O.flatten);

          while (O.isSome(crate)) {
            mutableStacks.unshift(
              createArrayWithSize(numberOfStacks, (_, i) =>
                F.pipe(
                  crate,
                  O.flatMap(O.fromPredicate(() => i === destinationIndex))
                )
              )
            );

            crate = F.pipe(movingCrates.shift(), O.fromNullable, O.flatten);
          }

          break;
        }

        continue;
      }

      const crate = F.pipe(movingCrates.shift(), O.fromNullable, O.flatten);

      if (O.isNone(crate)) {
        break;
      }

      F.pipe(
        mutableStacks,
        A.lookup(currentRow),
        O.tap((currentRow) => {
          currentRow[destinationIndex] = crate;
          return O.none;
        })
      );

      if (currentRow === 0) {
        let crate = F.pipe(movingCrates.shift(), O.fromNullable, O.flatten);

        while (O.isSome(crate)) {
          mutableStacks.unshift(
            createArrayWithSize(numberOfStacks, (_, i) =>
              F.pipe(
                crate,
                O.flatMap(O.fromPredicate(() => i === destinationIndex))
              )
            )
          );

          crate = F.pipe(movingCrates.shift(), O.fromNullable, O.flatten);
        }
      }
    }
  }

  const topCratesByStack = F.pipe(
    mutableStacks,
    A.reduce({} as Record<number, O.Option<string>>, (lookup, stack) => {
      const existingCrates = F.pipe(stack, A.filter(O.isSome));

      for (const crate of existingCrates) {
        const crateIndex = stack.indexOf(crate);

        const value = F.pipe(stack, A.lookup(crateIndex), O.flatten);
        stack[crateIndex] = O.none;

        if (!lookup[crateIndex]) {
          lookup[crateIndex] = F.pipe(
            value,
            O.map((str) => str.substring(1, 2))
          );
        }
      }

      return lookup;
    })
  );

  return F.pipe(topCratesByStack, R.compact, Object.values, (values) =>
    values.join("")
  );
};
