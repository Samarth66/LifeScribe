import React, { useEffect, useRef, useState } from "react";
import "./HealthCharts.css";
import Chart from "chart.js/auto";

function HealthCharts({ totalValues, total }) {
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
      labels: ["Protein", "Energy", "Carbohydrates", "Fats", "Sugar"],
      datasets: [
        {
          label: "Macros",
          data: [
            totalValues.protein,
            totalValues.energy,
            totalValues.carbohydrates,
            totalValues.fats,
            totalValues.sugar,
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      scales: {
        x: {
          reverse: true,
        },
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
      <h2>Total calories consumed today: {total}</h2>
      <h3>Macros</h3>
      {!totalValues && <p>No total values available.</p>}
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default HealthCharts;
