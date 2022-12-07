export const programA = (input: string) => {
  const buffer = input.trimEnd();
  const SECRET_SIZE = 4;

  let startOfPacketMarker = 0;

  for (let i = SECRET_SIZE; i <= buffer.length; i++) {
    const uniqueSet = new Set(buffer.slice(i - SECRET_SIZE, i).split(""));

    if (uniqueSet.size === SECRET_SIZE) {
      startOfPacketMarker = i;
      break;
    }
  }

  return startOfPacketMarker;
};

export const programB = (input: string) => {
  const buffer = input.trimEnd();
  const SECRET_SIZE = 14;

  let startOfMessageMarker = 0;

  for (let i = SECRET_SIZE; i <= buffer.length; i++) {
    const uniqueSet = new Set(buffer.slice(i - SECRET_SIZE, i).split(""));

    if (uniqueSet.size === SECRET_SIZE) {
      startOfMessageMarker = i;
      break;
    }
  }

  return startOfMessageMarker;
};
