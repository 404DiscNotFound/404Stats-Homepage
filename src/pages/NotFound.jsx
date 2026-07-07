import { Link } from "react-router-dom";
import GlitchLogo from "@/components/GlitchLogo";
import Background from "@/components/Background";
import { useT } from "@/lib/i18n";

export default function NotFound() {
  const t = useT();
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <Background />
      <div className="relative z-10 flex flex-col items-center">
        <GlitchLogo size="md" />
        <h1 className="mt-12 text-6xl font-black text-white glitch-text" data-text="404">
          404
        </h1>
        <p className="mt-4 text-sm text-gray-500">{t("notFound.text")}</p>
        <Link to="/" className="mt-8 text-sm text-[#5BA033] hover:underline">
          {t("common.backToHome")}
        </Link>
      </div>
    </div>
  );
}