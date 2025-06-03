import { Server } from "socket.io";

const io = new Server(3001, {
  cors: {
    origin: "*",
  },
});

const roomMessages = {};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join", ({ username, room }) => {
    socket.join(room);
    console.log(`${username} joined room: ${room}`);

    if (roomMessages[room]) {
      roomMessages[room].forEach((msg) => {
        socket.emit("message", msg);
      });
    }
  });

  socket.on("message", ({ room, username, message }) => {
    const formatted = `${username}: ${message}`;
    console.log(`[message] ${formatted}`);

    if (!roomMessages[room]) {
      roomMessages[room] = [];
    }
    roomMessages[room].push(formatted);

    io.to(room).emit("message", formatted);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

console.log("✅ Socket.IO server running on port 3001");
