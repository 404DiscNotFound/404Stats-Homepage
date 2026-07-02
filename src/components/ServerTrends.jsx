import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatNumber } from "@/lib/format";
import { useT } from "@/lib/i18n";

export default function ServerTrends({ trends }) {
  const t = useT();
  if (!trends || trends.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-600">{t("trends.noData")}</p>;
  }

  const data = trends.map(t => ({
    date: t.date.split('-').slice(1).join('.'),
    mined: t.mined,
    placed: t.placed,
    total: t.total
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorMined" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#00F5FF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPlaced" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF0055" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#FF0055" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={{ fill: '#444', fontSize: 10 }} interval="preserveStartEnd" />
        <YAxis tick={{ fill: '#444', fontSize: 10 }} tickFormatter={formatNumber} />
        <Tooltip
          contentStyle={{ background: '#0A0A0F', border: '1px solid #1A1A24', borderRadius: '8px', fontSize: '12px' }}
          labelStyle={{ color: '#666' }}
          formatter={(v, n) => [formatNumber(v), n === 'mined' ? t("common.mined") : t("common.placed")]}
        />
        <Area type="monotone" dataKey="mined" stroke="#00F5FF" fill="url(#colorMined)" strokeWidth={2} />
        <Area type="monotone" dataKey="placed" stroke="#FF0055" fill="url(#colorPlaced)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}