import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import GlitchLogo from "@/components/GlitchLogo";

export default function LegalLayout({ title, lastUpdated, children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute left-1/4 top-0 h-[300px] w-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Link to="/"><GlitchLogo size="sm" /></Link>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 transition-colors hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>
      </nav>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-20">
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-2 text-xs text-gray-600">Last updated: {lastUpdated}</p>

        <div className="mt-8 space-y-8">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-[#1A1A24] pt-6 text-center">
          <p className="text-xs text-gray-600">
            404Stats is a hobby project by 404DiscNotFound, on behalf of the 404GameNotFound Community.
          </p>
          <div className="mt-3 flex justify-center gap-4">
            <Link to="/terms" className="text-xs text-gray-500 transition-colors hover:text-[#00F5FF]">Terms of Service</Link>
            <Link to="/privacy" className="text-xs text-gray-500 transition-colors hover:text-[#00F5FF]">Privacy Policy</Link>
            <Link to="/" className="text-xs text-gray-500 transition-colors hover:text-[#00F5FF]">Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}