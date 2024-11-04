function findDigits(str: string) {
  // Используем регулярное выражение для поиска цифр
  const digits = str.match(/\d+/g);

  // Возвращаем найденные цифры
  return Number(digits) ? Number(digits) : 0;
}
export const replaceArrValues = (str: string, replacements: string[]) => {
  const isStandartSubtitle = str.includes("3. ");
  if (isStandartSubtitle) {
    let replacementIndex = 0;

    return str.replace(/\[[^\]]+\]/g, (match) => {
      if (replacementIndex < replacements.length) {
        return replacements[replacementIndex++];
      }
      return match;
    });
  }

  return str.replace(/\[[^\]]+\]/g, (match) => {
    const numberText = findDigits(match) - 1;

    if (replacements[numberText]) {
      return replacements[numberText];
    }
    return match;
  });
};

export const divideTextIntoSentence = (text: string) => {
  const firstSentenceRegex = /^.*?[.!?]/;
  const res = text.match(firstSentenceRegex);
  if (!res) return [];
  return res;
};

export const toCamelCase = (str: string): string => {
  return str
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
};

export const capitalizeEachWord = (str: string): string => {
  if (!str) return "";
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};
