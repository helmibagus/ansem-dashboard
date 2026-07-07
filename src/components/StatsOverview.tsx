'use client';

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, Waves, Droplets, Fish, Layers3, Coins } from 'lucide-react';

function compactNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);
}

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: Number(value) >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

export default function StatsOverview({ stats }: { stats: any }) {
  const tierData = [
    { name: 'Whales', value: Number(stats?.whales || 0), color: '#60a5fa' },
    { name: 'Dolphins', value: Number(stats?.dolphins || 0), color: '#a855f7' },
    { name: 'Sharks', value: Number(stats?.sharks || 0), color: '#f97316' },
    { name: 'Fish', value: Number(stats?.fish || 0), color: '#22c55e' },
    { name: 'Shrimp', value: Number(stats?.shrimp || 0), color: '#9ca3af' },
  ].filter((item) => item.value > 0);

  const total = tierData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const current = payload[0].payload;

    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-xl">
        <p className="text-sm font-bold" style={{ color: current.color }}>{current.name}</p>
        <p className="text-xs text-gray-400">{current.value.toLocaleString()} wallets</p>
        <p className="text-xs text-gray-400">{total > 0 ? ((current.value / total) * 100).toFixed(2) : '0'}%</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users size={20} className="text-purple-400" />
        <h3 className="text-lg font-bold">Holder Tier Mix</h3>
      </div>

      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={tierData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
              {tierData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => <span className="text-xs text-gray-400">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
          <div className="flex items-center gap-2">
            <Waves size={16} className="text-blue-400" />
            <span className="text-sm text-gray-300">Community Holders</span>
          </div>
          <span className="text-sm font-bold text-blue-400">{compactNumber(Number(stats?.communityHolders || 0))}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl">
          <div className="flex items-center gap-2">
            <Droplets size={16} className="text-cyan-400" />
            <span className="text-sm text-gray-300">Liquidity Pool Wallets</span>
          </div>
          <span className="text-sm font-bold text-cyan-400">{compactNumber(Number(stats?.liquidityPoolWallets || 0))}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
          <div className="flex items-center gap-2">
            <Coins size={16} className="text-yellow-400" />
            <span className="text-sm text-gray-300">Top 1 Wallet Share</span>
          </div>
          <span className="text-sm font-bold text-yellow-400">{Number(stats?.top1Share || 0).toFixed(2)}%</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-orange-500/5 border border-orange-500/10 rounded-xl">
          <div className="flex items-center gap-2">
            <Fish size={16} className="text-orange-400" />
            <span className="text-sm text-gray-300">24h Liquidity</span>
          </div>
          <span className="text-sm font-bold text-orange-400">{formatCurrency(stats?.liquidityUsd || 0)}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-500/5 border border-gray-500/10 rounded-xl">
          <div className="flex items-center gap-2">
            <Layers3 size={16} className="text-gray-300" />
            <span className="text-sm text-gray-300">Primary Pair</span>
          </div>
          <span className="text-sm font-bold text-gray-300 uppercase">{stats?.primaryDex || '—'}</span>
        </div>
      </div>
    </div>
  );
}
