import bs58 from 'bs58';

export const ANSEM_TOKEN_MINT = '9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump';
const TOKEN_2022_PROGRAM = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const SOLSCAN_TOKEN_URL = `https://solscan.io/token/${ANSEM_TOKEN_MINT}`;
const CACHE_TTL_MS = 60_000;

type RpcEnvelope<T> = {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
  };
};

type MintAccountInfo = {
  value: {
    data: {
      parsed: {
        info: {
          decimals: number;
          supply: string;
          extensions?: Array<{
            extension: string;
            state?: {
              name?: string;
              symbol?: string;
              uri?: string;
            };
          }>;
        };
      };
      program: string;
      space: number;
    };
    owner: string;
  } | null;
};

type ProgramAccountSlice = {
  pubkey: string;
  account: {
    data: [string, string];
  };
};

type DexScreenerPair = {
  dexId: string;
  pairAddress: string;
  priceUsd?: string;
  marketCap?: number;
  fdv?: number;
  liquidity?: {
    usd?: number;
  };
  volume?: {
    h24?: number;
  };
  priceChange?: {
    h24?: number;
  };
  pairCreatedAt?: number;
};

type DexScreenerResponse = {
  pairs?: DexScreenerPair[];
};

type AggregatedHolder = {
  walletAddress: string;
  rawAmount: bigint;
  tokenAccountCount: number;
};

export type LiveHolder = {
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

export type LiveStats = {
  tokenMint: string;
  tokenName: string;
  tokenSymbol: string;
  tokenProgram: string;
  metadataUri: string | null;
  totalSupply: string;
  totalSupplyRaw: string;
  totalHolders: number;
  communityHolders: number;
  liquidityPoolWallets: number;
  currentPrice: string;
  marketCap: string;
  liquidityUsd: string;
  volume24h: string;
  priceChange24h: string;
  top10Share: string;
  top1Share: string;
  whales: number;
  dolphins: number;
  sharks: number;
  fish: number;
  shrimp: number;
  lastUpdated: string;
  sourceUrl: string;
  primaryDex: string | null;
  primaryPairAddress: string | null;
};

export type LiveDashboardData = {
  stats: LiveStats;
  holders: LiveHolder[];
  topHolders: LiveHolder[];
};

const cache: {
  data: LiveDashboardData | null;
  expiresAt: number;
  promise: Promise<LiveDashboardData> | null;
} = {
  data: null,
  expiresAt: 0,
  promise: null,
};

async function rpc<T>(method: string, params: unknown[]): Promise<T> {
  const response = await fetch(SOLANA_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`RPC ${method} failed with status ${response.status}`);
  }

  const payload = (await response.json()) as RpcEnvelope<T>;

  if (payload.error || payload.result === undefined) {
    throw new Error(payload.error?.message || `RPC ${method} returned no result`);
  }

  return payload.result;
}

function shortenAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

function trimNumericString(value: string, maxDecimals = 6) {
  const [whole, decimal] = value.split('.');
  if (!decimal) return whole;
  const trimmed = decimal.slice(0, maxDecimals).replace(/0+$/, '');
  return trimmed ? `${whole}.${trimmed}` : whole;
}

function formatTokenAmount(rawAmount: bigint, decimals: number) {
  const divisor = 10 ** decimals;
  return trimNumericString((Number(rawAmount) / divisor).toFixed(decimals), decimals);
}

function classifyTier(sharePercent: number, isLiquidityPool: boolean): LiveHolder['tier'] {
  if (isLiquidityPool) return 'lp';
  if (sharePercent >= 0.5) return 'whale';
  if (sharePercent >= 0.1) return 'dolphin';
  if (sharePercent >= 0.01) return 'shark';
  if (sharePercent >= 0.001) return 'fish';
  return 'shrimp';
}

function titleizeDex(dexId: string) {
  return dexId
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

async function getMintDetails() {
  const accountInfo = await rpc<MintAccountInfo>('getAccountInfo', [ANSEM_TOKEN_MINT, { encoding: 'jsonParsed' }]);

  if (!accountInfo.value) {
    throw new Error('Mint account not found');
  }

  const parsedInfo = accountInfo.value.data.parsed.info;
  const metadataExtension = parsedInfo.extensions?.find((extension) => extension.extension === 'tokenMetadata');

  return {
    name: metadataExtension?.state?.name || 'The Black Bull',
    symbol: metadataExtension?.state?.symbol || 'ANSEM',
    metadataUri: metadataExtension?.state?.uri || null,
    decimals: parsedInfo.decimals,
    supplyRaw: BigInt(parsedInfo.supply),
    tokenProgram: accountInfo.value.owner,
  };
}

async function getDexMarket() {
  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${ANSEM_TOKEN_MINT}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`DexScreener failed with status ${response.status}`);
    }

    const payload = (await response.json()) as DexScreenerResponse;
    const pairs = payload.pairs || [];

    if (pairs.length === 0) {
      return { bestPair: null, pairLabels: new Map<string, string>() };
    }

    const sortedPairs = [...pairs].sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0));
    const pairLabels = new Map<string, string>();

    for (const pair of pairs) {
      if (pair.pairAddress) {
        pairLabels.set(pair.pairAddress, `${titleizeDex(pair.dexId)} LP`);
      }
    }

    return { bestPair: sortedPairs[0] || null, pairLabels };
  } catch (error) {
    console.error('Dex market fetch failed:', error);
    return { bestPair: null, pairLabels: new Map<string, string>() };
  }
}

async function getAggregatedHolders() {
  const result = await rpc<ProgramAccountSlice[]>('getProgramAccounts', [
    TOKEN_2022_PROGRAM,
    {
      encoding: 'base64',
      dataSlice: { offset: 32, length: 40 },
      filters: [{ memcmp: { offset: 0, bytes: ANSEM_TOKEN_MINT } }],
    },
  ]);

  const holderMap = new Map<string, AggregatedHolder>();

  for (const tokenAccount of result) {
    const encodedSlice = tokenAccount.account.data[0];
    const buffer = Buffer.from(encodedSlice, 'base64');

    if (buffer.length < 40) continue;

    const owner = bs58.encode(buffer.subarray(0, 32));
    const rawAmount = buffer.readBigUInt64LE(32);

    if (rawAmount <= BigInt(0)) continue;

    const current = holderMap.get(owner);

    if (current) {
      current.rawAmount += rawAmount;
      current.tokenAccountCount += 1;
    } else {
      holderMap.set(owner, {
        walletAddress: owner,
        rawAmount,
        tokenAccountCount: 1,
      });
    }
  }

  return [...holderMap.values()].sort((a, b) => (a.rawAmount === b.rawAmount ? 0 : a.rawAmount > b.rawAmount ? -1 : 1));
}

async function buildLiveDashboardData(): Promise<LiveDashboardData> {
  const [mintDetails, dexMarket, aggregatedHolders] = await Promise.all([
    getMintDetails(),
    getDexMarket(),
    getAggregatedHolders(),
  ]);

  const supply = Number(mintDetails.supplyRaw) / 10 ** mintDetails.decimals;
  const currentPrice = Number(dexMarket.bestPair?.priceUsd || 0);
  const liquidityUsd = Number(dexMarket.bestPair?.liquidity?.usd || 0);
  const volume24h = Number(dexMarket.bestPair?.volume?.h24 || 0);
  const marketCap = Number(dexMarket.bestPair?.marketCap || dexMarket.bestPair?.fdv || supply * currentPrice);
  const priceChange24h = Number(dexMarket.bestPair?.priceChange?.h24 || 0);

  const holders: LiveHolder[] = aggregatedHolders.map((holder, index) => {
    const tokenAmount = Number(holder.rawAmount) / 10 ** mintDetails.decimals;
    const sharePercent = supply > 0 ? (tokenAmount / supply) * 100 : 0;
    const isLiquidityPool = dexMarket.pairLabels.has(holder.walletAddress);

    return {
      id: index + 1,
      rank: index + 1,
      walletAddress: holder.walletAddress,
      shortAddress: shortenAddress(holder.walletAddress),
      walletLabel: dexMarket.pairLabels.get(holder.walletAddress) || null,
      tokensHeld: trimNumericString(tokenAmount.toFixed(mintDetails.decimals), mintDetails.decimals),
      rawAmount: holder.rawAmount.toString(),
      currentValue: currentPrice > 0 ? (tokenAmount * currentPrice).toFixed(2) : '0',
      percentageOfSupply: sharePercent.toFixed(6),
      tokenAccountCount: holder.tokenAccountCount,
      tier: classifyTier(sharePercent, isLiquidityPool),
      isLiquidityPool,
    };
  });

  const communityHolders = holders.filter((holder) => !holder.isLiquidityPool);
  const topHolders = communityHolders.slice(0, 12);
  const top10Share = holders.slice(0, 10).reduce((sum, holder) => sum + Number(holder.percentageOfSupply), 0);
  const top1Share = holders[0] ? Number(holders[0].percentageOfSupply) : 0;

  const tierCounts = communityHolders.reduce(
    (acc, holder) => {
      if (holder.tier === 'whale') acc.whales += 1;
      else if (holder.tier === 'dolphin') acc.dolphins += 1;
      else if (holder.tier === 'shark') acc.sharks += 1;
      else if (holder.tier === 'fish') acc.fish += 1;
      else acc.shrimp += 1;
      return acc;
    },
    { whales: 0, dolphins: 0, sharks: 0, fish: 0, shrimp: 0 },
  );

  return {
    stats: {
      tokenMint: ANSEM_TOKEN_MINT,
      tokenName: mintDetails.name,
      tokenSymbol: mintDetails.symbol,
      tokenProgram: mintDetails.tokenProgram,
      metadataUri: mintDetails.metadataUri,
      totalSupply: formatTokenAmount(mintDetails.supplyRaw, mintDetails.decimals),
      totalSupplyRaw: mintDetails.supplyRaw.toString(),
      totalHolders: holders.length,
      communityHolders: communityHolders.length,
      liquidityPoolWallets: holders.length - communityHolders.length,
      currentPrice: currentPrice.toFixed(6),
      marketCap: marketCap.toFixed(2),
      liquidityUsd: liquidityUsd.toFixed(2),
      volume24h: volume24h.toFixed(2),
      priceChange24h: priceChange24h.toFixed(2),
      top10Share: top10Share.toFixed(2),
      top1Share: top1Share.toFixed(2),
      whales: tierCounts.whales,
      dolphins: tierCounts.dolphins,
      sharks: tierCounts.sharks,
      fish: tierCounts.fish,
      shrimp: tierCounts.shrimp,
      lastUpdated: new Date().toISOString(),
      sourceUrl: SOLSCAN_TOKEN_URL,
      primaryDex: dexMarket.bestPair?.dexId || null,
      primaryPairAddress: dexMarket.bestPair?.pairAddress || null,
    },
    holders,
    topHolders,
  };
}

export async function getLiveDashboardData() {
  const now = Date.now();

  if (cache.data && cache.expiresAt > now) {
    return cache.data;
  }

  if (cache.promise) {
    return cache.promise;
  }

  cache.promise = buildLiveDashboardData()
    .then((data) => {
      cache.data = data;
      cache.expiresAt = Date.now() + CACHE_TTL_MS;
      cache.promise = null;
      return data;
    })
    .catch((error) => {
      cache.promise = null;
      throw error;
    });

  return cache.promise;
}
