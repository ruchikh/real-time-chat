import { Server } from 'socket.io';

export default function handler(req: any, res: any) {
  if (!res.socket.server.io) {
    console.log('Initializing WebSocket server...');

    const io = new Server(res.socket.server, {
      path: '/api/socket',
    });

    io.on('connection', socket => {
      console.log('New client connected');

      socket.on('join', ({ username, room }) => {
        socket.join(room);
        io.to(room).emit('message', `${username} joined the room.`);
      });

      socket.on('message', ({ room, username, message }) => {
        io.to(room).emit('message', `${username}: ${message}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('WebSocket server already running.');
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
