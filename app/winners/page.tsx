'use client';

import { useState, useEffect } from 'react';
import { Trophy, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import Link from 'next/link';

interface Winner {
  id: string;
  wonAt: string;
  prizeAmount: number;
  date: string;
  user: {
    id: string;
    name: string;
    image: string;
    twitterHandle: string;
  };
}

export default function WinnersPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWinners: 0,
    totalPrizeAmount: 0,
    thisMonthWinners: 0,
  });

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/winners?limit=100');
      const data = await res.json();
      setWinners(data.winners || []);

      // Calculate stats
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);

      const thisMonthWinners = data.winners.filter((w: Winner) => {
        const wonDate = new Date(w.wonAt);
        return wonDate >= monthStart && wonDate <= monthEnd;
      });

      const totalPrize = data.winners.reduce((sum: number, w: Winner) => sum + w.prizeAmount, 0);

      setStats({
        totalWinners: data.winners.length,
        totalPrizeAmount: totalPrize,
        thisMonthWinners: thisMonthWinners.length,
      });
    } catch (err) {
      console.error('Error fetching winners:', err);
    } finally {
      setLoading(false);
    }
  };

  // Group winners by date
  const groupedWinners = winners.reduce((groups, winner) => {
    const date = format(new Date(winner.date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(winner);
    return groups;
  }, {} as Record<string, Winner[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>返回首页</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  中奖历史
                </h1>
                <p className="text-sm text-gray-600">所有中奖记录</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">总中奖人数</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalWinners}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">总奖金金额</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">${stats.totalPrizeAmount}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">本月中奖</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.thisMonthWinners}</p>
          </div>
        </div>

        {/* Winners List */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6">中奖记录</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">加载中...</p>
            </div>
          ) : winners.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">暂无中奖记录</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.keys(groupedWinners)
                .sort((a, b) => b.localeCompare(a))
                .map((date) => (
                  <div key={date} className="space-y-3">
                    <div className="flex items-center space-x-2 mb-4">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {format(new Date(date), 'yyyy年MM月dd日')}
                      </h3>
                      <span className="text-sm text-gray-500">
                        ({groupedWinners[date].length} 位中奖者)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {groupedWinners[date].map((winner, index) => (
                        <div
                          key={winner.id}
                          className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <img
                                src={winner.user.image}
                                alt={winner.user.name}
                                className="h-16 w-16 rounded-full border-2 border-yellow-500"
                              />
                              <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                {index + 1}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {winner.user.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              @{winner.user.twitterHandle}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(winner.wonAt), 'HH:mm:ss')}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
                              <p className="text-lg font-bold">${winner.prizeAmount}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">
            © 2026 Twitter Raffle. 每天中国时间 7:00 AM 自动开奖
          </p>
        </div>
      </footer>
    </div>
  );
}
