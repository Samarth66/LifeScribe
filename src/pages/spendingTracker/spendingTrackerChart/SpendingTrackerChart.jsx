import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "./SpendingTrackerChart.css";

function SpendingTrackerChart(props) {
  const { data } = props;
  const [categoryColors, setCategoryColors] = useState({});

  // Generate colors for each category when data changes
  useEffect(() => {
    if (data && data.transactions) {
      const uniqueCategories = Array.from(
        new Set(data.transactions.map((transaction) => transaction.category))
      );

      // Generate colors for each unique category
      const colors = generateColors(uniqueCategories.length);

      // Create an object to map categories to colors
      const categoryColorMap = {};
      uniqueCategories.forEach((category, index) => {
        categoryColorMap[category] = colors[index];
      });

      setCategoryColors(categoryColorMap);
    }
  }, [data]);

  // Check if data is defined before processing
  if (!data || !data.transactions || data.transactions.length === 0) {
    return <div>No data available for chart.</div>;
  }

  // Calculate the total values for each category
  const categoryTotals = {};

  data.transactions.forEach((transaction) => {
    const { category, amount } = transaction;
    if (categoryTotals[category]) {
      categoryTotals[category] += amount;
    } else {
      categoryTotals[category] = amount;
    }
  });

  // Generate labels based on categories in data
  const labels = Object.keys(categoryTotals);
  const colors = labels.map((category) => categoryColors[category]);

  // Convert categoryTotals object into an array of objects for chart data
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: colors,
        hoverBackgroundColor: colors,
      },
    ],
  };

  return (
    <div className="chart-container">
      <h1>Category Wise Spending</h1>
      <Pie data={chartData} />
      <h3>Total amount spent today: ${data.total}</h3>
    </div>
  );
}

// Function to generate an array of random colors
function generateColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    colors.push(color);
  }
  return colors;
}

export default SpendingTrackerChart;
