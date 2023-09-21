import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Header from "../../header/Header";
import "./DashboardBody.css";
import { Line } from "react-chartjs-2";
import HealthLineChart from "./HealthLineChart";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const DashboardBody = () => {
  const [journalData, setJournalData] = useState([]);
  const [entriesInLastWeek, setEntriesInLastWeek] = useState(0);
  const [latestJournalEntry, setLatestJournalEntry] = useState("");
  const [healthData, setHealthData] = useState([]);
  const [spendingData, setSpendingData] = useState([]);
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const userId = userDetails.id;
  const [last7Days, setLast7DaysData] = useState([]);
  const dates = Object.keys(healthData);
  const [numOfDays, setNumOfDays] = useState(7);
  const [todo, setTodo] = useState(0);
  const [inProgress, setInProgress] = useState(0);
  const [completed, setCompleted] = useState(0);

  const fetchJournalEntries = async (id, days) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/journal-entries`, {
        params: { userId: id },
      });

      const allJournalData = response.data;

      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - days);

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
      setLatestJournalEntry(latestEntry ? latestEntry.entry : "");
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCardCounts = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/count-cards-in-lists?userId=${userId}`
      );

      const { todoCount, inProgressCount, completedCount } = response.data;

      setTodo(todoCount);
      setInProgress(inProgressCount);
      setCompleted(completedCount);
      setTodo(todoCount);
      setInProgress(inProgressCount);
      setCompleted(completedCount);
    } catch (error) {
      console.error("Failed to fetch card counts:", error);
    }
  };

  const fetchHealthEntries = async (id, days) => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/health-dashboard-entries`,
        {
          params: { userId: id },
        }
      );

      const healthDataFromServer = response.data;

      const last7Days = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < days; i++) {
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

      // Set the formatted health data in the state
      setHealthData(healthDataForLast7Days);
    } catch (error) {
      console.log("Failed to fetch healthEntries", error);
    }
  };

  const fetchSpendingEntries = async (id, days) => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/spending-dashboard-entries`,
        {
          params: { userId: id },
        }
      );

      const spendingEntries = response.data;

      const last7Days = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split("T")[0]);
      }

      const chartLabels = last7Days;
      const chartData = new Array(7).fill(0);

      spendingEntries.forEach((entry) => {
        const entryDate = entry.date.split("T")[0];
        const index = chartLabels.indexOf(entryDate);
        if (index !== -1) {
          chartData[index] = entry.total;
        }
      });

      const last7DaysData = [];

      chartLabels.forEach((label, index) => {
        last7DaysData.push({
          date: label,
          total: chartData[index],
        });
      });

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

      setLast7DaysData(last7DaysData);
    } catch (error) {
      console.log("Failed to fetch spendingEntries", error);
    }
  };

  useEffect(() => {
    fetchJournalEntries(userId, numOfDays);
    fetchHealthEntries(userId, numOfDays);
    fetchSpendingEntries(userId, numOfDays);
    fetchCardCounts();
  }, [numOfDays]);

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
        <div className="dashboard-button">
          <button
            onClick={() => setNumOfDays(numOfDays === 7 ? 30 : 7)}
            className="switch-button"
          >
            {`Switch to ${numOfDays === 7 ? "30" : "7"} Days`}
          </button>
        </div>
        <div className="dashboard-grid-1">
          <div className="dashboard-item journal-tracker">
            <h2>Journal Tracker</h2>
            <div className="content">
              <p>
                Entries in last {numOfDays} days: {entriesInLastWeek}
              </p>
              {latestJournalEntry && (
                <p>Latest Journal Entry: {latestJournalEntry.title}</p>
              )}
            </div>
          </div>

          <div className="dashboard-item goal-tracker">
            <h2>Goal Tracker</h2>
            <p>Tasks yet to start: {todo}</p>
            <p>Tasks in Progress: {inProgress}</p>
            <p>Tasks Completed: {completed}</p>
          </div>
        </div>
        <div className="dashboard-grid-2">
          <div className="dashboard-item spend-tracker">
            <h2>Spend Tracker</h2>
            <div className="content chart-container">
              <Line
                data={{
                  labels: last7Days.map((entry) => entry.date),
                  datasets: [
                    {
                      data: last7Days.map((entry) => entry.total),
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
              <HealthLineChart healthData={healthData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBody;
