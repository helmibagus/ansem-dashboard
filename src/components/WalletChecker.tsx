'use client';

import { useState } from 'react';
import { Search, Wallet, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

function compactNumber(value: string | number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat('en-US', {
    notation: Number(value) >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits,
  }).format(Number(value) || 0);
}

function compactCurrency(value: string | number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: Number(value) >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

export default function WalletChecker({ stats }: { stats: any }) {
  const [wallet, setWallet] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkWallet = async () => {
    if (!wallet.trim()) {
      setError('Enter the wallet address first.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/check-wallet?wallet=${encodeURIComponent(wallet.trim())}`, { cache: 'no-store' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to check wallet');
      }

      setResult(data);
    } catch (requestError) {
      console.error(requestError);
      setError('Gagal mengecek wallet. Coba lagi beberapa saat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="tracker" className="max-w-7xl mx-auto px-4">
      <div className="bg-gradient-to-r from-yellow-500/5 via-orange-500/5 to-red-500/5 border border-yellow-500/20 rounded-2xl p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold flex items-center justify-center gap-2">
            <Wallet size={20} className="text-yellow-400" />
            Wallet Checker
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Check if a wallet is currently holding $ANSEM and see its live ranking.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={wallet}
              onChange={(e) => {
                setWallet(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && checkWallet()}
              placeholder="Enter the wallet address first"
              className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
            />
          </div>
          <button
            onClick={checkWallet}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm whitespace-nowrap"
          >
            {loading ? 'Checking...' : 'Check Wallet'}
          </button>
        </div>

        {error ? (
          <div className="max-w-3xl mx-auto mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-300">{error}</span>
          </div>
        ) : null}

        {result ? (
          <div className="max-w-3xl mx-auto mt-6">
            {result.found ? (
              <div className="bg-gray-900/80 border border-green-500/20 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-400" />
                  <h3 className="font-bold text-green-400">Wallet is a live holder</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Wallet</p>
                    <p className="font-mono text-sm text-white break-all">{result.data.walletAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rank</p>
                    <p className="text-sm font-bold text-yellow-400">#{result.data.rank}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Label</p>
                    <p className="text-sm text-white">{result.data.walletLabel || 'Regular holder'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tier</p>
                    <p className="text-sm font-bold text-purple-400 uppercase">{result.data.tier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tokens Held</p>
                    <p className="text-sm font-bold text-white">{compactNumber(result.data.tokensHeld, 4)} ANSEM</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current Value</p>
                    <p className="text-sm font-bold text-blue-400">{compactCurrency(result.data.currentValue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Share of Supply</p>
                    <p className="text-sm font-bold text-green-400">{Number(result.data.percentageOfSupply).toFixed(6)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Token Accounts</p>
                    <p className="text-sm font-bold text-white">{result.data.tokenAccountCount}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-xs text-yellow-300">
                  Source: {result.source} • Updated: {new Date(result.updatedAt).toLocaleString('en-US')}
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-5 flex items-center gap-3">
                <XCircle size={24} className="text-gray-500" />
                <div>
                  <h3 className="font-bold text-gray-300">Wallet not in live holder list</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    This wallet currently has zero $ANSEM balance in the latest live snapshot.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : null}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mt-6">
          <div className="bg-gray-900/50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-purple-400">{compactNumber(stats?.totalHolders || 0, 1)}</p>
            <p className="text-[10px] text-gray-500">Live Holders</p>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-blue-400">{compactNumber(stats?.communityHolders || 0, 1)}</p>
            <p className="text-[10px] text-gray-500">Community</p>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-cyan-400">{compactNumber(stats?.liquidityPoolWallets || 0)}</p>
            <p className="text-[10px] text-gray-500">LP Wallets</p>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-yellow-400">{Number(stats?.top10Share || 0).toFixed(2)}%</p>
            <p className="text-[10px] text-gray-500">Top 10 Share</p>
          </div>
        </div>
      </div>
    </section>
  );
}
