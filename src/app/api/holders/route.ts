import { NextRequest, NextResponse } from 'next/server';
import { getLiveDashboardData } from '@/lib/ansem-live';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const tier = searchParams.get('tier') || 'all';
    const holderType = searchParams.get('holderType') || 'all';
    const sort = searchParams.get('sort') || 'tokensHeld';
    const sortDir = searchParams.get('sortDir') || 'desc';
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(10, Number(searchParams.get('limit') || '25')));

    const data = await getLiveDashboardData();

    let holders = data.holders.filter((holder) => {
      const matchesSearch =
        !search ||
        holder.walletAddress.toLowerCase().includes(search) ||
        holder.shortAddress.toLowerCase().includes(search) ||
        holder.walletLabel?.toLowerCase().includes(search);

      const matchesTier = tier === 'all' || holder.tier === tier;
      const matchesHolderType =
        holderType === 'all' ||
        (holderType === 'community' && !holder.isLiquidityPool) ||
        (holderType === 'lp' && holder.isLiquidityPool);

      return matchesSearch && matchesTier && matchesHolderType;
    });

    holders.sort((a, b) => {
      const direction = sortDir === 'asc' ? 1 : -1;

      if (sort === 'rank') return (a.rank - b.rank) * direction;
      if (sort === 'tokenAccountCount') return (a.tokenAccountCount - b.tokenAccountCount) * direction;
      if (sort === 'percentageOfSupply') return (Number(a.percentageOfSupply) - Number(b.percentageOfSupply)) * direction;
      if (sort === 'currentValue') return (Number(a.currentValue) - Number(b.currentValue)) * direction;

      const left = Number(a.rawAmount);
      const right = Number(b.rawAmount);
      return (left - right) * direction;
    });

    const total = holders.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const offset = (page - 1) * limit;
    const paginated = holders.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      stats: data.stats,
    });
  } catch (error) {
    console.error('Error fetching live holders:', error);
    return NextResponse.json({ error: 'Failed to fetch live holders' }, { status: 500 });
  }
}
