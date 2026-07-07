'use client';

import { useEffect, useState } from 'react';
import { Search, ChevronUp, ChevronDown, Wallet, ArrowUpDown } from 'lucide-react';

type Holder = {
  id: number;
  rank: number;
  walletAddress: string;
  shortAddress: string;
  walletLabel: string | null;
  tokensHeld: string;
  rawAmount: string;
  currentValue: string;
  percentageOfSupply: string;
  tokenAccountCount: number;
  tier: 'lp' | 'whale' | 'dolphin' | 'shark' | 'fish' | 'shrimp';
  isLiquidityPool: boolean;
};

export default function HolderTable() {
  const [holders, setHolders] = useState<Holder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [holderType, setHolderType] = useState('all');
  const [sortField, setSortField] = useState('tokensHeld');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    const fetchHolders = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search,
          tier: tierFilter,
          holderType,
          sort: sortField,
          sortDir,
          page: String(page),
          limit: '25',
        });

        const res = await fetch(`/api/holders?${params.toString()}`, { cache: 'no-store' });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch holders');
        }

        setHolders(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalRows(data.pagination?.total || 0);
      } catch (error) {
        console.error('Error fetching holders:', error);
        setHolders([]);
        setTotalPages(1);
        setTotalRows(0);
      } finally {
        setLoading(false);
      }
    };

    fetchHolders();
  }, [search, tierFilter, holderType, sortField, sortDir, page]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const compactNumber = (value: string | number, maximumFractionDigits = 2) =>
    new Intl.NumberFormat('en-US', {
      notation: Number(value) >= 1000 ? 'compact' : 'standard',
      maximumFractionDigits,
    }).format(Number(value) || 0);

  const compactCurrency = (value: string | number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: Number(value) >= 1000 ? 'compact' : 'standard',
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);

  const tierColors: Record<Holder['tier'], string> = {
    lp: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    whale: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    dolphin: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    shark: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    fish: 'bg-green-500/20 text-green-300 border-green-500/30',
    shrimp: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="text-gray-600 ml-1" />;
    return sortDir === 'desc' ? <ChevronDown size={12} className="text-yellow-400 ml-1" /> : <ChevronUp size={12} className="text-yellow-400 ml-1" />;
  };

  return (
    <div id="holders" className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Wallet size={20} className="text-yellow-400" />
            Live Holder Leaderboard
          </h3>
          <p className="text-xs text-gray-500 mt-1">Unique holders ranked by live non-zero $ANSEM balance</p>
        </div>
        <div className="text-xs text-gray-500">{compactNumber(totalRows, 1)} wallets match current filters</div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search address or label..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
          />
        </div>

        <select
          value={holderType}
          onChange={(e) => {
            setHolderType(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-yellow-500/50"
        >
          <option value="all">All Wallet Types</option>
          <option value="community">Community Only</option>
          <option value="lp">LP Wallets Only</option>
        </select>

        <select
          value={tierFilter}
          onChange={(e) => {
            setTierFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-yellow-500/50"
        >
          <option value="all">All Tiers</option>
          <option value="lp">LP</option>
          <option value="whale">Whale</option>
          <option value="dolphin">Dolphin</option>
          <option value="shark">Shark</option>
          <option value="fish">Fish</option>
          <option value="shrimp">Shrimp</option>
        </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[860px]">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500">
              <th className="py-3 px-3 text-left font-medium cursor-pointer hover:text-yellow-400" onClick={() => handleSort('rank')}>
                <span className="flex items-center">Rank<SortIcon field="rank" /></span>
              </th>
              <th className="py-3 px-3 text-left font-medium">Wallet</th>
              <th className="py-3 px-3 text-left font-medium">Tier</th>
              <th className="py-3 px-3 text-left font-medium cursor-pointer hover:text-yellow-400" onClick={() => handleSort('tokensHeld')}>
                <span className="flex items-center">Held<SortIcon field="tokensHeld" /></span>
              </th>
              <th className="py-3 px-3 text-left font-medium cursor-pointer hover:text-yellow-400" onClick={() => handleSort('percentageOfSupply')}>
                <span className="flex items-center">% Supply<SortIcon field="percentageOfSupply" /></span>
              </th>
              <th className="py-3 px-3 text-left font-medium cursor-pointer hover:text-yellow-400" onClick={() => handleSort('tokenAccountCount')}>
                <span className="flex items-center">Accounts<SortIcon field="tokenAccountCount" /></span>
              </th>
              <th className="py-3 px-3 text-left font-medium cursor-pointer hover:text-yellow-400" onClick={() => handleSort('currentValue')}>
                <span className="flex items-center">Value<SortIcon field="currentValue" /></span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-800/50">
                  {Array.from({ length: 7 }).map((_, columnIndex) => (
                    <td key={columnIndex} className="py-4 px-3">
                      <div className="h-4 bg-gray-800 rounded animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : holders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-500">
                  <Wallet size={32} className="mx-auto mb-3 opacity-50" />
                  <p>No holders match current filters.</p>
                </td>
              </tr>
            ) : (
              holders.map((holder) => (
                <tr key={`${holder.walletAddress}-${holder.rank}`} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-3 text-gray-300 font-medium">#{holder.rank}</td>
                  <td className="py-3 px-3">
                    <div>
                      <p className="font-mono text-xs text-gray-300">{holder.walletAddress}</p>
                      <p className="text-[10px] text-yellow-400/80 mt-0.5">{holder.walletLabel || holder.shortAddress}</p>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] border uppercase ${tierColors[holder.tier]}`}>
                      {holder.tier}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-white">{compactNumber(holder.tokensHeld, 4)} ANSEM</td>
                  <td className="py-3 px-3 text-green-400 font-medium">{Number(holder.percentageOfSupply).toFixed(6)}%</td>
                  <td className="py-3 px-3 text-gray-300">{holder.tokenAccountCount}</td>
                  <td className="py-3 px-3 font-medium text-blue-400">{compactCurrency(holder.currentValue)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm disabled:opacity-30 hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((current) => current + 1)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm disabled:opacity-30 hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
