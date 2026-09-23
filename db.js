const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/chat_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      room VARCHAR(255) NOT NULL,
      sender VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function saveMessage(room, sender, content) {
  await pool.query('INSERT INTO messages (room, sender, content) VALUES ($1, $2, $3)', [room, sender, content]);
}

async function getHistory(room) {
  const res = await pool.query('SELECT * FROM messages WHERE room = $1 ORDER BY created_at DESC LIMIT 50', [room]);
  return res.rows;
}

module.exports = { initDb, saveMessage, getHistory };
