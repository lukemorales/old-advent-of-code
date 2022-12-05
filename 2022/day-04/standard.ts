import { parseChallengeInput } from "../../utils/parse-challenge-input";

type Pair = `${number}-${number}`;

export const programA = (input: string) => {
  const pairs = parseChallengeInput<`${Pair},${Pair}`>(input);

  return pairs.reduce((totalOverlaps, currentPairs) => {
    const [leftStart, leftEnd, rightStart, rightEnd] = currentPairs
      .split(",")
      .flatMap((pair) => pair.split("-").map((number) => parseInt(number))) as [
      number,
      number,
      number,
      number
    ];

    if (
      (leftStart >= rightStart && leftEnd <= rightEnd) ||
      (leftStart <= rightStart && leftEnd >= rightEnd)
    ) {
      return (totalOverlaps += 1);
    }

    return totalOverlaps;
  }, 0);
};

export const programB = (input: string) => {
  const pairs = parseChallengeInput<`${Pair},${Pair}`>(input);

  return pairs.reduce((totalOverlaps, currentPairs) => {
    const [leftStart, leftEnd, rightStart, rightEnd] = currentPairs
      .split(",")
      .flatMap((pair) => pair.split("-").map((number) => parseInt(number))) as [
      number,
      number,
      number,
      number
    ];

    if (
      (rightStart <= leftEnd && rightStart >= leftStart) ||
      (leftStart <= rightEnd && leftStart >= rightStart)
    ) {
      return (totalOverlaps += 1);
    }

    return totalOverlaps;
  }, 0);
};
