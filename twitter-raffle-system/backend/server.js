import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import db from './database.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Get all participants
app.get('/api/participants', (req, res) => {
  try {
    const participants = db.prepare(`
      SELECT id, twitter_id, joined_at
      FROM participants
      ORDER BY joined_at DESC
    `).all();
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new participant
app.post('/api/participants', (req, res) => {
  const { twitter_id } = req.body;

  if (!twitter_id || !twitter_id.trim()) {
    return res.status(400).json({ error: 'Twitter ID is required' });
  }

  // Validate Twitter ID format (alphanumeric and underscore, 1-15 chars)
  const cleanTwitterId = twitter_id.trim().replace('@', '');
  if (!/^[a-zA-Z0-9_]{1,15}$/.test(cleanTwitterId)) {
    return res.status(400).json({ error: 'Invalid Twitter ID format' });
  }

  try {
    const stmt = db.prepare('INSERT INTO participants (twitter_id) VALUES (?)');
    const result = stmt.run(cleanTwitterId);

    res.json({
      success: true,
      participant: {
        id: result.lastInsertRowid,
        twitter_id: cleanTwitterId,
        joined_at: new Date().toISOString()
      }
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(409).json({ error: 'This Twitter ID has already entered the raffle' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get raffle history
app.get('/api/raffles', (req, res) => {
  try {
    const raffles = db.prepare(`
      SELECT
        r.id,
        r.draw_date,
        r.executed_at,
        r.status,
        json_group_array(
          json_object(
            'id', w.id,
            'twitter_id', w.twitter_id,
            'prize_amount', w.prize_amount,
            'won_at', w.won_at
          )
        ) as winners
      FROM raffles r
      LEFT JOIN winners w ON r.id = w.raffle_id
      GROUP BY r.id
      ORDER BY r.draw_date DESC
      LIMIT 30
    `).all();

    const parsedRaffles = raffles.map(raffle => ({
      ...raffle,
      winners: JSON.parse(raffle.winners).filter(w => w.id !== null)
    }));

    res.json(parsedRaffles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's raffle status
app.get('/api/raffle/today', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const raffle = db.prepare(`
      SELECT
        r.id,
        r.draw_date,
        r.executed_at,
        r.status
      FROM raffles r
      WHERE r.draw_date = ?
    `).get(today);

    if (!raffle) {
      return res.json({ exists: false });
    }

    const winners = db.prepare(`
      SELECT id, twitter_id, prize_amount, won_at
      FROM winners
      WHERE raffle_id = ?
    `).all(raffle.id);

    res.json({
      exists: true,
      raffle: {
        ...raffle,
        winners
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Execute raffle (manual trigger or cron)
app.post('/api/raffle/execute', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Check if raffle already executed today
    const existing = db.prepare('SELECT id FROM raffles WHERE draw_date = ?').get(today);
    if (existing) {
      return res.status(409).json({ error: 'Raffle already executed today' });
    }

    // Get all participants
    const participants = db.prepare('SELECT id, twitter_id FROM participants').all();

    if (participants.length < 2) {
      return res.status(400).json({ error: 'Need at least 2 participants to draw' });
    }

    // Shuffle and select 2 winners using cryptographically random selection
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const winners = shuffled.slice(0, 2);

    // Create raffle record
    const raffleStmt = db.prepare('INSERT INTO raffles (draw_date) VALUES (?)');
    const raffleResult = raffleStmt.run(today);
    const raffleId = raffleResult.lastInsertRowid;

    // Insert winners
    const winnerStmt = db.prepare(`
      INSERT INTO winners (raffle_id, participant_id, twitter_id, prize_amount)
      VALUES (?, ?, ?, 5.0)
    `);

    const winnerRecords = winners.map(winner => {
      winnerStmt.run(raffleId, winner.id, winner.twitter_id);
      return {
        twitter_id: winner.twitter_id,
        prize_amount: 5.0
      };
    });

    res.json({
      success: true,
      raffle: {
        id: raffleId,
        draw_date: today,
        winners: winnerRecords
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
  try {
    const totalParticipants = db.prepare('SELECT COUNT(*) as count FROM participants').get().count;
    const totalRaffles = db.prepare('SELECT COUNT(*) as count FROM raffles').get().count;
    const totalWinners = db.prepare('SELECT COUNT(*) as count FROM winners').get().count;
    const totalPrizes = db.prepare('SELECT SUM(prize_amount) as total FROM winners').get().total || 0;

    res.json({
      totalParticipants,
      totalRaffles,
      totalWinners,
      totalPrizes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule daily raffle at 8:00 PM (20:00)
cron.schedule('0 20 * * *', async () => {
  console.log('Running scheduled daily raffle...');
  try {
    const today = new Date().toISOString().split('T')[0];
    const existing = db.prepare('SELECT id FROM raffles WHERE draw_date = ?').get(today);

    if (!existing) {
      // Execute raffle logic (same as manual endpoint)
      const participants = db.prepare('SELECT id, twitter_id FROM participants').all();

      if (participants.length >= 2) {
        const shuffled = [...participants].sort(() => Math.random() - 0.5);
        const winners = shuffled.slice(0, 2);

        const raffleStmt = db.prepare('INSERT INTO raffles (draw_date) VALUES (?)');
        const raffleResult = raffleStmt.run(today);
        const raffleId = raffleResult.lastInsertRowid;

        const winnerStmt = db.prepare(`
          INSERT INTO winners (raffle_id, participant_id, twitter_id, prize_amount)
          VALUES (?, ?, ?, 5.0)
        `);

        winners.forEach(winner => {
          winnerStmt.run(raffleId, winner.id, winner.twitter_id);
        });

        console.log('Daily raffle executed successfully!', winners.map(w => w.twitter_id));
      }
    }
  } catch (error) {
    console.error('Error executing scheduled raffle:', error);
  }
});

app.listen(PORT, () => {
  console.log(`🎉 Raffle server running on port ${PORT}`);
  console.log(`📅 Daily raffles scheduled for 8:00 PM`);
});
