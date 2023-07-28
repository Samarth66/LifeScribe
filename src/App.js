import React, { useEffect } from "react";
import "./css/App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import io from "socket.io-client";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Routes,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
const App = () => {
  useEffect(() => {
    const socket = io("http://localhost:8000");

    // Log a message when the socket is connected
    socket.on("connect", () => {
      console.log("Socket is connected");
    });

    socket.on("testEvent", (data) => {
      console.log("Received testEvent:", data);
    });

    socket.on("newEntry", (newEntryData) => {
      console.log("Received newEntry:", newEntryData);
      // Update the sidebarData state with the new entry data
    });

    socket.on("testEvent", (data) => {
      console.log("Received testEvent:", data);
    });

    // Clean up the socket connection when the component unmounts
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
        </Routes>
      </Router>
    </div>
  );
};

export default App;
