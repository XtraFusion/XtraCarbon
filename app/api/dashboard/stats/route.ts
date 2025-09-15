import { NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/utils/database';
import { auth } from '@clerk/nextjs/server';

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await AnalyticsService.getDashboardStats();

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
