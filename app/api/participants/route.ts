import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date');
    const date = dateParam ? new Date(dateParam) : new Date();
    const targetDate = startOfDay(date);

    const participants = await prisma.participant.findMany({
      where: {
        date: targetDate,
        isEligible: true,
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
      orderBy: {
        participatedAt: 'asc',
      },
    });

    return NextResponse.json({ participants });
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
