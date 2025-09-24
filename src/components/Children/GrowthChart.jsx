// src/components/Children/GrowthChart.jsx
import React, { useState, useMemo } from 'react';
import {
  FaRuler,
  FaWeight,
  FaCalendarAlt,
  FaArrowUp,
  FaDownload,
  FaPrint,
  FaPlus,
  FaFilter,
  FaExpand
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { format, parseISO, subMonths, isAfter } from 'date-fns';
import Button from '../UI/Button/Button';
import './GrowthChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const GrowthChart = ({ childId }) => {
  const [activeMetric, setActiveMetric] = useState('height');
  const [timeRange, setTimeRange] = useState('1year');
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);

  // Mock growth data
  const mockGrowthData = {
    measurements: [
      { date: '2024-01-15', height: 115, weight: 22, bmi: 16.6, age_months: 105 },
      { date: '2024-02-15', height: 116, weight: 22.5, bmi: 16.7, age_months: 106 },
      { date: '2024-03-15', height: 117, weight: 23, bmi: 16.8, age_months: 107 },
      { date: '2024-04-15', height: 118, weight: 23.8, bmi: 17.1, age_months: 108 },
      { date: '2024-05-15', height: 119, weight: 24.2, bmi: 17.1, age_months: 109 },
      { date: '2024-06-15', height: 120, weight: 25, bmi: 17.4, age_months: 110 }
    ],
    who_percentiles: {
      height: { p3: 110, p50: 118, p97: 126 },
      weight: { p3: 20, p50: 24, p97: 30 },
      bmi: { p3: 15.5, p50: 17.2, p97: 19.8 }
    },
    last_measurement: {
      date: '2024-06-15',
      height: 120,
      weight: 25,
      bmi: 17.4,
      height_percentile: 45,
      weight_percentile: 52,
      notes: 'Healthy growth pattern, within normal ranges'
    }
  };

  // Filter data based on time range
  const filteredData = useMemo(() => {
    const cutoffDate = subMonths(new Date(), timeRange === '6months' ? 6 : 12);
    return mockGrowthData.measurements.filter(measurement => 
      isAfter(parseISO(measurement.date), cutoffDate)
    );
  }, [timeRange]);

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => format(parseISO(context[0].label), 'MMM dd, yyyy'),
          label: (context) => {
            const unit = activeMetric === 'height' ? 'cm' : 
                        activeMetric === 'weight' ? 'kg' : '';
            return `${context.dataset.label}: ${context.parsed.y}${unit}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 11
          },
          callback: function(value, index) {
            return format(parseISO(this.getLabelForValue(value)), 'MMM');
          }
        }
      },
      y: {
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 11
          }
        }
      }
    }
  };

  // Generate chart data
  const generateChartData = () => {
    const labels = filteredData.map(d => d.date);
    const childData = filteredData.map(d => d[activeMetric]);
    const percentiles = mockGrowthData.who_percentiles[activeMetric];

    return {
      labels,
      datasets: [
        {
          label: `Child's ${activeMetric}`,
          data: childData,
          borderColor: 'rgb(52, 152, 219)',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          tension: 0.4,
          pointBackgroundColor: 'rgb(52, 152, 219)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          fill: false
        },
        {
          label: '50th Percentile (WHO)',
          data: new Array(labels.length).fill(percentiles.p50),
          borderColor: 'rgb(39, 174, 96)',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0,
          pointRadius: 0,
          fill: false
        },
        {
          label: '3rd Percentile (WHO)',
          data: new Array(labels.length).fill(percentiles.p3),
          borderColor: 'rgb(231, 76, 60)',
          backgroundColor: 'transparent',
          borderDash: [10, 5],
          tension: 0,
          pointRadius: 0,
          fill: false
        },
        {
          label: '97th Percentile (WHO)',
          data: new Array(labels.length).fill(percentiles.p97),
          borderColor: 'rgb(231, 76, 60)',
          backgroundColor: 'transparent',
          borderDash: [10, 5],
          tension: 0,
          pointRadius: 0,
          fill: false
        }
      ]
    };
  };

  return (
    <div className="th-growth-chart">
      {/* Header */}
      <div className="th-growth-header">
        <div className="th-header-info">
          <h3 className="th-section-title">
            <FaArrowUp className="th-section-icon" />
            Growth & Development Tracking
          </h3>
          <p className="th-section-subtitle">
            Monitor physical development with WHO growth standards
          </p>
        </div>
        <div className="th-header-actions">
          <Button
            variant="outline"
            size="sm"
            icon={<FaPlus />}
            onClick={() => setShowAddMeasurement(true)}
          >
            Add Measurement
          </Button>
          <Button variant="outline" size="sm" icon={<FaDownload />}>
            Export Chart
          </Button>
          <Button variant="outline" size="sm" icon={<FaPrint />}>
            Print
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="th-growth-controls">
        <div className="th-metric-tabs">
          <button
            className={`th-metric-tab ${activeMetric === 'height' ? 'active' : ''}`}
            onClick={() => setActiveMetric('height')}
          >
            <FaRuler className="th-tab-icon" />
            Height
          </button>
          <button
            className={`th-metric-tab ${activeMetric === 'weight' ? 'active' : ''}`}
            onClick={() => setActiveMetric('weight')}
          >
            <FaWeight className="th-tab-icon" />
            Weight
          </button>
          <button
            className={`th-metric-tab ${activeMetric === 'bmi' ? 'active' : ''}`}
            onClick={() => setActiveMetric('bmi')}
          >
            <FaArrowUp className="th-tab-icon" />
            BMI
          </button>
        </div>

        <div className="th-time-range">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="th-time-select"
          >
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Current Stats */}
      <div className="th-current-stats">
        <div className="th-stat-card height">
          <div className="th-stat-icon">
            <FaRuler />
          </div>
          <div className="th-stat-info">
            <span className="th-stat-value">{mockGrowthData.last_measurement.height} cm</span>
            <span className="th-stat-label">Current Height</span>
            <span className="th-stat-percentile">
              {mockGrowthData.last_measurement.height_percentile}th percentile
            </span>
          </div>
        </div>

        <div className="th-stat-card weight">
          <div className="th-stat-icon">
            <FaWeight />
          </div>
          <div className="th-stat-info">
            <span className="th-stat-value">{mockGrowthData.last_measurement.weight} kg</span>
            <span className="th-stat-label">Current Weight</span>
            <span className="th-stat-percentile">
              {mockGrowthData.last_measurement.weight_percentile}th percentile
            </span>
          </div>
        </div>

        <div className="th-stat-card bmi">
          <div className="th-stat-icon">
            <FaArrowUp />
          </div>
          <div className="th-stat-info">
            <span className="th-stat-value">{mockGrowthData.last_measurement.bmi}</span>
            <span className="th-stat-label">Current BMI</span>
            <span className="th-stat-status healthy">Healthy</span>
          </div>
        </div>

        <div className="th-stat-card measurement-date">
          <div className="th-stat-icon">
            <FaCalendarAlt />
          </div>
          <div className="th-stat-info">
            <span className="th-stat-value">
              {format(parseISO(mockGrowthData.last_measurement.date), 'MMM dd')}
            </span>
            <span className="th-stat-label">Last Measured</span>
            <span className="th-stat-note">
              {format(parseISO(mockGrowthData.last_measurement.date), 'yyyy')}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="th-chart-container">
        <div className="th-chart-wrapper">
          <Line data={generateChartData()} options={chartOptions} />
        </div>
      </div>

      {/* Growth Notes */}
      {mockGrowthData.last_measurement.notes && (
        <div className="th-growth-notes">
          <div className="th-notes-header">
            <h4 className="th-notes-title">Latest Assessment Notes</h4>
            <span className="th-notes-date">
              {format(parseISO(mockGrowthData.last_measurement.date), 'MMM dd, yyyy')}
            </span>
          </div>
          <p className="th-notes-content">
            {mockGrowthData.last_measurement.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default GrowthChart;