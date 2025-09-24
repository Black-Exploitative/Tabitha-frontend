// src/pages/reports/ReportsDashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaChartBar,
  FaArrowUp,
  FaChartPie,
  FaFileAlt,
  FaDownload,
  FaPrint,
  FaCalendarAlt,
  FaFilter,
  FaUsers,
  FaChild,
  FaUserMd,
  FaGraduationCap,
  FaMoneyBillAlt,
  FaClipboardList,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaPlus,
  FaSearch,
  FaFileExport,
  FaFileExcel,
  FaFilePdf,
  FaArrowUp,
  FaArrowDown,
  FaEquals,
  FaMapMarkerAlt,
  FaHeart,
  FaShieldAlt
} from 'react-icons/fa';
import { format, subDays, subMonths, differenceInDays } from 'date-fns';
import Button from '../../components/UI/Button/Button';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
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
import './ReportsDashboard.css';

// Register Chart.js components
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

const ReportsDashboard = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('this_month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - replace with API calls
  const mockDashboardData = {
    summary_metrics: {
      total_children: 147,
      total_staff: 32,
      active_cases: 89,
      this_month_admissions: 8,
      this_month_exits: 3,
      budget_utilization: 78.5,
      compliance_score: 94.2
    },
    trends: {
      children_trend: 2.3, // percentage change
      staff_trend: 0.8,
      case_resolution_trend: 12.5,
      budget_trend: -5.2
    },
    children_by_age_group: {
      'Under 5': 23,
      '5-10': 45,
      '11-15': 52,
      '16-18': 27
    },
    children_by_status: {
      'Active': 132,
      'Transitioning': 8,
      'Family Reunification': 5,
      'Adoption Process': 2
    },
    admission_trends: [
      { month: 'Jan', admissions: 12, exits: 8 },
      { month: 'Feb', admissions: 15, exits: 6 },
      { month: 'Mar', admissions: 18, exits: 9 },
      { month: 'Apr', admissions: 14, exits: 7 },
      { month: 'May', admissions: 16, exits: 5 },
      { month: 'Jun', admissions: 8, exits: 3 }
    ],
    staff_by_department: {
      'Childcare': 12,
      'Medical': 6,
      'Education': 8,
      'Administration': 4,
      'Security': 2
    },
    case_resolution_rate: [
      { month: 'Jan', resolved: 85, pending: 15 },
      { month: 'Feb', resolved: 78, pending: 22 },
      { month: 'Mar', resolved: 92, pending: 8 },
      { month: 'Apr', resolved: 88, pending: 12 },
      { month: 'May', resolved: 95, pending: 5 },
      { month: 'Jun', resolved: 91, pending: 9 }
    ],
    budget_breakdown: {
      'Childcare': 45,
      'Medical': 20,
      'Education': 15,
      'Administration': 12,
      'Maintenance': 8
    },
    recent_reports: [
      {
        id: 1,
        title: 'Monthly Children Overview',
        type: 'Children Report',
        generated_date: '2024-06-22',
        generated_by: 'Dr. Kemi Adebayo',
        status: 'Completed',
        file_size: '2.4 MB'
      },
      {
        id: 2,
        title: 'Staff Performance Analysis',
        type: 'HR Report',
        generated_date: '2024-06-20',
        generated_by: 'Ibrahim Yusuf',
        status: 'Completed',
        file_size: '1.8 MB'
      },
      {
        id: 3,
        title: 'Medical Records Summary',
        type: 'Medical Report',
        generated_date: '2024-06-18',
        generated_by: 'Dr. Adebayo Johnson',
        status: 'Completed',
        file_size: '3.2 MB'
      },
      {
        id: 4,
        title: 'Budget Utilization Report',
        type: 'Financial Report',
        generated_date: '2024-06-15',
        generated_by: 'Finance Department',
        status: 'Completed',
        file_size: '1.5 MB'
      }
    ],
    compliance_alerts: [
      {
        id: 1,
        type: 'Medical Checkup Due',
        message: '15 children have medical checkups due within 7 days',
        priority: 'High',
        due_date: '2024-06-30',
        category: 'Medical'
      },
      {
        id: 2,
        type: 'Staff Training Required',
        message: '8 staff members need child protection training renewal',
        priority: 'Medium',
        due_date: '2024-07-15',
        category: 'Training'
      },
      {
        id: 3,
        type: 'Documentation Review',
        message: '12 case files require quarterly review',
        priority: 'Medium',
        due_date: '2024-07-10',
        category: 'Documentation'
      }
    ]
  };

  const reportCategories = [
    { id: 'all', label: 'All Reports', icon: FaFileAlt, count: 28 },
    { id: 'children', label: 'Children Reports', icon: FaChild, count: 12 },
    { id: 'staff', label: 'Staff Reports', icon: FaUsers, count: 8 },
    { id: 'medical', label: 'Medical Reports', icon: FaUserMd, count: 6 },
    { id: 'financial', label: 'Financial Reports', icon: FaMoneyBillAlt, count: 4 },
    { id: 'compliance', label: 'Compliance Reports', icon: FaShieldAlt, count: 3 }
  ];

  const quickReports = [
    {
      id: 'children_overview',
      title: 'Children Overview',
      description: 'Current children statistics and demographics',
      icon: FaChild,
      category: 'children',
      estimated_time: '2 minutes'
    },
    {
      id: 'staff_performance',
      title: 'Staff Performance',
      description: 'Staff performance metrics and evaluations',
      icon: FaUsers,
      category: 'staff',
      estimated_time: '3 minutes'
    },
    {
      id: 'medical_summary',
      title: 'Medical Summary',
      description: 'Health records and medical status report',
      icon: FaUserMd,
      category: 'medical',
      estimated_time: '4 minutes'
    },
    {
      id: 'financial_status',
      title: 'Financial Status',
      description: 'Budget utilization and financial overview',
      icon: FaMoneyBillAlt,
      category: 'financial',
      estimated_time: '2 minutes'
    },
    {
      id: 'compliance_check',
      title: 'Compliance Check',
      description: 'Regulatory compliance and audit readiness',
      icon: FaShieldAlt,
      category: 'compliance',
      estimated_time: '5 minutes'
    },
    {
      id: 'education_progress',
      title: 'Education Progress',
      description: 'Academic performance and education metrics',
      icon: FaGraduationCap,
      category: 'education',
      estimated_time: '3 minutes'
    }
  ];

  // Chart configurations
  const admissionTrendsData = {
    labels: mockDashboardData.admission_trends.map(item => item.month),
    datasets: [
      {
        label: 'Admissions',
        data: mockDashboardData.admission_trends.map(item => item.admissions),
        borderColor: 'rgb(52, 152, 219)',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Exits',
        data: mockDashboardData.admission_trends.map(item => item.exits),
        borderColor: 'rgb(230, 126, 34)',
        backgroundColor: 'rgba(230, 126, 34, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const ageGroupData = {
    labels: Object.keys(mockDashboardData.children_by_age_group),
    datasets: [
      {
        data: Object.values(mockDashboardData.children_by_age_group),
        backgroundColor: [
          'rgba(52, 152, 219, 0.8)',
          'rgba(39, 174, 96, 0.8)',
          'rgba(243, 156, 18, 0.8)',
          'rgba(231, 76, 60, 0.8)'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const staffDepartmentData = {
    labels: Object.keys(mockDashboardData.staff_by_department),
    datasets: [
      {
        data: Object.values(mockDashboardData.staff_by_department),
        backgroundColor: [
          'rgba(52, 152, 219, 0.8)',
          'rgba(39, 174, 96, 0.8)',
          'rgba(243, 156, 18, 0.8)',
          'rgba(231, 76, 60, 0.8)',
          'rgba(155, 89, 182, 0.8)'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      }
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <FaArrowUp className="th-trend-icon positive" />;
    if (trend < 0) return <FaArrowDown className="th-trend-icon negative" />;
    return <FaEquals className="th-trend-icon neutral" />;
  };

  const getTrendClass = (trend) => {
    if (trend > 0) return 'positive';
    if (trend < 0) return 'negative';
    return 'neutral';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'error',
      'Medium': 'warning',
      'Low': 'success'
    };
    return colors[priority] || 'muted';
  };

  const formatTrend = (trend) => {
    const sign = trend > 0 ? '+' : '';
    return `${sign}${trend.toFixed(1)}%`;
  };

  return (
    <div className="th-reports-dashboard">
      {/* Header */}
      <div className="th-dashboard-header">
        <div className="th-header-content">
          <h1 className="th-page-title">
            <FaChartBar className="th-page-icon" />
            Reports & Analytics
          </h1>
          <p className="th-page-subtitle">
            Comprehensive reporting and data insights for Tabitha Home
          </p>
        </div>
        <div className="th-header-actions">
          <div className="th-date-filter">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="th-filter-select"
            >
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="this_year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/reports/builder')}
            icon={FaPlus}
          >
            Create Report
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/reports/scheduled')}
            icon={FaCalendarAlt}
          >
            Scheduled Reports
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="th-metrics-grid">
        <div className="th-metric-card">
          <div className="th-metric-header">
            <div className="th-metric-icon children">
              <FaChild />
            </div>
            <div className="th-metric-trend">
              {getTrendIcon(mockDashboardData.trends.children_trend)}
              <span className={`th-trend-value ${getTrendClass(mockDashboardData.trends.children_trend)}`}>
                {formatTrend(mockDashboardData.trends.children_trend)}
              </span>
            </div>
          </div>
          <div className="th-metric-body">
            <div className="th-metric-value">{mockDashboardData.summary_metrics.total_children}</div>
            <div className="th-metric-label">Total Children</div>
            <div className="th-metric-sublabel">
              +{mockDashboardData.summary_metrics.this_month_admissions} this month
            </div>
          </div>
        </div>

        <div className="th-metric-card">
          <div className="th-metric-header">
            <div className="th-metric-icon staff">
              <FaUsers />
            </div>
            <div className="th-metric-trend">
              {getTrendIcon(mockDashboardData.trends.staff_trend)}
              <span className={`th-trend-value ${getTrendClass(mockDashboardData.trends.staff_trend)}`}>
                {formatTrend(mockDashboardData.trends.staff_trend)}
              </span>
            </div>
          </div>
          <div className="th-metric-body">
            <div className="th-metric-value">{mockDashboardData.summary_metrics.total_staff}</div>
            <div className="th-metric-label">Active Staff</div>
            <div className="th-metric-sublabel">Across all departments</div>
          </div>
        </div>

        <div className="th-metric-card">
          <div className="th-metric-header">
            <div className="th-metric-icon cases">
              <FaClipboardList />
            </div>
            <div className="th-metric-trend">
              {getTrendIcon(mockDashboardData.trends.case_resolution_trend)}
              <span className={`th-trend-value ${getTrendClass(mockDashboardData.trends.case_resolution_trend)}`}>
                {formatTrend(mockDashboardData.trends.case_resolution_trend)}
              </span>
            </div>
          </div>
          <div className="th-metric-body">
            <div className="th-metric-value">{mockDashboardData.summary_metrics.active_cases}</div>
            <div className="th-metric-label">Active Cases</div>
            <div className="th-metric-sublabel">Case management</div>
          </div>
        </div>

        <div className="th-metric-card">
          <div className="th-metric-header">
            <div className="th-metric-icon budget">
              <FaMoneyBillAlt />
            </div>
            <div className="th-metric-trend">
              {getTrendIcon(mockDashboardData.trends.budget_trend)}
              <span className={`th-trend-value ${getTrendClass(mockDashboardData.trends.budget_trend)}`}>
                {formatTrend(mockDashboardData.trends.budget_trend)}
              </span>
            </div>
          </div>
          <div className="th-metric-body">
            <div className="th-metric-value">{mockDashboardData.summary_metrics.budget_utilization}%</div>
            <div className="th-metric-label">Budget Utilized</div>
            <div className="th-metric-sublabel">Current fiscal year</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="th-charts-section">
        <div className="th-charts-grid">
          {/* Admission Trends Chart */}
          <div className="th-chart-card">
            <div className="th-chart-header">
              <h3 className="th-chart-title">
                <FaArrowUp className="th-chart-icon" />
                Admission & Exit Trends
              </h3>
              <div className="th-chart-actions">
                <Button variant="outline" size="sm" icon={FaDownload}>
                  Export
                </Button>
              </div>
            </div>
            <div className="th-chart-body">
              <div className="th-chart-container">
                <Line data={admissionTrendsData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Age Group Distribution */}
          <div className="th-chart-card">
            <div className="th-chart-header">
              <h3 className="th-chart-title">
                <FaChartPie className="th-chart-icon" />
                Children by Age Group
              </h3>
              <div className="th-chart-actions">
                <Button variant="outline" size="sm" icon={FaDownload}>
                  Export
                </Button>
              </div>
            </div>
            <div className="th-chart-body">
              <div className="th-chart-container">
                <Doughnut data={ageGroupData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Staff by Department */}
          <div className="th-chart-card">
            <div className="th-chart-header">
              <h3 className="th-chart-title">
                <FaUsers className="th-chart-icon" />
                Staff by Department
              </h3>
              <div className="th-chart-actions">
                <Button variant="outline" size="sm" icon={FaDownload}>
                  Export
                </Button>
              </div>
            </div>
            <div className="th-chart-body">
              <div className="th-chart-container">
                <Bar 
                  data={{
                    labels: Object.keys(mockDashboardData.staff_by_department),
                    datasets: [{
                      data: Object.values(mockDashboardData.staff_by_department),
                      backgroundColor: 'rgba(52, 152, 219, 0.8)',
                      borderColor: 'rgb(52, 152, 219)',
                      borderWidth: 1
                    }]
                  }} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Categories & Quick Reports */}
      <div className="th-reports-section">
        <div className="th-reports-grid">
          {/* Report Categories */}
          <div className="th-categories-panel">
            <div className="th-panel-header">
              <h3 className="th-panel-title">Report Categories</h3>
            </div>
            <div className="th-categories-list">
              {reportCategories.map(category => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.id}
                    className={`th-category-item ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="th-category-icon">
                      <Icon />
                    </div>
                    <div className="th-category-content">
                      <span className="th-category-label">{category.label}</span>
                      <span className="th-category-count">{category.count} reports</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Reports */}
          <div className="th-quick-reports-panel">
            <div className="th-panel-header">
              <h3 className="th-panel-title">Quick Reports</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/reports/builder')}
                icon={FaPlus}
              >
                Custom Report
              </Button>
            </div>
            <div className="th-quick-reports-grid">
              {quickReports
                .filter(report => selectedCategory === 'all' || report.category === selectedCategory)
                .map(report => {
                  const Icon = report.icon;
                  return (
                    <div key={report.id} className="th-quick-report-card">
                      <div className="th-report-header">
                        <div className="th-report-icon">
                          <Icon />
                        </div>
                        <div className="th-report-time">
                          <FaClock className="th-time-icon" />
                          <span>{report.estimated_time}</span>
                        </div>
                      </div>
                      <div className="th-report-body">
                        <h4 className="th-report-title">{report.title}</h4>
                        <p className="th-report-description">{report.description}</p>
                      </div>
                      <div className="th-report-actions">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/reports/generate/${report.id}`)}
                          icon={FaFileAlt}
                        >
                          Generate
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/reports/preview/${report.id}`)}
                          icon={FaEye}
                        >
                          Preview
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports & Compliance Alerts */}
      <div className="th-bottom-section">
        <div className="th-bottom-grid">
          {/* Recent Reports */}
          <div className="th-recent-reports-panel">
            <div className="th-panel-header">
              <h3 className="th-panel-title">Recent Reports</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/reports/history')}
                icon={FaFileAlt}
              >
                View All
              </Button>
            </div>
            <div className="th-recent-reports-list">
              {mockDashboardData.recent_reports.map(report => (
                <div key={report.id} className="th-recent-report-item">
                  <div className="th-report-info">
                    <h4 className="th-report-name">{report.title}</h4>
                    <div className="th-report-meta">
                      <span className="th-report-type">{report.type}</span>
                      <span className="th-report-date">
                        {format(new Date(report.generated_date), 'MMM dd, yyyy')}
                      </span>
                      <span className="th-report-size">{report.file_size}</span>
                    </div>
                    <div className="th-report-author">By: {report.generated_by}</div>
                  </div>
                  <div className="th-report-actions">
                    <Button variant="outline" size="sm" icon={FaEye}>
                      View
                    </Button>
                    <Button variant="outline" size="sm" icon={FaDownload}>
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Alerts */}
          <div className="th-compliance-panel">
            <div className="th-panel-header">
              <h3 className="th-panel-title">Compliance Alerts</h3>
              <div className="th-compliance-score">
                <FaShieldAlt className="th-score-icon" />
                <span className="th-score-value">{mockDashboardData.summary_metrics.compliance_score}%</span>
              </div>
            </div>
            <div className="th-compliance-alerts">
              {mockDashboardData.compliance_alerts.map(alert => (
                <div key={alert.id} className={`th-alert-item ${getPriorityColor(alert.priority)}`}>
                  <div className="th-alert-header">
                    <div className="th-alert-icon">
                      {alert.priority === 'High' && <FaExclamationTriangle />}
                      {alert.priority === 'Medium' && <FaClock />}
                      {alert.priority === 'Low' && <FaCheckCircle />}
                    </div>
                    <div className="th-alert-priority">
                      <span className={`th-priority-badge ${getPriorityColor(alert.priority)}`}>
                        {alert.priority} Priority
                      </span>
                    </div>
                  </div>
                  <div className="th-alert-body">
                    <h4 className="th-alert-title">{alert.type}</h4>
                    <p className="th-alert-message">{alert.message}</p>
                    <div className="th-alert-meta">
                      <span className="th-alert-category">{alert.category}</span>
                      <span className="th-alert-due">
                        Due: {format(new Date(alert.due_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="th-alert-actions">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;