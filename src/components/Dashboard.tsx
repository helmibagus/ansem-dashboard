'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import HeroStats from '@/components/HeroStats';
import PriceChart from '@/components/PriceChart';
import StatsOverview from '@/components/StatsOverview';
import HolderTable from '@/components/HolderTable';
import AirdropCalculator from '@/components/AirdropCalculator';
import WalletChecker from '@/components/WalletChecker';

type DashboardPayload = {
  stats: any;
  topHolders: any[];
  fetchedAt?: string;
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError('');
        const res = await fetch('/api/dashboard', { cache: 'no-store' });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch dashboard');
        }

        setDashboardData(data);
      } catch (fetchError) {
        console.error('Error fetching dashboard:', fetchError);
        setError('Gagal mengambil live holder data. Coba refresh lagi dalam beberapa detik.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🐂</div>
          <h1 className="text-2xl font-bold text-white mb-2">$ANSEM Live Holders</h1>
          <p className="text-gray-400">Mengambil data holder real-time dari mint yang sama dengan Solscan...</p>
          <div className="mt-4 flex justify-center gap-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Header />
      <HeroStats stats={dashboardData?.stats} />

      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="flex items-center justify-center gap-3 px-4 py-2.5 bg-gray-900/80 border border-gray-800 rounded-xl text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11.99 2.004a.75.75 0 01.53 1.28l-3.25 6.5a.75.75 0 01-1.28-.53v-6.5a.75.75 0 011.28-.53l3.25 6.5a.75.75 0 01-.53 1.28H2.75a.75.75 0 01-.75-.75V9.5a.75.75 0 01.22-.53l6.5-3.25a.75.75 0 01.53 0l6.5 3.25a.75.75 0 01.22.53v2.754a.75.75 0 01-.75.75h-8.5a.75.75 0 01-.53-1.28z"/>
            </svg>
            <span className="font-medium text-white">LIVE Market Data</span>
          </div>
          <span className="text-gray-500">•</span>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 20l16-16"/>
            </svg>
            <span className="text-gray-300">Source: DexScreener</span>
          </div>
        </div>
      </div>

      {error ? (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        </div>
      ) : null}

      <WalletChecker stats={dashboardData?.stats} />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PriceChart data={dashboardData?.topHolders || []} stats={dashboardData?.stats} />
          <StatsOverview stats={dashboardData?.stats} />
        </div>
        <AirdropCalculator stats={dashboardData?.stats} />
        <HolderTable />
      </div>

      <footer className="border-t border-gray-800 mt-16 py-8 text-center px-4">
        <p className="text-gray-400 text-sm">
          🐂 $ANSEM Live Holder Intelligence • Mint source from Solscan token page • Holder balances aggregated on-chain
        </p>
        <p className="text-gray-600 text-xs mt-2">
          Source mint: {dashboardData?.stats?.tokenMint} • Refreshed around every 60 seconds • Price data via DexScreener
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <img src="https://unavatar.io/twitter/Seung_ha_" alt="@Seung_ha_ avatar" className="w-8 h-8 rounded-full" />
          <a
            href="https://x.com/Seung_ha_"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-yellow-400 transition-colors"
          >
            Made by @Seung_ha_
          </a>
        </div>
      </footer>
    </div>
  );
}
