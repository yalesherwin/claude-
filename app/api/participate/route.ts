import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { verifyUserActions } from '@/lib/twitter';
import { startOfDay } from 'date-fns';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.twitterId) {
      return NextResponse.json({ error: 'Twitter account not linked' }, { status: 400 });
    }

    // Check if user already participated today
    const today = startOfDay(new Date());
    const existingParticipant = await prisma.participant.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
    });

    if (existingParticipant) {
      return NextResponse.json({ error: 'Already participated today' }, { status: 400 });
    }

    // Get raffle configuration
    const config = await prisma.raffleConfig.findUnique({
      where: { id: 'default' },
    });

    if (!config || !config.isActive) {
      return NextResponse.json({ error: 'Raffle is not active' }, { status: 400 });
    }

    // Verify Twitter actions
    const { hasFollowed, hasRetweeted, hasCommented } = await verifyUserActions(
      user.twitterId,
      config.twitterUserId,
      config.requiredTweetId
    );

    const isEligible = hasFollowed && hasRetweeted && hasCommented;

    // Create participation record
    const participant = await prisma.participant.create({
      data: {
        userId: user.id,
        date: today,
        hasFollowed,
        hasRetweeted,
        hasCommented,
        isEligible,
      },
    });

    return NextResponse.json({
      success: true,
      participant: {
        hasFollowed,
        hasRetweeted,
        hasCommented,
        isEligible,
      },
    });
  } catch (error) {
    console.error('Error in participate endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
