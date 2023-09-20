const { Server } = require("socket.io");
require("dotenv").config();
const SOCKET_IO_CORS_ORIGIN = process.env.SOCKET_IO_CORS_ORIGIN;

function initializeSocket(server) {
  const users = new Map();
  const io = new Server(server, {
    cors: { origin: SOCKET_IO_CORS_ORIGIN },
  });

  io.on("connection", (socket) => {
    console.log("a user is connected");

    socket.on("joinRoom", (userId) => {
      users.set(socket.id, userId);
      socket.join(userId);
      console.log(`User ${userId} joined the room`);
      io.to(userId).emit("messageFromServer", "hello");
    });

    socket.on("disconnect", () => {
      const userId = users.get(socket.id);

      if (userId) {
        console.log(`User ${userId} disconnected`);
        // Remove the mapping when a user disconnects
        users.delete(socket.id);

        // Perform cleanup or handle the disconnection here...
      }
    });
  });

  return io;
}

module.exports = initializeSocket;
