import { NextRequest, NextResponse } from 'next/server';
import { getLiveDashboardData } from '@/lib/ansem-live';

export async function GET(request: NextRequest) {
  try {
    const wallet = (request.nextUrl.searchParams.get('wallet') || '').trim();

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    const data = await getLiveDashboardData();
    const normalizedWallet = wallet.toLowerCase();

    const exactMatch = data.holders.find((holder) => holder.walletAddress.toLowerCase() === normalizedWallet);
    const prefixMatch = exactMatch || data.holders.find((holder) => holder.walletAddress.toLowerCase().startsWith(normalizedWallet));

    if (!prefixMatch) {
      return NextResponse.json({
        found: false,
        wallet,
        source: data.stats.sourceUrl,
        updatedAt: data.stats.lastUpdated,
      });
    }

    return NextResponse.json({
      found: true,
      data: prefixMatch,
      source: data.stats.sourceUrl,
      updatedAt: data.stats.lastUpdated,
    });
  } catch (error) {
    console.error('Error checking live wallet:', error);
    return NextResponse.json({ error: 'Failed to check wallet' }, { status: 500 });
  }
}
