import { Link } from "react-router-dom";
import GlitchLogo from "@/components/GlitchLogo";
import { BarChart3, Users, Search } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="flex flex-col items-center px-6 pt-20 pb-16">
        <GlitchLogo size="xl" />
        <h1 className="mt-8 text-center text-4xl font-black tracking-tight md:text-5xl">
          Track every block.
          <br />
          <span className="text-[#00F5FF]">See every stat.</span>
        </h1>
        <p className="mt-4 max-w-md text-center text-gray-500">
          Universelle Statistik-Plattform für Minecraft-Server. Das Plugin sendet Daten – die Website zeigt alles.
        </p>
      </div>

      {/* How it works */}
      <div className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="mb-8 text-center text-xs uppercase tracking-widest text-gray-600">So funktioniert's</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Step number="01" title="Plugin einrichten" desc="404Stats-Plugin installieren und API-Key in der config.yml festlegen." />
          <Step number="02" title="Daten senden" desc="Das Plugin sendet automatisch alle Block-Stats an die 404Stats-API." />
          <Step number="03" title="Stats ansehen" desc="Die Server-URL aus dem Plugin-Log aufrufen – fertig." />
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-4xl px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          <Feature icon={BarChart3} title="Top 25 Blöcke" desc="Sieh welche Blöcke am meisten ab- und aufgebaut werden." />
          <Feature icon={Users} title="Top 25 Spieler" desc="Rangliste der aktivsten Spieler auf dem Server." />
          <Feature icon={Search} title="Spielersuche" desc="Suche dich selbst und sieh deinen serverweiten Rang." />
        </div>
      </div>

      {/* API Info */}
      <div className="mx-auto max-w-2xl px-6 pb-20">
        <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-6">
          <h3 className="text-sm font-bold text-white">API Endpunkt</h3>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-black p-3 text-xs leading-relaxed text-gray-400">
{`POST /api/functions/receiveStats
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "server_name": "My Server",
  "stats": [
    {
      "uuid": "069a79f4-44e9-...",
      "player_name": "Notch",
      "material": "STONE",
      "mined_delta": 5,
      "placed_delta": 2
    }
  ]
}

Response: { "success": true, "server_slug": "abc12345" }
Server URL: /server/abc12345`}
          </pre>
          <p className="mt-3 text-xs text-gray-600">
            Die genaue URL findest du im Dashboard unter Code → Functions → receiveStats.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-col items-center border-t border-[#1A1A24] px-6 py-8 text-center">
        <GlitchLogo size="sm" />
        <p className="mt-4 text-xs text-gray-600">404Stats — Universelle Minecraft Block-Statistiken</p>
      </footer>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-5">
      <p className="text-xs font-bold text-[#00F5FF]">{number}</p>
      <h3 className="mt-2 text-sm font-bold text-white">{title}</h3>
      <p className="mt-1 text-xs text-gray-500">{desc}</p>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-5">
      <Icon className="h-5 w-5 text-[#00F5FF]" />
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  );
}