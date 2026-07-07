'use client';

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3 } from 'lucide-react';

type HolderPoint = {
  rank: number;
  shortAddress: string;
  walletLabel: string | null;
  percentageOfSupply: string;
  currentValue: string;
  tokensHeld: string;
  isLiquidityPool?: boolean;
};

function compactCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 2,
  }).format(value);
}

export default function PriceChart({ data, stats }: { data: HolderPoint[]; stats: any }) {
  const chartData = data.map((holder) => ({
    name: `#${holder.rank}`,
    wallet: holder.walletLabel || holder.shortAddress,
    share: Number(holder.percentageOfSupply),
    value: Number(holder.currentValue),
    amount: Number(holder.tokensHeld),
    fill: holder.isLiquidityPool ? '#60a5fa' : '#fbbf24',
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const current = payload[0].payload;
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-xl max-w-xs">
        <p className="text-sm font-bold text-yellow-400">{current.wallet}</p>
        <p className="text-xs text-gray-400">Share of supply: {current.share.toFixed(4)}%</p>
        <p className="text-xs text-gray-400">Holdings: {current.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ANSEM</p>
        <p className="text-xs text-gray-400">Value: {compactCurrency(current.value)}</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <BarChart3 size={20} className="text-yellow-400" />
            Top Holder Concentration
          </h3>
          <p className="text-xs text-gray-500 mt-1">Distribusi top wallet non-LP berdasarkan persentase supply</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{Number(stats?.top10Share || 0).toFixed(2)}%</p>
          <p className="text-xs text-gray-400">Top 10 share of total supply</p>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value: number) => `${value.toFixed(2)}%`} />
            <Tooltip cursor={{ fill: 'rgba(251, 191, 36, 0.08)' }} content={<CustomTooltip />} />
            <Bar dataKey="share" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`${entry.name}-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
