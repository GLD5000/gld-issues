import { ReactNode } from "react";

export function spreadChildObjects(targetObject: {
  [key: string]: { [key: string]: ReactNode };
}) {
  return Object.values(targetObject).reduce((acc, value) => {
    if (typeof value === "object" && value !== null) {
      return { ...acc, ...value };
    }
    return acc;
  }, {});
}

export function differenceArray(a: string[], b: string[]) {
  // console.log('a:', a);
  // console.log('b:', b);
  return [...new Set(a).difference(new Set(b))];
}

export function createStringSwitcher(stringArray: string[]) {
  const stringSwitcher: Record<string, string> = {};

  stringArray.forEach((string, index, array) => {
    if (index === 0) {
      stringSwitcher[array[array.length - 1]] = string;
    } else {
      stringSwitcher[array[index - 1]] = string;
    }
  });
  return stringSwitcher;
}
