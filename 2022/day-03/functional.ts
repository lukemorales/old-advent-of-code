import {
  option as O,
  string as S,
  number as N,
  readonlyArray as A,
  function as F,
} from "fp-ts";

import { parseChallengeInput } from "../../utils/parse-challenge-input";

const GROUP_LENGTH = 3;

const getPriority = (char: string) =>
  F.pipe(
    "_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(char),
    O.fromPredicate((index) => index > 0)
  );

export const functionalProgramA = (input: string) => {
  return F.pipe(
    input,
    parseChallengeInput,
    A.reduce(0, (sumOfPriorities, currentRucksack) => {
      const halfOfRucksack = F.pipe(currentRucksack.length, N.Field.div(2));

      const firstCompartmentItems = F.pipe(
        currentRucksack,
        S.slice(0, halfOfRucksack),
        S.split("")
      );

      const secondCompartmentItems = F.pipe(
        currentRucksack,
        S.slice(halfOfRucksack, currentRucksack.length),
        S.split("")
      );

      return F.pipe(
        firstCompartmentItems,
        A.findFirst((item) =>
          F.pipe(secondCompartmentItems, F.pipe(item, A.elem(S.Eq)))
        ),
        O.flatMap(getPriority),
        O.match(
          () => sumOfPriorities,
          (priorityValue) => (sumOfPriorities += priorityValue)
        )
      );
    })
  );
};

export const functionalProgramB = (input: string) => {
  const rucksacks = F.pipe(input, parseChallengeInput);

  let sumOfPriorities = 0;

  for (let i = 0; i <= rucksacks.length; i += GROUP_LENGTH) {
    type $RucksackItemsOption = O.Option<readonly [string, ...string[]]>;

    const [first, second, third] = F.pipe(
      [i, i + 1, i + 2],
      A.map((index) => F.pipe(rucksacks, A.lookup(index), O.map(S.split("")))),
      F.unsafeCoerce<
        readonly $RucksackItemsOption[],
        [$RucksackItemsOption, $RucksackItemsOption, $RucksackItemsOption]
      >
    );

    const firstIntersection = F.pipe(
      second,
      O.map(
        A.filter((x) =>
          F.pipe(
            first,
            O.map((value) => new Set(value).has(x)),
            O.getOrElse(() => false)
          )
        )
      )
    );

    const secondIntersection = F.pipe(
      third,
      O.map(
        A.filter((x) =>
          F.pipe(
            firstIntersection,
            O.map((value) => new Set(value).has(x)),
            O.getOrElse(() => false)
          )
        )
      )
    );

    const item = F.pipe(
      secondIntersection,
      O.map((intersection) => [...new Set(intersection)]),
      O.flatMap(A.head)
    );

    sumOfPriorities += F.pipe(
      item,
      O.flatMap(getPriority),
      O.match(() => 0, F.identity)
    );
  }

  return sumOfPriorities;
};
