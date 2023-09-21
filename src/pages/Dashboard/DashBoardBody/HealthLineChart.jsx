import React from "react";
import { Line } from "react-chartjs-2";
import "./DashboardBody.css";
import "chartjs-adapter-moment";
import moment from "moment";

const HealthLineChart = ({ healthData }) => {
  const dates = Object.keys(healthData);
  const proteinData = dates.map((date) => healthData[date].protein);
  const energyData = dates.map((date) => healthData[date].energy);
  const carbohydratesData = dates.map((date) => healthData[date].carbohydrates);
  const fatsData = dates.map((date) => healthData[date].fats);
  const sugarData = dates.map((date) => healthData[date].sugar);

  // Define the chart data
  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Protein",
        data: proteinData,
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Energy",
        data: energyData,
        borderColor: "rgba(255, 0, 0, 1)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Carbohydrates",
        data: carbohydratesData,
        borderColor: "rgba(0, 255, 0, 1)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Fats",
        data: fatsData,
        borderColor: "rgba(0, 0, 255, 1)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Sugar",
        data: sugarData,
        borderColor: "rgba(255, 255, 0, 1)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        // Change here
        type: "time",
        time: {
          unit: "day",
        },
        reverse: false,
        title: {
          display: true,
          text: "Date",
          font: {
            size: 16,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        // Change here
        ticks: {
          beginAtZero: true,
          font: {
            size: 14,
          },
        },
        title: {
          display: true,
          text: "Value",
          font: {
            size: 16,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 14,
          },
          align: "start",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 14,
        },
      },
    },
  };

  return (
    <div style={{ height: "100%" }} className="chart-data2">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default HealthLineChart;
