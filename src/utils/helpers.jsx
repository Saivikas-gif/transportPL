export const formatCurrency = (num) => {
  if (!num) return "-";
  return Math.round(Number(num)).toLocaleString("en-IN");
};

export const commonSortingHelper = (options) =>
  [...options].sort((a, b) => a.label.localeCompare(b.label));