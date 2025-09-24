// src/pages/reports/Reports.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaEye, 
  FaDownload, 
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaFileAlt,
  FaChartBar,
  FaFilter,
  FaSearch,
  FaClock,
  FaUser,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import Button from '../../components/UI/Button/Button';
import SearchInput from '../../components/Common/SearchInput';
import FilterDropdown from '../../components/Common/FilterDropdown';
import './Reports.css';

const Reports = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);

  // Mock reports data
  const mockReports = [
    {
      id: 1,
      name: 'Monthly Child Statistics',
      description: 'Overview of children demographics and statistics',
      category: 'children',
      status: 'scheduled',
      last_generated: '2024-06-20T10:30:00Z',
      next_scheduled: '2024-07-01T09:00:00Z',
      generated_by: 'System Auto',
      format: 'PDF',
      file_size: '2.4 MB',
      download_count: 15
    },
    {
      id: 2,
      name: 'Staff Performance Review',
      description: 'Quarterly staff performance and evaluation report',
      category: 'staff',
      status: 'ready',
      last_generated: '2024-06-25T14:45:00Z',
      next_scheduled: null,
      generated_by: 'Dr. Sarah Okonkwo',
      format: 'Excel',
      file_size: '1.8 MB',
      download_count: 8
    },
    {
      id: 3,
      name: 'Financial Summary Q2',
      description: 'Detailed financial breakdown for Q2 2024',
      category: 'financial',
      status: 'generating',
      last_generated: '2024-03-31T16:20:00Z',
      next_scheduled: null,
      generated_by: 'John Adebayo',
      format: 'PDF',
      file_size: '3.1 MB',
      download_count: 12
    },
    {
      id: 4,
      name: 'Medical Records Audit',
      description: 'Annual audit of all medical records and compliance',
      category: 'medical',
      status: 'draft',
      last_generated: null,
      next_scheduled: '2024-07-15T08:00:00Z',
      generated_by: 'Dr. Sarah Okonkwo',
      format: 'PDF',
      file_size: null,
      download_count: 0
    }
  ];

  const categories = [
    'children',
    'staff',
    'financial',
    'medical',
    'operational',
    'compliance'
  ];

  const statuses = [
    'ready',
    'generating',
    'scheduled',
    'draft',
    'error'
  ];

  const getStatusColor = (status) => {
    const colors = {
      ready: 'success',
      generating: 'warning',
      scheduled: 'info',
      draft: 'muted',
      error: 'error'
    };
    return colors[status] || 'muted';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready': return <FaCheckCircle />;
      case 'generating': return <FaClock />;
      case 'scheduled': return <FaCalendarAlt />;
      case 'error': return <FaExclamationTriangle />;
      default: return <FaFileAlt />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'children': return <FaUser />;
      case 'staff': return <FaUser />;
      case 'financial': return <FaChartBar />;
      case 'medical': return <FaFileAlt />;
      default: return <FaFileAlt />;
    }
  };

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = !searchTerm || 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter.length === 0 || 
      categoryFilter.includes(report.category);
    
    const matchesStatus = statusFilter.length === 0 || 
      statusFilter.includes(report.status);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="th-reports">
      <div className="th-reports-header">
        <div className="th-header-content">
          <h1 className="th-page-title">Reports</h1>
          <p className="th-page-description">
            Generate, schedule, and manage organizational reports
          </p>
        </div>
        
        <div className="th-header-actions">
          <Button 
            variant="outline" 
            icon={FaChartBar}
            onClick={() => navigate('/reports/dashboard')}
          >
            Dashboard
          </Button>
          <Button 
            variant="primary" 
            icon={FaPlus}
            onClick={() => navigate('/reports/builder')}
          >
            Create Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="th-reports-filters">
        <div className="th-filters-row">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search reports..."
            size="md"
          />
          
          <FilterDropdown
            options={categories}
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="All Categories"
            multiSelect={true}
          />
          
          <FilterDropdown
            options={statuses}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Status"
            multiSelect={true}
          />
        </div>
      </div>

      {/* Reports List */}
      <div className="th-reports-grid">
        {filteredReports.map(report => (
          <div key={report.id} className="th-report-card">
            <div className="th-report-header">
              <div className="th-report-category">
                <span className="th-category-icon">
                  {getCategoryIcon(report.category)}
                </span>
                <span className="th-category-text">
                  {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                </span>
              </div>
              
              <div className={`th-report-status th-status-${getStatusColor(report.status)}`}>
                <span className="th-status-icon">
                  {getStatusIcon(report.status)}
                </span>
                <span className="th-status-text">
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="th-report-body">
              <h3 className="th-report-name">{report.name}</h3>
              <p className="th-report-description">{report.description}</p>
              
              <div className="th-report-meta">
                {report.last_generated && (
                  <div className="th-meta-item">
                    <FaClock className="th-meta-icon" />
                    <span>
                      Generated: {format(parseISO(report.last_generated), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
                
                {report.generated_by && (
                  <div className="th-meta-item">
                    <FaUser className="th-meta-icon" />
                    <span>By: {report.generated_by}</span>
                  </div>
                )}
                
                {report.file_size && (
                  <div className="th-meta-item">
                    <FaFileAlt className="th-meta-icon" />
                    <span>{report.format} • {report.file_size}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="th-report-actions">
              {report.status === 'ready' && (
                <>
                  <Button variant="ghost" size="sm" icon={FaEye}>
                    View
                  </Button>
                  <Button variant="ghost" size="sm" icon={FaDownload}>
                    Download
                  </Button>
                </>
              )}
              
              <Button variant="ghost" size="sm" icon={FaEdit}>
                Edit
              </Button>
              
              <Button variant="ghost" size="sm" icon={FaTrash}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="th-reports-empty">
          <div className="th-empty-icon">
            <FaFileAlt />
          </div>
          <h3 className="th-empty-title">No reports found</h3>
          <p className="th-empty-message">
            {searchTerm || categoryFilter.length > 0 || statusFilter.length > 0
              ? 'Try adjusting your search criteria'
              : 'Create your first report to get started'
            }
          </p>
          {!searchTerm && categoryFilter.length === 0 && statusFilter.length === 0 && (
            <Button 
              variant="primary" 
              icon={FaPlus}
              onClick={() => navigate('/reports/builder')}
            >
              Create Report
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;