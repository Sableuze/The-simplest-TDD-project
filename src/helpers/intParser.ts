export const parseIntCustomHelper = (val: string, maxVal: number) => {
  const int = parseInt(val.replace(/\D/g, ''), 10);
  if (!int) return 0;
  return int < maxVal ? int : maxVal;
};
