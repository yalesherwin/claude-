'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Trophy, Users, DollarSign, Twitter, CheckCircle2, XCircle, Clock, History } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface Participant {
  id: string;
  participatedAt: string;
  user: {
    id: string;
    name: string;
    image: string;
    twitterHandle: string;
  };
}

interface Winner {
  id: string;
  wonAt: string;
  prizeAmount: number;
  user: {
    id: string;
    name: string;
    image: string;
    twitterHandle: string;
  };
}

interface VerificationStatus {
  hasFollowed: boolean;
  hasRetweeted: boolean;
  hasCommented: boolean;
  isEligible: boolean;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(false);
  const [participated, setParticipated] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchParticipants();
    fetchWinners();
    const interval = setInterval(() => {
      fetchParticipants();
      fetchWinners();
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchParticipants = async () => {
    try {
      const res = await fetch('/api/participants');
      const data = await res.json();
      setParticipants(data.participants || []);
    } catch (err) {
      console.error('Error fetching participants:', err);
    }
  };

  const fetchWinners = async () => {
    try {
      const res = await fetch('/api/winners?limit=5');
      const data = await res.json();
      setWinners(data.winners || []);
    } catch (err) {
      console.error('Error fetching winners:', err);
    }
  };

  const handleParticipate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/participate', {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to participate');
      }

      setVerificationStatus(data.participant);
      setParticipated(true);
      fetchParticipants();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Twitter Raffle
                </h1>
                <p className="text-sm text-gray-600">每天 $5 美金大奖</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/winners"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">中奖历史</span>
              </Link>
              {status === 'authenticated' ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <img
                      src={session.user.image || ''}
                      alt={session.user.name || ''}
                      className="h-10 w-10 rounded-full border-2 border-blue-500"
                    />
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                      <p className="text-xs text-gray-500">@{session.user.twitterHandle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    退出
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn('twitter')}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Twitter className="h-5 w-5" />
                  <span>使用 Twitter 登录</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-6">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">每天中国时间 7:00 AM 开奖</span>
          </div>
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            每天抽取 2 位幸运用户
          </h2>
          <p className="text-xl text-gray-600 mb-8">关注、转发、评论即可参与，每人每天一次机会</p>

          {/* Prize Display */}
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 rounded-2xl shadow-xl">
            <DollarSign className="h-8 w-8 text-white" />
            <span className="text-4xl font-bold text-white">$5 美金</span>
          </div>
        </div>

        {/* Participation Card */}
        {status === 'authenticated' && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-center">参与抽奖</h3>

              {!participated ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-6 space-y-3">
                    <p className="font-semibold text-blue-900 mb-3">参与要求：</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        <span>关注我的 Twitter 账号</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        <span>转发指定推文</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        <span>评论指定推文</span>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleParticipate}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '验证中...' : '立即参与'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    {verificationStatus?.isEligible ? (
                      <div className="inline-flex items-center space-x-2 bg-green-100 px-6 py-3 rounded-full">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                        <span className="font-semibold text-green-900">参与成功！</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center space-x-2 bg-yellow-100 px-6 py-3 rounded-full">
                        <XCircle className="h-6 w-6 text-yellow-600" />
                        <span className="font-semibold text-yellow-900">未满足所有条件</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">关注状态</span>
                      {verificationStatus?.hasFollowed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">转发状态</span>
                      {verificationStatus?.hasRetweeted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">评论状态</span>
                      {verificationStatus?.hasCommented ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Participants and Winners Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Today's Participants */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">今日参与者</h3>
              </div>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {participants.length} 人
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {participants.length === 0 ? (
                <p className="text-center text-gray-500 py-8">暂无参与者</p>
              ) : (
                participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={participant.user.image}
                      alt={participant.user.name}
                      className="h-12 w-12 rounded-full border-2 border-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{participant.user.name}</p>
                      <p className="text-sm text-gray-500 truncate">@{participant.user.twitterHandle}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(participant.participatedAt), 'HH:mm')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Winners */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold">最近中奖者</h3>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {winners.length === 0 ? (
                <p className="text-center text-gray-500 py-8">暂无中奖记录</p>
              ) : (
                winners.map((winner) => (
                  <div
                    key={winner.id}
                    className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
                  >
                    <img
                      src={winner.user.image}
                      alt={winner.user.name}
                      className="h-12 w-12 rounded-full border-2 border-yellow-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{winner.user.name}</p>
                      <p className="text-sm text-gray-500 truncate">@{winner.user.twitterHandle}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-600">${winner.prizeAmount}</p>
                      <p className="text-xs text-gray-500">{format(new Date(winner.wonAt), 'MM/dd')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
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
