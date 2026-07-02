import { useState } from "react";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";
import { useT } from "@/lib/i18n";

export default function ShareButtons({ url, title, compact = false }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareTitle = title || "404Stats — Minecraft Block Analytics";

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl });
      } catch { /* user cancelled */ }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`;

  const btnBase = "inline-flex items-center justify-center transition-all";

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <button onClick={handleNativeShare} title={t("share.share")} className={`${btnBase} h-8 w-8 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] text-gray-400 hover:border-[#00F5FF]/30 hover:text-[#00F5FF]`}>
          <Share2 className="h-3.5 w-3.5" />
        </button>
        <button onClick={handleCopy} title={t("share.copyLink")} className={`${btnBase} h-8 w-8 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] text-gray-400 hover:border-[#00F5FF]/30 hover:text-[#00F5FF]`}>
          {copied ? <Check className="h-3.5 w-3.5 text-[#00F5FF]" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={handleNativeShare} className={`${btnBase} gap-1.5 rounded-lg border border-[#00F5FF]/30 bg-[#00F5FF]/5 px-3 py-2 text-xs font-bold text-[#00F5FF] hover:bg-[#00F5FF]/10 hover:shadow-[0_0_15px_rgba(0,245,255,0.15)]`}>
        <Share2 className="h-3.5 w-3.5" /> {t("share.share")}
      </button>
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" title="Share on X" className={`${btnBase} h-8 w-8 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] text-sm font-bold text-gray-400 hover:border-[#00F5FF]/30 hover:text-[#00F5FF]`}>
        𝕏
      </a>
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" title="Share on WhatsApp" className={`${btnBase} h-8 w-8 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] text-gray-400 hover:border-[#00F5FF]/30 hover:text-[#00F5FF]`}>
        <MessageCircle className="h-3.5 w-3.5" />
      </a>
      <button onClick={handleCopy} title={t("share.copyLink")} className={`${btnBase} h-8 w-8 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] text-gray-400 hover:border-[#00F5FF]/30 hover:text-[#00F5FF]`}>
        {copied ? <Check className="h-3.5 w-3.5 text-[#00F5FF]" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}