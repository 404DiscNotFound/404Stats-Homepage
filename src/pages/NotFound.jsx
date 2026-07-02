import { Link } from "react-router-dom";
import GlitchLogo from "@/components/GlitchLogo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <GlitchLogo size="md" />
      <h1 className="mt-12 text-6xl font-black text-white glitch-text" data-text="404">
        404
      </h1>
      <p className="mt-4 text-sm text-gray-500">Seite oder Server nicht gefunden.</p>
      <Link to="/" className="mt-8 text-sm text-[#00F5FF] hover:underline">
        ← Zur Startseite
      </Link>
    </div>
  );
}