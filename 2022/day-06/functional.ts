import {
  string as S,
  number as N,
  readonlySet as RS,
  function as F,
} from "fp-ts";

export const functionalProgramA = (input: string) => {
  const buffer = F.pipe(input, S.trimRight);

  const SECRET_SIZE = 4;
  const isSameSize = N.Eq.equals(SECRET_SIZE);

  let startOfPacketMarker = 0;

  for (let i = SECRET_SIZE; i <= buffer.length; i++) {
    const uniqueSetSize = F.pipe(
      buffer.slice(i - SECRET_SIZE, i),
      S.split(""),
      RS.fromReadonlyArray(S.Eq),
      RS.size
    );

    if (isSameSize(uniqueSetSize)) {
      startOfPacketMarker = i;
      break;
    }
  }

  return startOfPacketMarker;
};

export const functionalProgramB = (input: string) => {
  const buffer = F.pipe(input, S.trimRight);

  const SECRET_SIZE = 14;
  const isSameSize = N.Eq.equals(SECRET_SIZE);

  let startOfMessageMarker = 0;

  for (let i = SECRET_SIZE; i <= buffer.length; i++) {
    const uniqueSetSize = F.pipe(
      buffer.slice(i - SECRET_SIZE, i),
      S.split(""),
      RS.fromReadonlyArray(S.Eq),
      RS.size
    );

    if (isSameSize(uniqueSetSize)) {
      startOfMessageMarker = i;
      break;
    }
  }

  return startOfMessageMarker;
};
