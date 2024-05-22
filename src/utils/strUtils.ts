export const replaceArrValues = (str: string, replacements: string[]) => {
  let replacementIndex = 0;

  return str.replace(/\[[^\]]+\]/g, (match) => {
    if (replacementIndex < replacements.length) {
      return replacements[replacementIndex++];
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
      // Видаляємо всі пробіли
      .replace(/\s+/g, ' ')
      .trim()
      // Ділимо строку на слова
      .split(' ')
      // Перетворюємо слова в потрібний формат
      .map((word, index) => {
          if (index === 0) {
              // Перше слово в нижньому регістрі
              return word.toLowerCase();
          }
          // Перша літера у верхньому регістрі, решта в нижньому
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      // Об'єднуємо слова в одну строку
      .join('');
}