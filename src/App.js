import React, { useEffect } from "react";
import socket from "./pages/socket";
import "./css/App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import GoalTracker from "./pages/GoalTracker";
import HealthTracker from "./pages/healthTracker/HealthTracker/HealthTracker";

const App = () => {
  useEffect(() => {
    // Log a message when the socket is connected
    console.log("Inside useEffect in App.js", socket);

    socket.on("testEvent", (data) => {
      console.log("Received testEvent:", data);
    });

    socket.on("new-card-added", () => {
      console.log("received scoket new card");
    });

    socket.on("newEntry", (newEntryData) => {
      console.log("Received newEntry:", newEntryData);
    });

    socket.on("testEvent", (data) => {
      console.log("Received testEvent:", data);
    });
    socket.on("new-card-added", (newEntry) => {
      console.log("socket in goalList triggered gg");
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/goal" element={<GoalTracker />} />
          <Route path="/health" element={<HealthTracker />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
