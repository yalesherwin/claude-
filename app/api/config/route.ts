import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const config = await prisma.raffleConfig.findUnique({
      where: { id: 'default' },
    });

    if (!config) {
      // Create default config if it doesn't exist
      const newConfig = await prisma.raffleConfig.create({
        data: {
          id: 'default',
          twitterUserId: process.env.RAFFLE_TWITTER_USER_ID || '',
          requiredTweetId: process.env.RAFFLE_TWEET_ID || '',
          prizeAmount: 5.0,
          winnersPerDay: 2,
          drawTimeHour: 7,
          drawTimeMinute: 0,
          isActive: true,
        },
      });
      return NextResponse.json({ config: newConfig });
    }

    return NextResponse.json({ config });
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const config = await prisma.raffleConfig.upsert({
      where: { id: 'default' },
      update: body,
      create: {
        id: 'default',
        ...body,
      },
    });

    return NextResponse.json({ config });
  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
