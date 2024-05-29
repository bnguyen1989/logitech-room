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
