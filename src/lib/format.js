export const formatNumber = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return (n || 0).toLocaleString("en-US");
};

export const formatMaterial = (m) =>
  m.split("_").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");