import { useState } from "react";
import minecraftItems from "minecraft-icon-items";

// Cache to avoid re-looking-up the same material repeatedly
const iconCache = {};

function getIconUrl(material) {
  if (iconCache[material] !== undefined) return iconCache[material];

  let url = null;
  try {
    // minecraft-icon-items supports Bukkit Material enum names directly
    const item = minecraftItems.getBukkit(material);
    if (item && item.icon) {
      url = `data:image/png;base64,${item.icon}`;
    }
  } catch {
    // not found — leave null
  }
  iconCache[material] = url;
  return url;
}

export default function BlockIcon({ material, size = 20, className = "" }) {
  const [errored, setErrored] = useState(false);
  const url = getIconUrl(material);

  if (!url || errored) {
    // Fallback: pixel-style placeholder block
    return (
      <div
        className={`shrink-0 rounded-sm border border-white/10 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <img
      src={url}
      alt={material}
      onError={() => setErrored(true)}
      className={`shrink-0 rounded-sm ${className}`}
      style={{ width: size, height: size, imageRendering: "pixelated" }}
    />
  );
}