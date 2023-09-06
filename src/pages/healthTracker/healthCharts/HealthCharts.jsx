import React, { useEffect, useRef, useState } from "react";
import "./HealthCharts.css"; // Import your CSS file
import Chart from "chart.js/auto";

function HealthCharts({ totalValues }) {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (!totalValues) {
      return;
    }

    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    const data = {
      labels: [""],
      datasets: [
        {
          label: "Protein",
          data: [totalValues.protein],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        {
          label: "Energy",
          data: [totalValues.energy],
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Carbohydrates",
          data: [totalValues.carbohydrates],
          backgroundColor: "rgba(255, 206, 86, 0.5)",
          borderColor: "rgba(255, 206, 86, 1)",
          borderWidth: 1,
        },
        {
          label: "Fats",
          data: [totalValues.fats],
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "Sugar",
          data: [totalValues.sugar],
          backgroundColor: "rgba(153, 102, 255, 0.5)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
        },
      },
    };

    const newChartInstance = new Chart(ctx, {
      type: "bar",
      data: data,
      options: options,
    });

    setChartInstance(newChartInstance);
  }, [totalValues]);

  return (
    <div className="chart-container">
      <h3>Total Values for the Day</h3>
      {totalValues ? console.log("dsa") : <p>No total values available.</p>}
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default HealthCharts;
