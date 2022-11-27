export function shuffle(array) {
  const initArrCopy = [...array];

  const copy = [];
  let n = initArrCopy.length,
    i;

  while (n) {
    i = Math.floor(Math.random() * initArrCopy.length);

    if (i in initArrCopy) {
      copy.push(initArrCopy[i]);
      delete initArrCopy[i];
      n--;
    }
  }

  return copy;
}
