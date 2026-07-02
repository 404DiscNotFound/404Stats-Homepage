export const CATEGORY_META = {
  nature:   { color: "#4ADE80", labelKey: "donuts.nature" },
  building: { color: "#00F5FF", labelKey: "donuts.building" },
  tech:     { color: "#FBBF24", labelKey: "donuts.tech" },
  nether:   { color: "#FF0055", labelKey: "donuts.nether" },
  end:      { color: "#A855F7", labelKey: "donuts.end" },
};

export const WORLD_META = {
  world:          { color: "#4ADE80", labelKey: "donuts.overworld" },
  world_nether:   { color: "#FF0055", labelKey: "donuts.nether" },
  world_the_end:  { color: "#A855F7", labelKey: "donuts.end" },
};

export function getWorldMeta(worldName) {
  if (WORLD_META[worldName]) return WORLD_META[worldName];
  return { color: "#6B7280", labelKey: null };
}