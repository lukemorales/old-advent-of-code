import assert from "assert";

const parseGroupAndSumValues = (group: string) =>
  group
    .split("\n")
    .reduce((total, current) => total + Number(current.trim()), 0);

export const programA = (input: string) => {
  const groups = input.split("\n\n");

  const results = groups.map(parseGroupAndSumValues);

  return Math.max(...results);
};

export const programB = (input: string) => {
  const groups = input.split("\n\n");

  type $CaloriesPodium = readonly [number, number, number];

  const getTopRankedCalories = (
    calories: string[],
    podium: $CaloriesPodium = [0, 0, 0]
  ): $CaloriesPodium => {
    const [head, ...tail] = calories;

    if (head == null) {
      return podium;
    }

    const currentCalories = parseGroupAndSumValues(head);

    const updateCaloriesPodium = (candidate: number): $CaloriesPodium => {
      const [topRanked, ...podiumTail] = podium;

      if (candidate <= topRanked) {
        return podium;
      }

      return [candidate, ...podiumTail].sort(
        (a, b) => a - b
      ) as unknown as $CaloriesPodium;
    };

    const updatedPodium = updateCaloriesPodium(currentCalories);

    return getTopRankedCalories(tail, updatedPodium);
  };

  const topRankedCalories = getTopRankedCalories(groups);

  return topRankedCalories.reduce((total, current) => total + current, 0);
};
