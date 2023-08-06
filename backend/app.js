// app.js

const express = require("express");
const loginDetail = require("./mongo");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app); // Create an HTTP server using express app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

io.on("connection", (socket) => {
  console.log("a user is connected");

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

const userRoutes = require("./routes/login");
const signupRoutes = require("./routes/signup");
const journalRoutes = require("./routes/journal");
const journalEntriesRoutes = require("./routes/journalEntries");
const goalTracker = require("./routes/goalTracker");

app.use(userRoutes);
app.use("/", signupRoutes);
app.use("/", journalRoutes(io));
app.use("/", journalEntriesRoutes);
app.use("/", goalTracker);

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the 'io' object
module.exports = io;
