const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { Redis } = require('ioredis');
const db = require('./db');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const pubClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join', async (room) => {
    socket.join(room);
    const history = await db.getHistory(room);
    socket.emit('history', history);
  });

  socket.on('message', async (data) => {
    const { room, sender, content } = data;
    await db.saveMessage(room, sender, content);
    io.to(room).emit('message', data);
  });
});

async function start() {
  await db.initDb();
  httpServer.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
}

if (require.main === module) {
  start();
}
