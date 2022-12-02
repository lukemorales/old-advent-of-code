import assert from "assert";

export const programA = (input: string) => {
  const values = input.split("\n");

  const lookup = {
    currentCalories: 0,
    highestCalories: 0,
  };

  for (const index in values) {
    const value = values[index]?.trim();
    let currentCalories = lookup.currentCalories;

    if (value === "") {
      lookup.highestCalories =
        lookup.highestCalories >= currentCalories
          ? lookup.highestCalories
          : currentCalories;

      lookup.currentCalories = 0;
      continue;
    }

    assert.ok(value);

    const valueAsNumber = parseInt(value);
    currentCalories += valueAsNumber;

    if (parseInt(index) === values.length - 1) {
      lookup.highestCalories =
        lookup.highestCalories < currentCalories
          ? currentCalories
          : lookup.highestCalories;
    }

    lookup.currentCalories = currentCalories;
  }

  return lookup.highestCalories;
};

export const programB = (input: string) => {
  const values = input.split("\n");

  const lookup = {
    currentCalories: 0,
    topRankingCalories: [0, 0, 0] as [number, number, number],
  };

  const updateCaloriesRanking = (candidate: number): void => {
    if (lookup.topRankingCalories[0] > candidate) {
      return void null;
    }

    lookup.topRankingCalories[0] = candidate;
    lookup.topRankingCalories.sort();
  };

  for (const index in values) {
    const value = values[index]?.trim();
    let currentCalories = lookup.currentCalories;

    if (value === "") {
      updateCaloriesRanking(currentCalories);

      lookup.currentCalories = 0;
      continue;
    }

    assert.ok(value);

    const valueAsNumber = parseInt(value);
    currentCalories += valueAsNumber;

    if (parseInt(index) === values.length - 1) {
      updateCaloriesRanking(currentCalories);
    }

    lookup.currentCalories = currentCalories;
  }

  return lookup.topRankingCalories.reduce(
    (total, current) => (total += current),
    0
  );
};
