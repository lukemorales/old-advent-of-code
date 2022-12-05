import {
  option as O,
  string as S,
  number as N,
  readonlyArray as A,
  readonlyRecord as R,
  function as F,
} from "fp-ts";
import { parseChallengeInput } from "../../utils/parse-challenge-input";

type JankenSymbol = "ROCK" | "PAPER" | "SCISSORS";

type OpponentPlay = "A" | "B" | "C";
type SelfPlay = "X" | "Y" | "Z";

type ElfPlay = OpponentPlay | SelfPlay;

type RoundOutcome = "WIN" | "DRAW" | "LOSE";

const PLAY_TO_SYMBOL_MAP = {
  A: "ROCK",
  B: "PAPER",
  C: "SCISSORS",
  X: "ROCK",
  Y: "PAPER",
  Z: "SCISSORS",
} satisfies Record<ElfPlay, JankenSymbol>;

const SYMBOL_BONUS_MAP = {
  ROCK: 1,
  PAPER: 2,
  SCISSORS: 3,
} satisfies Record<JankenSymbol, 1 | 2 | 3>;

const JANKEN_COMBINATIONS = {
  ROCK: {
    ROCK: "DRAW",
    PAPER: "WIN",
    SCISSORS: "LOSE",
  },
  PAPER: {
    ROCK: "LOSE",
    PAPER: "DRAW",
    SCISSORS: "WIN",
  },
  SCISSORS: {
    ROCK: "WIN",
    PAPER: "LOSE",
    SCISSORS: "DRAW",
  },
} satisfies Record<JankenSymbol, Record<JankenSymbol, RoundOutcome>>;

const GAME_SCORE = {
  LOSE: 0,
  DRAW: 3,
  WIN: 6,
} satisfies Record<RoundOutcome, 0 | 3 | 6>;

export const functionalProgramA = (input: string) => {
  return F.pipe(
    input,
    parseChallengeInput<`${OpponentPlay} ${SelfPlay}`>,
    A.reduce(0, (totalScore, round) => {
      const [opponentPlay, selfPlay] = F.pipe(
        round,
        S.split(" "),
        F.unsafeCoerce<
          readonly [string, ...string[]],
          readonly [OpponentPlay, SelfPlay]
        >
      );

      const opponentSymbol = F.pipe(PLAY_TO_SYMBOL_MAP, R.lookup(opponentPlay));
      const selfSymbol = F.pipe(PLAY_TO_SYMBOL_MAP, R.lookup(selfPlay));

      const result = F.pipe(
        opponentSymbol,
        O.flatMap((symbol) => F.pipe(JANKEN_COMBINATIONS, R.lookup(symbol))),
        O.flatMap((map) =>
          F.pipe(
            selfSymbol,
            O.flatMap((symbol) => F.pipe(map, R.lookup(symbol)))
          )
        )
      );

      const resultScore = F.pipe(
        selfSymbol,
        O.flatMap((symbol) => F.pipe(SYMBOL_BONUS_MAP, R.lookup(symbol))),
        O.getOrElse(() => 0)
      );
      const playBonus = F.pipe(
        result,
        O.flatMap((outcome) => F.pipe(GAME_SCORE, R.lookup(outcome))),
        O.getOrElse(() => 0)
      );

      return F.pipe(totalScore, N.MonoidSum.combine(resultScore + playBonus));
    })
  );
};

const STRATEGY_TO_OUTCOME_MAP = {
  X: "LOSE",
  Y: "DRAW",
  Z: "WIN",
} satisfies Record<SelfPlay, RoundOutcome>;

const OUTCOME_TO_SYMBOL_MAP = {
  ROCK: {
    DRAW: "ROCK",
    WIN: "PAPER",
    LOSE: "SCISSORS",
  },
  PAPER: {
    LOSE: "ROCK",
    DRAW: "PAPER",
    WIN: "SCISSORS",
  },
  SCISSORS: {
    WIN: "ROCK",
    LOSE: "PAPER",
    DRAW: "SCISSORS",
  },
} satisfies Record<JankenSymbol, Record<RoundOutcome, JankenSymbol>>;

export const functionalProgramB = (input: string) => {
  return F.pipe(
    input,
    parseChallengeInput<`${OpponentPlay} ${SelfPlay}`>,
    A.reduce(0, (totalScore, round) => {
      const [opponentPlay, selfPlay] = F.pipe(
        round,
        S.split(" "),
        F.unsafeCoerce<
          readonly [string, ...string[]],
          readonly [OpponentPlay, SelfPlay]
        >
      );

      const expectedResult = F.pipe(
        STRATEGY_TO_OUTCOME_MAP,
        R.lookup(selfPlay)
      );

      const opponentSymbol = F.pipe(PLAY_TO_SYMBOL_MAP, R.lookup(opponentPlay));
      const selfSymbol = F.pipe(
        opponentSymbol,
        O.flatMap((symbol) => F.pipe(OUTCOME_TO_SYMBOL_MAP, R.lookup(symbol))),
        O.flatMap((map) =>
          F.pipe(
            expectedResult,
            O.flatMap((outcome) => F.pipe(map, R.lookup(outcome)))
          )
        )
      );

      const playBonus = F.pipe(
        selfSymbol,
        O.flatMap((symbol) => F.pipe(SYMBOL_BONUS_MAP, R.lookup(symbol))),
        O.getOrElse(() => 0)
      );
      const resultScore = F.pipe(
        expectedResult,
        O.flatMap((outcome) => F.pipe(GAME_SCORE, R.lookup(outcome))),
        O.getOrElse(() => 0)
      );

      return F.pipe(totalScore, N.MonoidSum.combine(resultScore + playBonus));
    })
  );
};
