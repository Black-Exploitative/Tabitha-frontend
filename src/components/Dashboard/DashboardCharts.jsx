// src/components/Dashboard/DashboardCharts.jsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FaChartLine, FaChartBar, FaChartPie } from 'react-icons/fa';
import './DashboardCharts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardCharts = ({ data }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(230, 126, 34, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#a0a0a0',
          font: {
            family: 'Inter, sans-serif',
            size: 11,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#a0a0a0',
          font: {
            family: 'Inter, sans-serif',
            size: 11,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const admissionsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Admissions',
        data: data?.admissions || [12, 8, 15, 10, 7, 13],
        borderColor: '#E67E22',
        backgroundColor: 'rgba(230, 126, 34, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const ageGroupData = {
    labels: ['0-2 years', '3-5 years', '6-12 years', '13-17 years'],
    datasets: [
      {
        data: data?.ageGroups || [15, 25, 35, 20],
        backgroundColor: [
          '#E67E22',
          '#27AE60',
          '#3498DB',
          '#9B59B6',
        ],
        borderWidth: 0,
      },
    ],
  };

  const educationData = {
    labels: ['Pre-Primary', 'Primary', 'JSS', 'SSS'],
    datasets: [
      {
        label: 'Students',
        data: data?.education || [12, 45, 28, 15],
        backgroundColor: 'rgba(39, 174, 96, 0.8)',
        borderColor: '#27AE60',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="th-dashboard-charts">
      <div className="th-charts-grid">
        {/* Admissions Trend */}
        <div className="th-chart-card">
          <div className="th-chart-header">
            <div className="th-chart-title">
              <FaChartLine className="th-chart-icon" />
              <span>Monthly Admissions</span>
            </div>
          </div>
          <div className="th-chart-container">
            <Line data={admissionsData} options={chartOptions} />
          </div>
        </div>

        {/* Age Distribution */}
        <div className="th-chart-card">
          <div className="th-chart-header">
            <div className="th-chart-title">
              <FaChartPie className="th-chart-icon" />
              <span>Age Distribution</span>
            </div>
          </div>
          <div className="th-chart-container">
            <Doughnut 
              data={ageGroupData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    ...chartOptions.plugins.legend,
                    position: 'bottom',
                  },
                },
              }} 
            />
          </div>
        </div>

        {/* Education Levels */}
        <div className="th-chart-card th-chart-card-wide">
          <div className="th-chart-header">
            <div className="th-chart-title">
              <FaChartBar className="th-chart-icon" />
              <span>Education Levels</span>
            </div>
          </div>
          <div className="th-chart-container">
            <Bar data={educationData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;