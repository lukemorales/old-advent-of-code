import {
  either as E,
  string as S,
  readonlyArray as A,
  function as F,
} from "fp-ts";
import { parseChallengeInput } from "../../utils/parse-challenge-input";

type Pair = `${number}-${number}`;

export const functionalProgramA = (input: string) => {
  return F.pipe(
    input,
    parseChallengeInput<`${Pair},${Pair}`>,
    A.reduce(0, (totalOverlaps, currentPairs) => {
      return F.pipe(
        currentPairs,
        S.split(","),
        A.flatMap(
          F.flow(
            S.split("-"),
            A.map((number) => parseInt(number))
          )
        ),
        F.unsafeCoerce<
          readonly number[],
          readonly [number, number, number, number]
        >,
        E.fromPredicate(
          ([leftStart, leftEnd, rightStart, rightEnd]) =>
            (leftStart >= rightStart && leftEnd <= rightEnd) ||
            (leftStart <= rightStart && leftEnd >= rightEnd),
          () => 0
        ),
        E.match(
          (_) => totalOverlaps,
          (_) => (totalOverlaps += 1)
        )
      );
    })
  );
};

export const functionalProgramB = (input: string) => {
  return F.pipe(
    input,
    parseChallengeInput<`${Pair},${Pair}`>,
    A.reduce(0, (totalOverlaps, currentPairs) => {
      return F.pipe(
        currentPairs,
        S.split(","),
        A.flatMap(F.flow(S.split("-"), A.map(parseInt))),
        F.unsafeCoerce<readonly number[], [number, number, number, number]>,
        E.fromPredicate(
          ([leftStart, leftEnd, rightStart, rightEnd]) =>
            (rightStart <= leftEnd && rightStart >= leftStart) ||
            (leftStart <= rightEnd && leftStart >= rightStart),
          () => 0
        ),
        E.match(
          (_) => totalOverlaps,
          (_) => (totalOverlaps += 1)
        )
      );
    })
  );
};
