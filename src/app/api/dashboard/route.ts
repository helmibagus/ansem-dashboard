import { NextResponse } from 'next/server';
import { getLiveDashboardData } from '@/lib/ansem-live';

export async function GET() {
  try {
    const data = await getLiveDashboardData();

    return NextResponse.json({
      stats: data.stats,
      topHolders: data.topHolders,
      fetchedAt: data.stats.lastUpdated,
    });
  } catch (error) {
    console.error('Error fetching live dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch live dashboard data' }, { status: 500 });
  }
}
