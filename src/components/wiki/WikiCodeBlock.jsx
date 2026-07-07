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
      {label && <p className="mb-1.5 text-xs font-medium text-[#8A8A8A]">{label}</p>}
      <div className="group relative overflow-hidden rounded-lg border border-[#1E1E1F] bg-[#313233]">
        <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-[#5BA033]"><code>{code}</code></pre>
        <button
          onClick={copy}
          className="absolute right-2 top-2 rounded border border-[#1E1E1F] bg-[#313233]/80 p-1.5 text-[#8A8A8A] opacity-0 backdrop-blur transition-all hover:text-[#5BA033] group-hover:opacity-100"
          aria-label="Copy"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-[#5BA033]" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}