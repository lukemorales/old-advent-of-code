import {
  option as O,
  string as S,
  number as N,
  readonlyArray as A,
  readonlyNonEmptyArray as NEA,
  function as F,
} from "fp-ts";

const parseGroupAndSumValues = F.flow(
  S.split("\n"),
  A.reduce(0, (total, current) => total + F.pipe(current, S.trim, Number))
);

export const functionalProgramA = (input: string) => {
  const groups = F.pipe(input, S.split("\n\n"));

  const results = F.pipe(groups, A.map(parseGroupAndSumValues));

  return Math.max(...results);
};

export const functionalProgramB = (input: string) => {
  const groups = F.pipe(input, S.split("\n\n"));

  type $CaloriesPodium = readonly [number, number, number];

  const getTopRankedCalories = (podium: $CaloriesPodium = [0, 0, 0]) => {
    return (calories: readonly string[]): $CaloriesPodium => {
      const currentCalories = F.pipe(
        calories,
        A.head,
        O.map(parseGroupAndSumValues)
      );

      const updateCaloriesPodium = (value: number) =>
        F.pipe(
          podium,
          NEA.modifyHead(() => value),
          A.sort(N.Ord),
          F.unsafeCoerce<readonly number[], $CaloriesPodium>
        );

      const updatedPodium = F.pipe(
        O.Do,
        O.bind("topRanked", () => F.pipe(podium, A.head)),
        O.bind("candidate", () => currentCalories),
        O.flatMap(({ topRanked, candidate }) =>
          F.pipe(
            candidate,
            O.fromPredicate((value) => value > topRanked)
          )
        ),
        O.map(updateCaloriesPodium),
        O.getOrElse(() => podium)
      );

      return F.pipe(
        calories,
        A.tail,
        O.match(() => updatedPodium, getTopRankedCalories(updatedPodium))
      );
    };
  };

  const topRankedCalories = F.pipe(groups, getTopRankedCalories());

  return F.pipe(
    topRankedCalories,
    A.reduce(0, (total, current) => (total += current))
  );
};
