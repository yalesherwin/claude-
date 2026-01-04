import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date');
    const limit = parseInt(searchParams.get('limit') || '10');

    let winners;

    if (dateParam) {
      const date = startOfDay(new Date(dateParam));
      winners = await prisma.winner.findMany({
        where: {
          date,
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
          wonAt: 'desc',
        },
      });
    } else {
      winners = await prisma.winner.findMany({
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
          wonAt: 'desc',
        },
        take: limit,
      });
    }

    return NextResponse.json({ winners });
  } catch (error) {
    console.error('Error fetching winners:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
