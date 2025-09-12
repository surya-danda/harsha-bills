import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PurchaseChart = ({ entries }) => {
  // Process the data for the chart
  const dataByMonth = entries.reduce((acc, entry) => {
    const month = new Date(entry.purchaseDate).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + entry.purchaseAmount;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(dataByMonth),
    datasets: [
      {
        label: 'Total Purchases (₹)',
        data: Object.values(dataByMonth),
        backgroundColor: 'rgba(79, 70, 229, 0.6)', // Indigo color
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Purchase Overview',
        font: {
          size: 18,
        }
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default PurchaseChart;