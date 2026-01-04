import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import './App.css'

const API_BASE = '/api'

function App() {
  const [participants, setParticipants] = useState([])
  const [raffles, setRaffles] = useState([])
  const [stats, setStats] = useState({})
  const [todayRaffle, setTodayRaffle] = useState(null)
  const [twitterId, setTwitterId] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [participantsRes, rafflesRes, statsRes, todayRes] = await Promise.all([
        fetch(`${API_BASE}/participants`),
        fetch(`${API_BASE}/raffles`),
        fetch(`${API_BASE}/stats`),
        fetch(`${API_BASE}/raffle/today`)
      ])

      const participantsData = await participantsRes.json()
      const rafflesData = await rafflesRes.json()
      const statsData = await statsRes.json()
      const todayData = await todayRes.json()

      setParticipants(participantsData)
      setRaffles(rafflesData)
      setStats(statsData)
      setTodayRaffle(todayData.exists ? todayData.raffle : null)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const handleJoin = async (e) => {
    e.preventDefault()
    setMessage({ text: '', type: '' })

    if (!twitterId.trim()) {
      setMessage({ text: '请输入您的 Twitter ID', type: 'error' })
      return
    }

    try {
      const response = await fetch(`${API_BASE}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ twitter_id: twitterId })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ text: '🎉 成功加入抽奖！祝您好运！', type: 'success' })
        setTwitterId('')
        fetchData()
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      } else {
        setMessage({ text: data.error || '加入失败，请重试', type: 'error' })
      }
    } catch (error) {
      setMessage({ text: '网络错误，请重试', type: 'error' })
    }
  }

  const handleDraw = async () => {
    if (participants.length < 2) {
      setMessage({ text: '至少需要 2 位参与者才能开始抽奖', type: 'error' })
      return
    }

    try {
      const response = await fetch(`${API_BASE}/raffle/execute`, {
        method: 'POST'
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ text: '🎊 抽奖完成！恭喜中奖者！', type: 'success' })
        fetchData()
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 8000)
      } else {
        setMessage({ text: data.error || '抽奖失败', type: 'error' })
      }
    } catch (error) {
      setMessage({ text: '网络错误，请重试', type: 'error' })
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <div className="loading">⏳ 加载中...</div>
  }

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <div className="container">
        {/* Header */}
        <motion.div
          className="header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>🎉 Twitter 每日抽奖</h1>
          <p>每天 2 位幸运儿 · 每人 $5 奖金 · 公开透明</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-card">
            <div className="stat-value">{stats.totalParticipants || 0}</div>
            <div className="stat-label">参与者</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalRaffles || 0}</div>
            <div className="stat-label">总抽奖次数</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalWinners || 0}</div>
            <div className="stat-label">幸运儿</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">${stats.totalPrizes || 0}</div>
            <div className="stat-label">累计奖金</div>
          </div>
        </motion.div>

        {/* Join Form */}
        <motion.div
          className="join-section"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2>✨ 参与抽奖</h2>
          <form className="join-form" onSubmit={handleJoin}>
            <input
              type="text"
              placeholder="输入您的 Twitter ID (例如: elonmusk)"
              value={twitterId}
              onChange={(e) => setTwitterId(e.target.value)}
            />
            <button type="submit">加入抽奖</button>
          </form>

          {message.text && (
            <motion.div
              className={`message ${message.type}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {message.text}
            </motion.div>
          )}
        </motion.div>

        {/* Today's Winners */}
        {todayRaffle && (
          <motion.div
            className="today-winners"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3>🏆 今日中奖名单</h3>
            <div className="winner-list">
              {todayRaffle.winners.map((winner, index) => (
                <motion.div
                  key={winner.id}
                  className="winner-item"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="winner-info">
                    <span className="winner-trophy">🥇</span>
                    <span className="winner-twitter">@{winner.twitter_id}</span>
                  </div>
                  <span className="winner-prize">${winner.prize_amount}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Grid */}
        <div className="main-grid">
          {/* Participants */}
          <motion.div
            className="section-card"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2>👥 参与者列表</h2>
            {participants.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <p>还没有人参与抽奖</p>
                <p>快来成为第一个吧！</p>
              </div>
            ) : (
              <div className="participants-list">
                <AnimatePresence>
                  {participants.map((participant, index) => (
                    <motion.div
                      key={participant.id}
                      className="participant-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="participant-avatar">
                        {participant.twitter_id[0].toUpperCase()}
                      </div>
                      <div className="participant-info">
                        <div className="participant-twitter">
                          @{participant.twitter_id}
                        </div>
                        <div className="participant-date">
                          {formatDate(participant.joined_at)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Winners History */}
          <motion.div
            className="section-card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2>🏆 历史中奖记录</h2>

            {!todayRaffle && (
              <button className="draw-button" onClick={handleDraw}>
                🎲 开始今日抽奖
              </button>
            )}

            {raffles.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🎁</div>
                <p>还没有进行过抽奖</p>
              </div>
            ) : (
              <div className="participants-list">
                {raffles.map((raffle) => (
                  <motion.div
                    key={raffle.id}
                    className="winner-card"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="winner-date">
                      📅 {new Date(raffle.draw_date).toLocaleDateString('zh-CN')}
                    </div>
                    <div className="winner-list">
                      {raffle.winners.map((winner) => (
                        <div key={winner.id} className="winner-item">
                          <div className="winner-info">
                            <span className="winner-trophy">🏅</span>
                            <span className="winner-twitter">
                              @{winner.twitter_id}
                            </span>
                          </div>
                          <span className="winner-prize">
                            ${winner.prize_amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default App
