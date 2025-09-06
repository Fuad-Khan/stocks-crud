import React from "react";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, BarElement, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";


ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, BarElement, Tooltip, Legend);

export default function StockChart({ data, showVolume=false }) {
  // data: array of {date, close, volume}
  const labels = data.map(d=>d.date).reverse(); // chronological
  const closeData = data.map(d=>d.close ? Number(d.close) : null).reverse();
  const volumeData = data.map(d=>d.volume ? Number(d.volume) : 0).reverse();

const chartData = {
  labels,
  datasets: [
    {
      type: 'line',
      label: 'Close',
      data: closeData,
      yAxisID: 'y',
      tension: 0.2,
      borderColor: 'rgba(75, 192, 192, 1)', // line color
      backgroundColor: 'rgba(75, 192, 192, 0.2)', // fill under line
    },
    ...(showVolume ? [{
      type: 'bar',
      label: 'Volume',
      data: volumeData,
      yAxisID: 'yVolume',
      barThickness: 8,
      backgroundColor: 'rgba(153, 102, 255, 0.5)', // semi-transparent bars
    }] : [])
  ]
};


const options = {
  responsive: true,
  maintainAspectRatio: false, // allows full width and height
  interaction: { mode: 'index', intersect: false },
  scales: {
    y: { type: 'linear', position: 'left', title: { display: true, text: 'Price' } },
    yVolume: { type: 'linear', position: 'right', grid: { display: false }, title: { display: true, text: 'Volume' } }
  }
};


 return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
}