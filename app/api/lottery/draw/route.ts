import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, subDays } from 'date-fns';

export async function POST(req: NextRequest) {
  try {
    // Simple API key authentication for cron job
    const authHeader = req.headers.get('authorization');
    const apiKey = process.env.CRON_API_KEY || 'your-secret-cron-key';

    if (authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get yesterday's date (since this runs at 7 AM, we draw for the previous day)
    const yesterday = startOfDay(subDays(new Date(), 1));

    // Check if lottery already drawn for this date
    const existingWinners = await prisma.winner.findMany({
      where: { date: yesterday },
    });

    if (existingWinners.length > 0) {
      return NextResponse.json({
        error: 'Lottery already drawn for this date',
        winners: existingWinners,
      });
    }

    // Get all eligible participants from yesterday
    const participants = await prisma.participant.findMany({
      where: {
        date: yesterday,
        isEligible: true,
      },
    });

    if (participants.length === 0) {
      return NextResponse.json({
        message: 'No eligible participants for this date',
        winners: [],
      });
    }

    // Get raffle configuration
    const config = await prisma.raffleConfig.findUnique({
      where: { id: 'default' },
    });

    const winnersCount = Math.min(config?.winnersPerDay || 2, participants.length);

    // Randomly select winners
    const shuffled = participants.sort(() => Math.random() - 0.5);
    const selectedWinners = shuffled.slice(0, winnersCount);

    // Create winner records
    const winners = await Promise.all(
      selectedWinners.map((participant) =>
        prisma.winner.create({
          data: {
            userId: participant.userId,
            date: yesterday,
            prizeAmount: config?.prizeAmount || 5.0,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                twitterHandle: true,
              },
            },
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `${winners.length} winners selected`,
      winners,
    });
  } catch (error) {
    console.error('Error in lottery draw:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
