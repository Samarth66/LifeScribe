// app.js

const express = require("express");
const loginDetail = require("./mongo");
const cors = require("cors");
const app = express();
const http = require("http");
const bcrypt = require("bcrypt");

const server = http.createServer(app);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const session = require("express-session");
const initializeSocket = require("./routes/socket");
require("dotenv").config();
const SESSION_SECRET = process.env.DB_URI;
const PORT = process.env.PORT || 8000;

const io = initializeSocket(server);
const MongoStore = require("connect-mongo");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: process.env.SOCKET_IO_CORS_ORIGIN,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URI,
      collectionName: "sessions",
      autoRemove: "interval",
      autoRemoveInterval: 10, // In minutes. Default
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: "User not found" });
    }

    return done(null, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await loginDetail.findOne({ email: email });

        if (!user) {
          return done(null, false, { name: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return done(null, false, { name: "Incorrect password" });
        }

        console.log("User found and password is correct", user.id);

        io.to(user.id).emit("joinRoom", user.id);

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

const userRoutes = require("./routes/login");
const signupRoutes = require("./routes/signup");
const journalRoutes = require("./routes/journal");
const journalEntriesRoutes = require("./routes/journalEntries");
const goalTracker = require("./routes/goalTracker");
const healthTracker = require("./routes/healthTrackerEntries");
const spendingTracker = require("./routes/spendingTrackerEntry");

app.use(userRoutes);
app.use("/", signupRoutes);
app.use("/", journalRoutes(io));
app.use("/", journalEntriesRoutes);
app.use("/", goalTracker(io));
app.use("/", healthTracker(io));
app.use("/", spendingTracker(io));
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

// Export the 'io' object
module.exports = io;
