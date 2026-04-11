const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
  },
});

// socketId → username
const connectedUsers = new Map();

const broadcastUserList = () => {
  const list = Array.from(connectedUsers.entries()).map(
    ([socketId, username]) => ({
      socketId,
      username,
    }),
  );
  io.emit("user_list", list);
};

io.on("connection", (socket) => {
  socket.on("join", ({ username }) => {
    if (!username || typeof username !== "string") return;
    const safe = username.trim().slice(0, 24);
    socket.data.username = safe;
    connectedUsers.set(socket.id, safe);
    io.emit("user_joined", { username: safe, at: Date.now() });
    broadcastUserList();
  });

  socket.on("message", ({ text }) => {
    const username = socket.data.username;
    if (!username || !text || typeof text !== "string") return;
    const safe = text.trim().slice(0, 2000);
    if (!safe) return;
    io.emit("message", {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      username,
      socketId: socket.id,
      text: safe,
      at: Date.now(),
    });
  });

  socket.on("typing", () => {
    const username = socket.data.username;
    if (username) socket.broadcast.emit("typing", { username });
  });

  socket.on("stop_typing", () => {
    const username = socket.data.username;
    if (username) socket.broadcast.emit("stop_typing", { username });
  });

  socket.on("disconnect", () => {
    const username = socket.data.username;
    connectedUsers.delete(socket.id);
    if (username) {
      io.emit("user_left", { username, at: Date.now() });
      broadcastUserList();
    }
  });
});

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Chat server running on port ${PORT}`));
