import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BarController,
  LineController,
} from "chart.js";
import { Chart } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BarController,
  LineController
);

export default function StockChart({ data, showVolume = false }) {
  // Prepare chart data
  const labels = data.map((d) => d.date).reverse(); // chronological order
  const closeData = data.map((d) => Number(d.close) || null).reverse();
  const volumeData = data.map((d) => Number(d.volume) || 0).reverse();

  const chartData = {
    labels,
    datasets: [
      {
        type: "line",
        label: "Close",
        data: closeData,
        yAxisID: "y",
        tension: 0.2,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointRadius: 2,
        borderWidth: 2,
      },
      ...(showVolume
        ? [
            {
              type: "bar",
              label: "Volume",
              data: volumeData,
              yAxisID: "yVolume",
              barThickness: Math.max(2, Math.min(12, labels.length / 10)),
              backgroundColor: "rgba(153, 102, 255, 0.5)",
            },
          ]
        : []),
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        type: "linear",
        position: "left",
        title: { display: true, text: "Price" },
      },
      ...(showVolume && {
        yVolume: {
          type: "linear",
          position: "right",
          grid: { display: false },
          title: { display: true, text: "Volume" },
        },
      }),
      x: {
        title: { display: true, text: "Date" },
      },
    },
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Chart data={chartData} options={options} />
    </div>
  );
}
