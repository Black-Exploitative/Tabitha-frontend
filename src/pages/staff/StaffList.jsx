// src/pages/staff/StaffList.jsx - Following Children List Pattern
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaFilter,
  FaDownload, 
  FaPrint,
  FaUsers,
  FaUserTie,
  FaUserMd,
  FaChalkboardTeacher,
  FaEdit,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaIdCard,
  FaUserCheck,
  FaUserClock,
  FaExclamationTriangle,
  FaTh,
  FaList,
  FaSortAmountDown,
  FaSortAmountUp
} from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import Button from '../../components/UI/Button/Button';
import SearchInput from '../../components/Common/SearchInput';
import FilterDropdown from '../../components/Common/FilterDropdown';
import LoadingSpinner from '../../components/UI/Loading/LoadingSpinner';
import { staffService } from '../../services/staff';
import { useAuth } from '../../context/AuthContext';
import './StaffList.css';

const StaffList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [viewMode, setViewMode] = useState('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_hired');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    department: 'all',
    status: 'all',
    position: 'all'
  });

  // Your existing API call
  const { 
    data: staffData, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['staff', { searchQuery, sortBy, sortOrder, filters }],
    queryFn: () => staffService.getStaff({ 
      search: searchQuery, 
      department: filters.department !== 'all' ? filters.department : '', 
      status: filters.status !== 'all' ? filters.status : '',
      sortBy,
      sortOrder
    }),
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  // Mock data as fallback
  const mockStaff = [
    {
      _id: '1',
      first_name: 'Sarah',
      last_name: 'Johnson',
      employee_id: 'EMP001',
      position: 'Senior Nurse',
      department: 'Medical',
      employment_status: 'Active',
      email: 'sarah.johnson@townhall.org',
      phone: '+1 (555) 123-4567',
      date_hired: '2022-01-15',
      photo_url: null
    },
    {
      _id: '2',
      first_name: 'Michael',
      last_name: 'Chen',
      employee_id: 'EMP002',
      position: 'Math Teacher',
      department: 'Education',
      employment_status: 'Active',
      email: 'michael.chen@townhall.org',
      phone: '+1 (555) 234-5678',
      date_hired: '2021-08-20',
      photo_url: null
    },
    {
      _id: '3',
      first_name: 'Emily',
      last_name: 'Rodriguez',
      employee_id: 'EMP003',
      position: 'Administrator',
      department: 'Administration',
      employment_status: 'On Leave',
      email: 'emily.rodriguez@townhall.org',
      phone: '+1 (555) 345-6789',
      date_hired: '2020-03-10',
      photo_url: null
    }
  ];

  const staff = staffData?.data || mockStaff;
  const totalCount = staffData?.total || mockStaff.length;

  const stats = useMemo(() => {
    const active = staff.filter(member => member.employment_status === 'Active').length;
    const medical = staff.filter(member => member.department === 'Medical').length;
    const education = staff.filter(member => member.department === 'Education').length;
    const administration = staff.filter(member => member.department === 'Administration').length;

    return {
      total: staff.length,
      active,
      medical,
      education,
      administration
    };
  }, [staff]);

  const filterOptions = {
    department: [
      { value: 'all', label: 'All Departments' },
      { value: 'Administration', label: 'Administration' },
      { value: 'Child Care', label: 'Child Care' },
      { value: 'Education', label: 'Education' },
      { value: 'Medical', label: 'Medical' },
      { value: 'Kitchen', label: 'Kitchen' },
      { value: 'Security', label: 'Security' },
      { value: 'Maintenance', label: 'Maintenance' },
      { value: 'Social Services', label: 'Social Services' }
    ],
    status: [
      { value: 'all', label: 'All Status' },
      { value: 'Active', label: 'Active' },
      { value: 'On Leave', label: 'On Leave' },
      { value: 'Suspended', label: 'Suspended' },
      { value: 'Terminated', label: 'Terminated' }
    ],
    position: [
      { value: 'all', label: 'All Positions' },
      { value: 'Manager', label: 'Manager' },
      { value: 'Supervisor', label: 'Supervisor' },
      { value: 'Teacher', label: 'Teacher' },
      { value: 'Nurse', label: 'Nurse' },
      { value: 'Administrator', label: 'Administrator' }
    ]
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setFilters({
      department: 'all',
      status: 'all',
      position: 'all'
    });
    setSearchQuery('');
  };

  const exportData = (format) => {
    console.log(`Exporting staff data as ${format}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <FaUserCheck className="status-icon active" />;
      case 'On Leave': return <FaUserClock className="status-icon leave" />;
      case 'Suspended': 
      case 'Terminated': return <FaExclamationTriangle className="status-icon inactive" />;
      default: return <FaUsers className="status-icon" />;
    }
  };

  const getDepartmentIcon = (department) => {
    switch (department) {
      case 'Medical': return <FaUserMd />;
      case 'Education': return <FaChalkboardTeacher />;
      case 'Administration': return <FaUserTie />;
      default: return <FaUsers />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return (
      <div className="th-staff-loading">
        <LoadingSpinner size="lg" />
        <p>Loading staff members...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="th-staff-error">
        <h2>Error loading staff</h2>
        <p>Please try refreshing the page</p>
        <Button onClick={refetch} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="th-staff-list">
      {/* Page Header */}
      <div className="th-staff-header">
        <div className="th-header-content">
          <h1 className="th-page-title">
            <FaUsers className="th-title-icon" />
            Staff Management
          </h1>
          <p className="th-page-description">
            Manage and track all staff members at Tabitha Home
          </p>
        </div>
        
        <div className="th-header-actions">
          <Button
            variant="outline"
            size="sm"
            icon={<FaPrint />}
            onClick={() => exportData('pdf')}
          >
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<FaDownload />}
            onClick={() => exportData('excel')}
          >
            Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<FaPlus />}
            onClick={() => navigate('/staff/add')}
          >
            Add Staff
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="th-staff-stats">
        <div className="th-stat-card">
          <div className="th-stat-icon">
            <FaUsers />
          </div>
          <div className="th-stat-content">
            <span className="th-stat-value">{stats.total}</span>
            <span className="th-stat-label">Total Staff</span>
          </div>
        </div>
        
        <div className="th-stat-card">
          <div className="th-stat-icon active">
            <FaUserCheck />
          </div>
          <div className="th-stat-content">
            <span className="th-stat-value">{stats.active}</span>
            <span className="th-stat-label">Active</span>
          </div>
        </div>
        
        <div className="th-stat-card">
          <div className="th-stat-icon medical">
            <FaUserMd />
          </div>
          <div className="th-stat-content">
            <span className="th-stat-value">{stats.medical}</span>
            <span className="th-stat-label">Medical</span>
          </div>
        </div>
        
        <div className="th-stat-card">
          <div className="th-stat-icon education">
            <FaChalkboardTeacher />
          </div>
          <div className="th-stat-content">
            <span className="th-stat-value">{stats.education}</span>
            <span className="th-stat-label">Education</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="th-staff-controls">
        <div className="th-controls-left">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search staff by name, ID, or position..."
            className="th-staff-search"
          />
          
          <div className="th-filter-group">
            <FilterDropdown
              label="Department"
              value={filters.department}
              onChange={(value) => handleFilterChange('department', value)}
              options={filterOptions.department}
            />
            
            <FilterDropdown
              label="Status"
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              options={filterOptions.status}
            />
            
            <FilterDropdown
              label="Position"
              value={filters.position}
              onChange={(value) => handleFilterChange('position', value)}
              options={filterOptions.position}
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
          >
            Clear
          </Button>
        </div>
        
        <div className="th-controls-right">
          <div className="th-sort-controls">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="th-sort-select"
            >
              <option value="date_hired">Date Hired</option>
              <option value="first_name">Name</option>
              <option value="department">Department</option>
              <option value="position">Position</option>
            </select>
            
            <button
              className="th-sort-order-btn"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
            </button>
          </div>
          
          <div className="th-view-toggle">
            <button
              className={`th-view-btn ${viewMode === 'cards' ? 'th-view-active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Card View"
            >
              <FaTh />
            </button>
            <button
              className={`th-view-btn ${viewMode === 'table' ? 'th-view-active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="th-results-summary">
        <span className="th-results-count">
          Showing {staff.length} of {totalCount} staff members
        </span>
        {(searchQuery || Object.values(filters).some(f => f !== 'all')) && (
          <span className="th-filter-indicator">
            (Filtered)
          </span>
        )}
      </div>

      {/* Staff Content */}
      <div className="th-staff-content">
        {staff.length > 0 ? (
          <div className="th-staff-grid">
            {staff.map(member => (
              <div key={member._id} className="th-staff-card">
                <div className="th-staff-card-header">
                  <div className="th-staff-avatar">
                    {member.photo_url ? (
                      <img 
                        src={member.photo_url} 
                        alt={`${member.first_name} ${member.last_name}`} 
                      />
                    ) : (
                      <div className="th-avatar-placeholder">
                        {member.first_name?.[0]}{member.last_name?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="th-staff-status">
                    {getStatusIcon(member.employment_status)}
                  </div>
                </div>

                <div className="th-staff-card-body">
                  <h3 className="th-staff-name">
                    {member.first_name} {member.last_name}
                  </h3>
                  
                  <p className="th-staff-id">ID: {member.employee_id || 'Unassigned'}</p>
                  
                  <div className="th-staff-position">
                    {getDepartmentIcon(member.department)}
                    <span className="th-position-text">{member.position}</span>
                  </div>
                  
                  <div className="th-staff-department">
                    {member.department}
                  </div>

                  <div className="th-staff-details">
                    <div className="th-detail-item">
                      <FaEnvelope className="th-detail-icon" />
                      <span>{member.email}</span>
                    </div>
                    
                    <div className="th-detail-item">
                      <FaPhone className="th-detail-icon" />
                      <span>{member.phone}</span>
                    </div>
                    
                    <div className="th-detail-item">
                      <FaCalendarAlt className="th-detail-icon" />
                      <span>Hired: {formatDate(member.date_hired)}</span>
                    </div>
                  </div>
                </div>

                <div className="th-staff-card-footer">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<FaEye />}
                    onClick={() => navigate(`/staff/${member._id}`)}
                    style={{ flex: 1 }}
                  >
                    View
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<FaEdit />}
                    onClick={() => navigate(`/staff/${member._id}/edit`)}
                    style={{ flex: 1 }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="th-staff-empty">
            <div className="th-empty-icon">
              <FaUsers />
            </div>
            <h3>No Staff Members Found</h3>
            <p>
              {searchQuery || Object.values(filters).some(f => f !== 'all')
                ? 'No staff members match your current search and filter criteria.'
                : 'No staff members have been registered yet.'
              }
            </p>
            {user?.permissions?.includes('staff.create') && (
              <Button
                variant="primary"
                icon={<FaPlus />}
                onClick={() => navigate('/staff/add')}
              >
                Add First Staff Member
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffList;