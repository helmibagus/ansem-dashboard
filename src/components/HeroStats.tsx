'use client';

function compactNumber(value: string | number, maximumFractionDigits = 2) {
  const number = typeof value === 'string' ? Number(value) : value;

  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits,
  }).format(Number.isFinite(number) ? number : 0);
}

function formatCurrency(value: string | number, maximumFractionDigits = 2) {
  const number = typeof value === 'string' ? Number(value) : value;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: number >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits,
  }).format(Number.isFinite(number) ? number : 0);
}

export default function HeroStats({ stats }: { stats: any }) {
  const change24h = Number(stats?.priceChange24h || 0);
  const lastUpdated = stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <section className="pt-24 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-4">
            <span className="text-yellow-400 text-sm">🐂 {stats?.tokenName || 'The Black Bull'}</span>
            <span className="text-xs text-gray-400">Token-2022 • Solana</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-3">
            <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
              ${stats?.tokenSymbol || 'ANSEM'}
            </span>
          </h1>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Live holder intelligence for the same token as this Solscan page. See real-time holder distribution, whale concentration, LP wallets, and check wallet positions instantly.
            </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs text-gray-500">
            <span className="px-2 py-1 bg-gray-800/50 rounded">Mint: {stats?.tokenMint?.slice(0, 6)}...{stats?.tokenMint?.slice(-4)}</span>
            <span className="px-2 py-1 bg-gray-800/50 rounded">Source: Solscan token mint</span>
            <span className="px-2 py-1 bg-gray-800/50 rounded">Updated: {lastUpdated}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-2xl p-5">
            <p className="text-xs text-gray-500 mb-1">Token Price</p>
            <p className="text-2xl font-bold text-yellow-400">
              {formatCurrency(stats?.currentPrice || 0, 6)}
            </p>
            <p className={`text-xs mt-1 ${change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change24h >= 0 ? '↑' : '↓'} {Math.abs(change24h).toFixed(2)}% 24h
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-2xl p-5">
            <p className="text-xs text-gray-500 mb-1">Market Cap</p>
            <p className="text-2xl font-bold text-blue-400">
              {formatCurrency(stats?.marketCap || 0)}
            </p>
            <p className="text-xs text-gray-400 mt-1">Supply: {compactNumber(stats?.totalSupply || 0)} ANSEM</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-2xl p-5">
            <p className="text-xs text-gray-500 mb-1">Live Holders</p>
            <p className="text-2xl font-bold text-purple-400">
              {compactNumber(stats?.totalHolders || 0, 1)}
            </p>
            <p className="text-xs text-gray-400 mt-1">Community wallets: {compactNumber(stats?.communityHolders || 0, 1)}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-5">
            <p className="text-xs text-gray-500 mb-1">24h Volume</p>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(stats?.volume24h || 0)}
            </p>
            <p className="text-xs text-gray-400 mt-1">Liquidity: {formatCurrency(stats?.liquidityUsd || 0)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
