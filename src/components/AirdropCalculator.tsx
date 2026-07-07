'use client';

import { useMemo, useState } from 'react';
import { Calculator, Coins, TrendingUp } from 'lucide-react';

function compactCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 2,
  }).format(value);
}

function compactNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 2,
  }).format(value);
}

export default function AirdropCalculator({ stats }: { stats: any }) {
  const [holdings, setHoldings] = useState('100000');
  const [targetMarketCap, setTargetMarketCap] = useState('1000000000');

  const totalSupply = Number(stats?.totalSupply || 0);
  const totalHolders = Number(stats?.communityHolders || 0);
  const currentPrice = Number(stats?.currentPrice || 0);
  const currentMarketCap = Number(stats?.marketCap || 0);
  const holdingsNum = Number(holdings || 0);
  const targetMcNum = Number(targetMarketCap || 0);

  const calculations = useMemo(() => {
    const ownershipShare = totalSupply > 0 ? (holdingsNum / totalSupply) * 100 : 0;
    const currentValue = holdingsNum * currentPrice;
    const projectedPrice = totalSupply > 0 ? targetMcNum / totalSupply : 0;
    const projectedValue = holdingsNum * projectedPrice;
    const averageHolderBalance = totalHolders > 0 ? totalSupply / totalHolders : 0;
    const holderMultiple = averageHolderBalance > 0 ? holdingsNum / averageHolderBalance : 0;
    const upside = currentValue > 0 ? ((projectedValue - currentValue) / currentValue) * 100 : 0;

    return {
      ownershipShare,
      currentValue,
      projectedPrice,
      projectedValue,
      averageHolderBalance,
      holderMultiple,
      upside,
    };
  }, [holdingsNum, targetMcNum, totalSupply, totalHolders, currentPrice]);

  const targetPresets = [500000000, 1000000000, 2000000000, 5000000000];

  return (
    <div id="calculator" className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator size={20} className="text-yellow-400" />
        <h3 className="text-lg font-bold">Position Calculator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
          <label className="text-xs text-gray-400 block mb-1">Your $ANSEM holdings</label>
          <input
            type="number"
            value={holdings}
            onChange={(e) => setHoldings(e.target.value)}
            placeholder="Example: 100000"
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-2">Target Market Cap</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {targetPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => setTargetMarketCap(String(preset))}
                className={`px-3 py-2 rounded-xl text-xs transition-colors ${
                  targetMarketCap === String(preset)
                    ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                    : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-yellow-400'
                }`}
              >
                ${compactNumber(preset)}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={targetMarketCap}
            onChange={(e) => setTargetMarketCap(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-500/50"
          />
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-800/30 p-4 text-sm text-gray-400">
          Current market cap: <span className="text-white font-semibold">{compactCurrency(currentMarketCap)}</span>
          <br />
          Live community holders: <span className="text-white font-semibold">{compactNumber(totalHolders)}</span>
        </div>
        </div>

        <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5 space-y-4">
          <h4 className="text-sm font-bold text-gray-300 flex items-center gap-2">
            <Coins size={16} className="text-yellow-400" />
            Estimasi Posisi
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Share of Supply</span>
              <span className="text-sm font-bold text-yellow-400">{calculations.ownershipShare.toFixed(6)}%</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Current Value</span>
              <span className="text-sm font-bold text-blue-400">{compactCurrency(calculations.currentValue)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Price at Target MC</span>
              <span className="text-sm font-bold text-green-400">{compactCurrency(calculations.projectedPrice)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Projected Value</span>
              <span className="text-sm font-bold text-green-400">{compactCurrency(calculations.projectedValue)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Avg Balance vs Your Bag</span>
              <span className="text-sm font-bold text-purple-400">{calculations.holderMultiple.toFixed(2)}x</span>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white flex items-center gap-1">
                  <TrendingUp size={14} className="text-yellow-400" />
                  Upside to Target
                </span>
                <span className={`text-xl font-black ${calculations.upside >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {Number.isFinite(calculations.upside) ? `${calculations.upside.toFixed(2)}%` : '—'}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Average community holder balance: {compactNumber(calculations.averageHolderBalance)} ANSEM
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
