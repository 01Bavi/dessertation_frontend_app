import React, { useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement 
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Card from '../common/Card';

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ComplaintChart = ({ stats, isLoading }) => {
  const [chartType, setChartType] = useState('bar');
  
  if (isLoading || !stats) {
    return (
      <Card 
        title="Complaint Statistics" 
        isLoading={true}
      />
    );
  }
  
  // Prepare data for charts
  const barChartData = {
    labels: Object.keys(stats.byStatus).map(status => status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()),
    datasets: [
      {
        label: 'Complaints',
        data: Object.values(stats.byStatus),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const pieChartData = {
    labels: Object.keys(stats.byStatus).map(status => status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()),
    datasets: [
      {
        data: Object.values(stats.byStatus),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Complaints by Status',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Only show integer values
        },
      },
    },
  };
  
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Complaints by Status',
      },
    },
  };
  
  const chartOptions = {
    bar: {
      chart: <Bar data={barChartData} options={barOptions} />,
      label: 'Bar Chart',
    },
    pie: {
      chart: <Pie data={pieChartData} options={pieOptions} />,
      label: 'Pie Chart',
    },
  };
  
  const headerAction = (
    <div className="flex space-x-2">
      <button
        onClick={() => setChartType('bar')}
        className={`px-3 py-1 text-sm rounded ${
          chartType === 'bar'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        Bar
      </button>
      <button
        onClick={() => setChartType('pie')}
        className={`px-3 py-1 text-sm rounded ${
          chartType === 'pie'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        Pie
      </button>
    </div>
  );
  
  return (
    <Card
      title="Complaint Statistics"
      headerAction={headerAction}
      subtitle={`Total: ${stats.total} | Recent (7 days): ${stats.recent}`}
    >
      <div className="h-80">
        {chartOptions[chartType].chart}
      </div>
    </Card>
  );
};

export default ComplaintChart;