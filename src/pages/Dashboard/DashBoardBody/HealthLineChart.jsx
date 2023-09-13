import React from "react";
import { Line } from "react-chartjs-2";
import "./DashboardBody.css";

const HealthLineChart = ({ healthData }) => {
  // Extract dates and values from healthData
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
      x: [
        {
          type: "time",
          time: {
            unit: "day",
          },
          title: {
            display: true,
            text: "Date",
            font: {
              size: 16, // Increase the font size
            },
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)", // Customize gridline color
          },
          ticks: {
            font: {
              size: 14, // Increase the tick font size
            },
          },
        },
      ],
      y: [
        {
          ticks: {
            beginAtZero: true,
            font: {
              size: 14, // Increase the tick font size
            },
          },
          title: {
            display: true,
            text: "Value",
            font: {
              size: 16, // Increase the font size
            },
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)", // Customize gridline color
          },
        },
      ],
    },
    plugins: {
      legend: {
        display: true,
        position: "top", // Display legends at the top
        labels: {
          font: {
            size: 14, // Increase the legend label font size
          },
          align: "start", // Align legends to the start (left)
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          size: 16, // Increase the tooltip title font size
        },
        bodyFont: {
          size: 14, // Increase the tooltip body font size
        },
      },
    },
  };

  return (
    <div style={{ height: "100%" }} className="chart-data2">
      {" "}
      {/* Set the height of the chart container */}
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default HealthLineChart;
