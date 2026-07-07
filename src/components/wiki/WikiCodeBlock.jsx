import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function WikiCodeBlock({ code, label }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative">
      {label && <p className="mb-1.5 text-xs font-medium text-[#888888]">{label}</p>}
      <div className="group relative overflow-hidden rounded-lg border border-[#3D3D3D] bg-[#2E2E2E]">
        <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-[#5BA033]"><code>{code}</code></pre>
        <button
          onClick={copy}
          className="absolute right-2 top-2 rounded border border-[#3D3D3D] bg-[#2E2E2E]/80 p-1.5 text-[#888888] opacity-0 backdrop-blur transition-all hover:text-[#5BA033] group-hover:opacity-100"
          aria-label="Copy"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-[#5BA033]" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}