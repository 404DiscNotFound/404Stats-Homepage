import { useState } from "react";

export default function PlayerHead({ uuid, name, size = 32, className = "" }) {
  const [errored, setErrored] = useState(false);

  if (!uuid || errored) {
    return (
      <div
        className={`shrink-0 rounded-md border border-[#00F5FF]/30 bg-[#0F0F18] ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <img
      src={`https://mc-heads.net/avatar/${uuid}/${size}`}
      alt={name || ""}
      onError={() => setErrored(true)}
      className={`shrink-0 rounded-md border border-[#00F5FF]/20 ${className}`}
      style={{ width: size, height: size, imageRendering: "pixelated" }}
    />
  );
}