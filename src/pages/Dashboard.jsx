import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();

  return (
    <div>
      <h1>Hello {location.state.name} and welcome to the home</h1>
    </div>
  );
};

export default Dashboard;
