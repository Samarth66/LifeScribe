const { Server } = require("socket.io");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: { origin: "http://localhost:3000" },
  });

  io.on("connection", (socket) => {
    console.log("A user is connected");

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
}

module.exports = initializeSocket;
