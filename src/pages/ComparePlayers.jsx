import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Swords } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ServerHeader from "@/components/ServerHeader";
import PlayerHead from "@/components/PlayerHead";
import TopBlocksChart from "@/components/TopBlocksChart";

const formatNumber = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return (n || 0).toLocaleString("de-DE");
};

export default function ComparePlayers() {
  const { slug } = useParams();
  const [allPlayers, setAllPlayers] = useState([]);
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await base44.functions.invoke("getServerData", { slug });
        setAllPlayers(res.data.allPlayers);
      } catch {}
    };
    fetchPlayers();
  }, [slug]);

  useEffect(() => {
    if (!p1 || !p2) {
      setData1(null);
      setData2(null);
      return;
    }
    setLoading(true);
    const fetchBoth = async () => {
      try {
        const [r1, r2] = await Promise.all([
          base44.functions.invoke("getPlayerData", { slug, playerName: p1, range: "all" }),
          base44.functions.invoke("getPlayerData", { slug, playerName: p2, range: "all" })
        ]);
        setData1(r1.data);
        setData2(r2.data);
      } catch {
        setData1(null);
        setData2(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBoth();
  }, [slug, p1, p2]);

  const filtered = (query) =>
    query.trim() ? allPlayers.filter(p => p.player_name.toLowerCase().includes(query.toLowerCase())).slice(0, 8) : [];

  const renderPicker = (label, value, set, accent) => {
    const results = filtered(value);
    const showDropdown = value.trim() && results.length > 0;
    return (
      <div className="relative">
        <label className="mb-1 block text-xs uppercase tracking-wider text-gray-600">{label}</label>
        <input
          type="text"
          value={value}
          onChange={e => set(e.target.value)}
          placeholder="Spielername..."
          className="w-full rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#00F5FF]/50"
          style={{ boxShadow: value ? `0 0 10px ${accent}20` : undefined }}
        />
        {showDropdown && (
          <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-[#1A1A24] bg-[#0F0F14] shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            {results.map(p => (
              <button
                key={p.uuid}
                onClick={() => set(p.player_name)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-[#1A1A24]"
              >
                <PlayerHead uuid={p.uuid} name={p.player_name} size={24} />
                <span className="flex-1 text-sm text-white">{p.player_name}</span>
                <span className="text-xs text-gray-600">{formatNumber(p.total)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <ServerHeader slug={slug} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link to={`/server/${slug}`} className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Zurück zum Server
        </Link>

        <h1 className="mb-6 flex items-center gap-2 text-lg font-black text-white">
          <Swords className="h-5 w-5 text-[#00F5FF]" style={{ filter: "drop-shadow(0 0 6px rgba(0,245,255,0.5))" }} />
          Spieler vergleichen
        </h1>

        <div className="grid gap-4 sm:grid-cols-2">
          {renderPicker("Spieler 1", p1, setP1, "#00F5FF")}
          {renderPicker("Spieler 2", p2, setP2, "#FF0055")}
        </div>

        {loading && (
          <div className="mt-8 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1A1A24] border-t-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.3)]"></div>
          </div>
        )}

        {!loading && data1 && data2 && (
          <div className="mt-8">
            <div className="grid grid-cols-2 gap-4">
              {[data1, data2].map((d, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <PlayerHead uuid={d.player.uuid} name={d.player.player_name} size={56} />
                  <p className="mt-2 text-sm font-bold text-white">{d.player.player_name}</p>
                  <p className="text-xs text-gray-500">Rang #{d.player.rank} / {d.player.totalPlayers}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              {[
                { label: 'Abgebaut', p1Val: data1.player.mined, p2Val: data2.player.mined },
                { label: 'Gesetzt', p1Val: data1.player.placed, p2Val: data2.player.placed },
                { label: 'Gesamt', p1Val: data1.player.total, p2Val: data2.player.total },
              ].map((stat, i) => {
                const p1Wins = stat.p1Val > stat.p2Val;
                const p2Wins = stat.p2Val > stat.p1Val;
                const max = Math.max(stat.p1Val, stat.p2Val, 1);
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs">
                      <span className={p1Wins ? 'font-bold text-[#00F5FF]' : 'text-gray-500'}>{formatNumber(stat.p1Val)}</span>
                      <span className="uppercase tracking-wider text-gray-600">{stat.label}</span>
                      <span className={p2Wins ? 'font-bold text-[#FF0055]' : 'text-gray-500'}>{formatNumber(stat.p2Val)}</span>
                    </div>
                    <div className="mt-1 flex h-2.5 gap-0.5">
                      <div className="flex justify-end overflow-hidden rounded-l bg-[#111118]" style={{ flex: 1 }}>
                        <div className="h-full rounded-l bg-[#00F5FF] transition-all duration-500" style={{ width: `${(stat.p1Val / max) * 100}%`, boxShadow: p1Wins ? "0 0 8px rgba(0,245,255,0.5)" : undefined }} />
                      </div>
                      <div className="overflow-hidden rounded-r bg-[#111118]" style={{ flex: 1 }}>
                        <div className="h-full rounded-r bg-[#FF0055] transition-all duration-500" style={{ width: `${(stat.p2Val / max) * 100}%`, boxShadow: p2Wins ? "0 0 8px rgba(255,0,85,0.5)" : undefined }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[data1, data2].map((d, i) => (
                <div key={i} className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4">
                  <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-white">⚡ Top Blöcke</h3>
                  <TopBlocksChart materials={d.topMaterials} />
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[data1, data2].map((d, i) => {
                const unlocked = (d.achievements || []).filter(a => a.unlocked).length;
                return (
                  <div key={i} className="rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-gray-600">🏆 Achievements</p>
                    <p className="mt-1 text-2xl font-black text-[#00F5FF]" style={{ textShadow: "0 0 10px rgba(0,245,255,0.3)" }}>{unlocked}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && (!data1 || !data2) && (
          <div className="mt-8 rounded-xl border border-[#1A1A24] bg-[#0A0A0F] p-8 text-center">
            <p className="text-sm text-gray-600">Wähle zwei Spieler aus, um sie zu vergleichen.</p>
          </div>
        )}
      </div>
    </div>
  );
}