import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Header from "../../Header";
import "./DashboardBody.css"; // Add your own CSS file for styling
import { Line } from "react-chartjs-2";
import HealthLineChart from "./HealthLineChart";

const DashboardBody = () => {
  const [journalData, setJournalData] = useState([]);
  const [entriesInLastWeek, setEntriesInLastWeek] = useState(0); // Initialize to 0
  const [latestJournalEntry, setLatestJournalEntry] = useState(""); // Initialize to an empty string
  const [healthData, setHealthData] = useState([]);
  const [spendingData, setSpendingData] = useState([]);
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const userId = userDetails.id;
  const [last7Days, setLast7DaysData] = useState([]);
  const dates = Object.keys(healthData);

  useEffect(() => {
    const fetchJournalEntries = async (id) => {
      try {
        const response = await axios.get(
          "http://localhost:8000/journal-entries",
          {
            params: { userId: id },
          }
        );

        const allJournalData = response.data;

        // Calculate entries in the last week
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        const entriesInLastWeek = allJournalData.filter((entry) => {
          const entryDate = new Date(entry.date);
          return entryDate >= lastWeek;
        });

        // Find the latest journal entry
        const latestEntry = allJournalData.reduce((latest, entry) => {
          const entryDate = new Date(entry.date);
          if (!latest || entryDate > latest.date) {
            return { date: entryDate, entry };
          }
          return latest;
        }, null);

        setJournalData(allJournalData);
        setEntriesInLastWeek(entriesInLastWeek.length);
        setLatestJournalEntry(latestEntry ? latestEntry.entry : ""); // Check if latestEntry is null
      } catch (error) {
        console.log(error);
      }
    };

    const fetchHealthEntries = async (id) => {
      try {
        const response = await axios.get(
          "http://localhost:8000/health-dashboard-entries",
          {
            params: { userId: id },
          }
        );

        const healthDataFromServer = response.data;
        console.log("Server,", healthDataFromServer);

        // Create an array of the last 7 days, including today
        const last7Days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          last7Days.push(date.toISOString().split("T")[0]);
        }

        // Create a map to store the health data for the last 7 days
        const healthDataForLast7Days = {};

        // Iterate over the last 7 days and check if data is available
        last7Days.forEach((date) => {
          const dataForDate = healthDataFromServer.find(
            (entry) => entry.date === date
          );

          if (dataForDate) {
            healthDataForLast7Days[date] = dataForDate.meals.total;
          } else {
            // If data is not present for a date, set totals to 0
            healthDataForLast7Days[date] = {
              protein: 0,
              energy: 0,
              carbohydrates: 0,
              fats: 0,
              sugar: 0,
            };
          }
        });
        console.log("sdada", healthDataForLast7Days);
        // Set the formatted health data in the state
        setHealthData(healthDataForLast7Days);
      } catch (error) {
        console.log("Failed to fetch healthEntries", error);
      }
    };

    const fetchSpendingEntries = async (id) => {
      try {
        const response = await axios.get(
          "http://localhost:8000/spending-dashboard-entries",
          {
            params: { userId: id },
          }
        );

        const spendingEntries = response.data;

        // Create an array of the past 7 days, including today
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          last7Days.push(date.toISOString().split("T")[0]);
        }

        // Initialize chartLabels and chartData arrays with 0 values
        const chartLabels = last7Days;
        const chartData = new Array(7).fill(0);

        // Update chartData with actual data if available
        spendingEntries.forEach((entry) => {
          const entryDate = entry.date.split("T")[0];
          const index = chartLabels.indexOf(entryDate);
          if (index !== -1) {
            chartData[index] = entry.total;
          }
        });

        // Initialize an array to store the last 7 days of data
        const last7DaysData = [];

        // Iterate through the last 7 days and add data or zeros
        chartLabels.forEach((label, index) => {
          last7DaysData.push({
            date: label,
            total: chartData[index],
          });
        });

        // Set the updated spendingData
        setSpendingData({
          labels: chartLabels,
          datasets: [
            {
              data: chartData,
              label: "Total Spending",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 2,
              fill: false,
            },
          ],
        });

        // Set the last 7 days of data
        setLast7DaysData(last7DaysData); // Assuming you have a state variable for this
      } catch (error) {
        console.log("Failed to fetch spendingEntries", error);
      }
    };

    fetchJournalEntries(userId);
    fetchHealthEntries(userId);
    fetchSpendingEntries(userId);
    console.log(healthData);
  }, []);

  const formattedDate = new Date().toISOString().split("T")[0];
  const spendingChartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: [
        {
          type: "time",
          time: {
            unit: "day",
          },
          title: {
            display: true,
            text: "Date",
          },
        },
      ],
      y: [
        {
          ticks: {
            beginAtZero: true,
          },
          title: {
            display: true,
            text: "Total",
          },
        },
      ],
    },
  };

  return (
    <div>
      <Header />

      <div className="dashboard-container">
        <div className="dashboard-grid-1">
          <div className="dashboard-item journal-tracker">
            <h2>Journal Tracker</h2>
            <div className="content">
              <p>Entries in last one week: {entriesInLastWeek}</p>
              {latestJournalEntry && (
                <p>Latest Journal Entry: {latestJournalEntry.title}</p>
              )}
            </div>
          </div>

          <div className="dashboard-item goal-tracker">
            <h2>Goal Tracker</h2>
            {/* Add content for Goal Tracker dashboard here */}
          </div>
        </div>
        <div className="dashboard-grid-2">
          <div className="dashboard-item spend-tracker">
            <h2>Spend Tracker</h2>
            <div className="content chart-container">
              <Line
                data={{
                  labels: last7Days.map((entry) => entry.date), // Use date from last7DaysData
                  datasets: [
                    {
                      data: last7Days.map((entry) => entry.total), // Use total from last7DaysData
                      label: "Total Spending",
                      borderColor: "rgba(75,192,192,1)",
                      borderWidth: 2,
                      fill: false,
                    },
                  ],
                }}
                options={spendingChartOptions}
              />
            </div>
          </div>

          <div className=" dashboard-item health-tracker line">
            <h2>Health Tracker</h2>
            <div className="chart-container2">
              {/* Render the HealthLineChart component with healthData */}
              <HealthLineChart healthData={healthData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBody;
