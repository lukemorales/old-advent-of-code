import { A, F, flow, O, pipe, S } from "@mobily/ts-belt";

const parseGroupAndSumValues = flow(
  S.split("\n"),
  A.reduce(0, (total, current) => total + pipe(current, S.trim, Number))
);

export const beltProgramA = (input: string) => {
  const groups = pipe(input, S.split("\n\n"));

  const results = pipe(groups, A.map(parseGroupAndSumValues));

  return Math.max(...results);
};

export const beltProgramB = (input: string) => {
  const groups = pipe(input, S.split("\n\n"));

  type $CaloriesPodium = readonly [number, number, number];

  const getTopRankedCalories = (podium: $CaloriesPodium = [0, 0, 0]) => {
    return (calories: readonly string[]): $CaloriesPodium => {
      const currentCalories = pipe(
        calories,
        A.head,
        O.map(parseGroupAndSumValues)
      );

      const updateCaloriesPodium = (value: number) =>
        pipe(
          podium,
          A.replaceAt(0, value),
          A.sort((a, b) => a - b)
        );

      const updatedPodium = pipe(
        podium,
        A.head,
        O.flatMap((topRanked) =>
          pipe(
            currentCalories,
            O.fromPredicate((candidate) => candidate > topRanked)
          )
        ),
        O.map(updateCaloriesPodium),
        O.map(F.coerce<$CaloriesPodium>),
        O.getWithDefault(podium)
      );

      return pipe(
        calories,
        A.tail,
        O.match(getTopRankedCalories(updatedPodium), () => updatedPodium)
      );
    };
  };

  const topRankedCalories = pipe(groups, getTopRankedCalories());

  return pipe(
    topRankedCalories,
    A.reduce(0, (total, current) => total + current)
  );
};
