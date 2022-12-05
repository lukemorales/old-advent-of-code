import {
  option as O,
  string as S,
  number as N,
  readonlyArray as A,
  readonlyNonEmptyArray as NEA,
  boolean as B,
  function as F,
} from "fp-ts";
import { parseChallengeInput } from "../../utils/parse-challenge-input";

export const functionalProgramA = (input: string) => {
  const values = F.pipe(input, parseChallengeInput);

  const lookup = {
    currentCalories: 0,
    highestCalories: 0,
  };

  for (const index in values) {
    const currentCalories = F.pipe(
      values,
      A.lookup(parseInt(index)),
      O.map(F.flow(S.trim, parseInt)),
      O.flatMap(O.fromPredicate(N.isNumber)),
      O.map(N.MonoidSum.combine(lookup.currentCalories)),
      O.toUndefined
    );

    if (!currentCalories) {
      lookup.highestCalories = F.pipe(
        lookup.highestCalories >= lookup.currentCalories,
        B.match(
          () => lookup.currentCalories,
          () => lookup.highestCalories
        )
      );

      lookup.currentCalories = 0;
      continue;
    }

    if (A.isOutOfBound(parseInt(index), values)) {
      lookup.highestCalories = F.pipe(
        lookup.highestCalories >= currentCalories,
        B.match(
          () => currentCalories,
          () => lookup.highestCalories
        )
      );
    }

    lookup.currentCalories = currentCalories;
  }

  return lookup.highestCalories;
};

export const functionalProgramB = (input: string) => {
  const values = F.pipe(input, parseChallengeInput);

  const lookup = {
    currentCalories: 0,
    topRankingCalories: [0, 0, 0] as readonly [number, number, number],
  };

  const updateCaloriesRanking = (candidate: number) =>
    F.pipe(
      lookup.topRankingCalories,
      A.head,
      O.flatMap((topRanked) =>
        F.pipe(
          candidate,
          O.fromPredicate((value) => value > topRanked)
        )
      ),
      O.flatMap((value) =>
        F.pipe(
          lookup.topRankingCalories,
          NEA.modifyAt(0, () => value),
          O.map(
            F.flow(
              A.sort(N.Ord),
              F.unsafeCoerce<
                readonly number[],
                typeof lookup["topRankingCalories"]
              >
            )
          )
        )
      ),
      O.getOrElse(() => lookup.topRankingCalories)
    );

  for (const index in values) {
    const currentCalories = F.pipe(
      values,
      A.lookup(parseInt(index)),
      O.map(F.flow(S.trim, parseInt)),
      O.flatMap(O.fromPredicate(N.isNumber)),
      O.map(N.MonoidSum.combine(lookup.currentCalories)),
      O.toUndefined
    );

    if (!currentCalories) {
      lookup.topRankingCalories = updateCaloriesRanking(lookup.currentCalories);
      lookup.currentCalories = 0;

      continue;
    }

    if (A.isOutOfBound(parseInt(index), values)) {
      lookup.topRankingCalories = updateCaloriesRanking(currentCalories);
    }

    lookup.currentCalories = currentCalories;
  }

  return F.pipe(
    lookup.topRankingCalories,
    A.reduce(0, (total, current) => (total += current))
  );
};
