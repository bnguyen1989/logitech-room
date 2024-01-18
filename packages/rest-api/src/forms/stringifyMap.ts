export const stringifyMap = (map?: Record<string, any>) => {
  const newMap: Record<string, string> = {};
  Object.entries(map || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    newMap[key] = typeof value === 'string' ? value : JSON.stringify(value);
  });
  return newMap;
};
