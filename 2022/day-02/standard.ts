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

export const programA = (input: string) => {
  const rounds = parseChallengeInput<`${OpponentPlay} ${SelfPlay}`>(input);

  return rounds.reduce((totalScore, round) => {
    const [opponentPlay, selfPlay] = round.split(" ") as [
      OpponentPlay,
      SelfPlay
    ];

    const opponentSymbol = PLAY_TO_SYMBOL_MAP[opponentPlay];
    const selfSymbol = PLAY_TO_SYMBOL_MAP[selfPlay];

    const result = JANKEN_COMBINATIONS[opponentSymbol][selfSymbol];

    const playBonus = SYMBOL_BONUS_MAP[selfSymbol];
    const resultScore = GAME_SCORE[result];

    return (totalScore += resultScore + playBonus);
  }, 0);
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

export const programB = (input: string) => {
  const rounds = parseChallengeInput<`${OpponentPlay} ${SelfPlay}`>(input);

  return rounds.reduce((totalScore, round) => {
    const [opponentPlay, selfPlay] = round.split(" ") as [
      OpponentPlay,
      SelfPlay
    ];

    const expectedResult = STRATEGY_TO_OUTCOME_MAP[selfPlay];

    const opponentSymbol = PLAY_TO_SYMBOL_MAP[opponentPlay];
    const selfSymbol = OUTCOME_TO_SYMBOL_MAP[opponentSymbol][expectedResult];

    const playBonus = SYMBOL_BONUS_MAP[selfSymbol];
    const resultScore = GAME_SCORE[expectedResult];

    return (totalScore += resultScore + playBonus);
  }, 0);
};
