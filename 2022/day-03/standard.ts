import { parseChallengeInput } from "../../utils/parse-challenge-input";

const GROUP_LENGTH = 3;
const getPriority = (char: string) =>
  "_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(char);

export const programA = (input: string) => {
  const rucksacks = parseChallengeInput(input);

  return rucksacks.reduce((sumOfPriorities, currentRucksack) => {
    const halfOfRucksack = Math.floor(currentRucksack.length / 2);

    const firstCompartmentItems = currentRucksack
      .slice(0, halfOfRucksack)
      .split("");

    const secondCompartmentItems = currentRucksack
      .slice(halfOfRucksack, currentRucksack.length)
      .split("");

    const priorityItem = firstCompartmentItems.find((item) =>
      secondCompartmentItems.includes(item)
    );

    if (!priorityItem) {
      return sumOfPriorities;
    }

    const priorityValue = getPriority(priorityItem);

    if (priorityValue === -1) {
      throw new Error(`Invalid item: ${priorityItem}`);
    }

    return (sumOfPriorities += priorityValue);
  }, 0);
};

export const programB = (input: string) => {
  const rucksacks = parseChallengeInput(input);

  let sumOfPriorities = 0;

  for (let i = 0; i <= rucksacks.length; i += GROUP_LENGTH) {
    const [first, second, third] = [
      rucksacks[i],
      rucksacks[i + 1],
      rucksacks[i + 2],
    ].map((sack) => sack?.split(""));

    if (!first || !second || !third) {
      continue;
    }

    const firstIntersection = second.filter((x) => new Set(first).has(x));

    const secondIntersection = third.filter((x) =>
      new Set(firstIntersection).has(x)
    );

    const [item] = [...new Set(secondIntersection)];

    if (!item) {
      continue;
    }

    sumOfPriorities += getPriority(item);
  }

  return sumOfPriorities;
};
