export const parseChallengeInput = <T extends string>(input: string) => {
  // remove empty last line in file
  return input.trim().split("\n") as T[];
};
