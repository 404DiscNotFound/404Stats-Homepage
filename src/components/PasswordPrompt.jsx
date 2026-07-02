import { useState } from "react";
import { Lock } from "lucide-react";
import Background from "@/components/Background";
import GlitchLogo from "@/components/GlitchLogo";

export default function PasswordPrompt({ onSubmit }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await onSubmit(password);
    if (!result.success) {
      setError(result.error);
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black px-6">
      <Background />
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <GlitchLogo size="md" />
          <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[#00F5FF]/30 bg-[#00F5FF]/5">
            <Lock className="h-6 w-6 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 6px rgba(0,245,255,0.5))" }} />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Server-Passwort"
            autoFocus
            className="w-full rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-4 py-3 text-center text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-[#00F5FF]/40"
          />
          {error && (
            <p className="text-center text-xs text-[#FF0055]">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-lg border border-[#00F5FF]/30 bg-[#00F5FF]/10 px-4 py-3 text-sm font-bold text-[#00F5FF] transition-all hover:bg-[#00F5FF]/20 hover:shadow-[0_0_15px_rgba(0,245,255,0.15)] disabled:opacity-40"
          >
            {loading ? "Prüfe..." : "Entsperren"}
          </button>
        </form>
      </div>
    </div>
  );
}