export const stringifyValues = (obj: any) => {
  if (obj === undefined || obj === null) return obj;

  return Object.keys(obj).reduce((acc: any, key) => {
    const value = obj[key];
    if (typeof value === 'string') {
      acc[key] = value;
    } else {
      acc[key] = JSON.stringify(obj[key]);
    }
    return acc;
  }, {});
};
