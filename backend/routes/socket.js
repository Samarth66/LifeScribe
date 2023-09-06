const { Server } = require("socket.io");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: { origin: "http://localhost:3000" },
  });

  io.on("connection", (socket) => {
    console.log("a user is connected");

    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined the room`);
      io.to(userId).emit("messageFromServer", "hello");
    });

    socket.on("disconnect", () => {
      console.log("a user disconnected");
    });
  });

  return io;
}

module.exports = initializeSocket;
