// src/pages/staff/StaffList.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers,
  FaPlus,
  FaSearch,
  FaFilter,
  FaDownload,
  FaPrint,
  FaEye,
  FaEdit,
  FaTrash,
  FaUserTie,
  FaUserMd,
  FaGraduationCap,
  FaShieldAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBirthdayCake,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaSort,
  FaTh,
  FaList,
  FaIdCard,
  FaAward,
  FaUserCheck
} from 'react-icons/fa';
import { format, differenceInYears, differenceInDays } from 'date-fns';
import Button from '../../components/UI/Button/Button';
import SearchInput from '../../components/Common/SearchInput';
import FilterDropdown from '../../components/Common/FilterDropdown';
import { NIGERIAN_STATES, STAFF_POSITIONS, STAFF_DEPARTMENTS } from '../../utils/nigerianStaffData';
import './StaffList.css';

const StaffList = () => {
  const navigate = useNavigate();
  
  // State management
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('hire_date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    department: 'all',
    position: 'all',
    status: 'all',
    location: 'all'
  });

  // Mock staff data - replace with API calls
  const mockStaffData = [
    {
      id: 1,
      employee_id: 'EMP-2024-001',
      first_name: 'Kemi',
      last_name: 'Adebayo',
      email: 'kemi.adebayo@tabithahome.org',
      phone: '+234-803-456-7890',
      position: 'Director',
      department: 'Administration',
      hire_date: '2020-01-15',
      employment_status: 'Active',
      role: 'admin',
      photo_url: null,
      date_of_birth: '1985-05-20',
      gender: 'Female',
      marital_status: 'Married',
      state_of_origin: 'Lagos',
      address: {
        street: '15 Victoria Island Road',
        city: 'Lagos',
        state: 'Lagos',
        postal_code: '101001'
      },
      emergency_contact: {
        name: 'Tunde Adebayo',
        relationship: 'Spouse',
        phone: '+234-803-456-7891'
      },
      education: [
        {
          institution: 'University of Lagos',
          qualification: 'Master of Social Work',
          year: '2010'
        }
      ],
      certifications: [
        'Licensed Social Worker',
        'Child Protection Specialist'
      ],
      salary: 450000, // Monthly salary in Naira
      permissions: ['all'],
      last_login: '2024-06-23',
      performance_rating: 'Excellent',
      children_assigned: 15,
      cases_handled: 45
    },
    {
      id: 2,
      employee_id: 'EMP-2024-002',
      first_name: 'Adebayo',
      last_name: 'Johnson',
      email: 'adebayo.johnson@tabithahome.org',
      phone: '+234-805-123-4567',
      position: 'Medical Officer',
      department: 'Medical',
      hire_date: '2021-03-10',
      employment_status: 'Active',
      role: 'medical_staff',
      photo_url: null,
      date_of_birth: '1980-11-15',
      gender: 'Male',
      marital_status: 'Single',
      state_of_origin: 'Oyo',
      address: {
        street: '23 Ring Road',
        city: 'Ibadan',
        state: 'Oyo',
        postal_code: '200001'
      },
      emergency_contact: {
        name: 'Mrs. Folake Johnson',
        relationship: 'Mother',
        phone: '+234-805-123-4568'
      },
      education: [
        {
          institution: 'University of Ibadan',
          qualification: 'MBBS',
          year: '2008'
        }
      ],
      certifications: [
        'Licensed Medical Doctor',
        'Pediatric Care Specialist'
      ],
      salary: 380000,
      permissions: ['medical', 'children'],
      last_login: '2024-06-22',
      performance_rating: 'Very Good',
      children_assigned: 28,
      cases_handled: 156
    },
    {
      id: 3,
      employee_id: 'EMP-2024-003',
      first_name: 'Fatima',
      last_name: 'Okafor',
      email: 'fatima.okafor@tabithahome.org',
      phone: '+234-807-890-1234',
      position: 'House Mother',
      department: 'Childcare',
      hire_date: '2022-06-01',
      employment_status: 'Active',
      role: 'staff',
      photo_url: null,
      date_of_birth: '1975-08-30',
      gender: 'Female',
      marital_status: 'Widowed',
      state_of_origin: 'Kano',
      address: {
        street: '45 Ahmadu Bello Way',
        city: 'Kano',
        state: 'Kano',
        postal_code: '700001'
      },
      emergency_contact: {
        name: 'Musa Okafor',
        relationship: 'Brother',
        phone: '+234-807-890-1235'
      },
      education: [
        {
          institution: 'Ahmadu Bello University',
          qualification: 'B.Ed. Early Childhood Education',
          year: '2000'
        }
      ],
      certifications: [
        'Child Development Specialist',
        'First Aid Certified'
      ],
      salary: 180000,
      permissions: ['children', 'activities'],
      last_login: '2024-06-23',
      performance_rating: 'Good',
      children_assigned: 12,
      cases_handled: 23
    },
    {
      id: 4,
      employee_id: 'EMP-2024-004',
      first_name: 'Chidi',
      last_name: 'Okwu',
      email: 'chidi.okwu@tabithahome.org',
      phone: '+234-806-567-8901',
      position: 'Academic Coordinator',
      department: 'Education',
      hire_date: '2021-09-15',
      employment_status: 'Active',
      role: 'staff',
      photo_url: null,
      date_of_birth: '1988-02-14',
      gender: 'Male',
      marital_status: 'Married',
      state_of_origin: 'Anambra',
      address: {
        street: '12 Zik Avenue',
        city: 'Awka',
        state: 'Anambra',
        postal_code: '420001'
      },
      emergency_contact: {
        name: 'Ngozi Okwu',
        relationship: 'Spouse',
        phone: '+234-806-567-8902'
      },
      education: [
        {
          institution: 'University of Nigeria',
          qualification: 'M.Ed. Educational Administration',
          year: '2012'
        }
      ],
      certifications: [
        'Certified Teacher',
        'Educational Leadership Certificate'
      ],
      salary: 220000,
      permissions: ['education', 'children'],
      last_login: '2024-06-21',
      performance_rating: 'Very Good',
      children_assigned: 35,
      cases_handled: 89
    },
    {
      id: 5,
      employee_id: 'EMP-2024-005',
      first_name: 'Mary',
      last_name: 'Okonkwo',
      email: 'mary.okonkwo@tabithahome.org',
      phone: '+234-804-234-5678',
      position: 'Nurse',
      department: 'Medical',
      hire_date: '2023-02-20',
      employment_status: 'Probation',
      role: 'medical_staff',
      photo_url: null,
      date_of_birth: '1992-07-10',
      gender: 'Female',
      marital_status: 'Single',
      state_of_origin: 'Enugu',
      address: {
        street: '8 Independence Layout',
        city: 'Enugu',
        state: 'Enugu',
        postal_code: '400001'
      },
      emergency_contact: {
        name: 'Peter Okonkwo',
        relationship: 'Father',
        phone: '+234-804-234-5679'
      },
      education: [
        {
          institution: 'University of Nigeria Teaching Hospital',
          qualification: 'RN (Registered Nurse)',
          year: '2015'
        }
      ],
      certifications: [
        'Registered Nurse',
        'Pediatric Nursing Specialist'
      ],
      salary: 150000,
      permissions: ['medical', 'children'],
      last_login: '2024-06-20',
      performance_rating: 'Good',
      children_assigned: 22,
      cases_handled: 67
    },
    {
      id: 6,
      employee_id: 'EMP-2024-006',
      first_name: 'Ibrahim',
      last_name: 'Yusuf',
      email: 'ibrahim.yusuf@tabithahome.org',
      phone: '+234-809-345-6789',
      position: 'Security Officer',
      department: 'Security',
      hire_date: '2022-11-01',
      employment_status: 'Active',
      role: 'staff',
      photo_url: null,
      date_of_birth: '1983-04-25',
      gender: 'Male',
      marital_status: 'Married',
      state_of_origin: 'Kaduna',
      address: {
        street: '34 Kaduna Road',
        city: 'Kaduna',
        state: 'Kaduna',
        postal_code: '800001'
      },
      emergency_contact: {
        name: 'Aisha Yusuf',
        relationship: 'Spouse',
        phone: '+234-809-345-6790'
      },
      education: [
        {
          institution: 'Kaduna State University',
          qualification: 'B.Sc. Security Management',
          year: '2007'
        }
      ],
      certifications: [
        'Licensed Security Officer',
        'Child Protection Training'
      ],
      salary: 120000,
      permissions: ['security'],
      last_login: '2024-06-23',
      performance_rating: 'Good',
      children_assigned: 0,
      cases_handled: 15
    }
  ];

  // Helper functions
  const calculateAge = (birthDate) => {
    return differenceInYears(new Date(), new Date(birthDate));
  };

  const calculateTenure = (hireDate) => {
    const years = differenceInYears(new Date(), new Date(hireDate));
    const months = differenceInDays(new Date(), new Date(hireDate)) / 30;
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      return `${Math.floor(months)} month${Math.floor(months) > 1 ? 's' : ''}`;
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Active': 'success',
      'Probation': 'warning',
      'Suspended': 'error',
      'On Leave': 'info',
      'Terminated': 'muted'
    };
    return statusColors[status] || 'muted';
  };

  const getPerformanceColor = (rating) => {
    const performanceColors = {
      'Excellent': 'success',
      'Very Good': 'primary',
      'Good': 'secondary',
      'Fair': 'warning',
      'Poor': 'error'
    };
    return performanceColors[rating] || 'muted';
  };

  const getDepartmentIcon = (department) => {
    const iconMap = {
      'Administration': FaUserTie,
      'Medical': FaUserMd,
      'Education': FaGraduationCap,
      'Childcare': FaUsers,
      'Security': FaShieldAlt,
      'Finance': FaUserTie,
      'Maintenance': FaUserTie
    };
    return iconMap[department] || FaUsers;
  };

  // Filter and sort staff
  const filteredStaff = mockStaffData.filter(staff => {
    const matchesSearch = 
      staff.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = filters.department === 'all' || staff.department === filters.department;
    const matchesPosition = filters.position === 'all' || staff.position === filters.position;
    const matchesStatus = filters.status === 'all' || staff.employment_status === filters.status;
    const matchesLocation = filters.location === 'all' || staff.address.state === filters.location;

    return matchesSearch && matchesDepartment && matchesPosition && matchesStatus && matchesLocation;
  });

  const sortedStaff = [...filteredStaff].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
        bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
        break;
      case 'hire_date':
        aValue = new Date(a.hire_date);
        bValue = new Date(b.hire_date);
        break;
      case 'department':
        aValue = a.department.toLowerCase();
        bValue = b.department.toLowerCase();
        break;
      case 'position':
        aValue = a.position.toLowerCase();
        bValue = b.position.toLowerCase();
        break;
      case 'salary':
        aValue = a.salary;
        bValue = b.salary;
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="th-staff-list">
      <div className="th-page-header">
        <div className="th-header-content">
          <h1 className="th-page-title">
            <FaUsers className="th-page-icon" />
            Staff Management
          </h1>
          <p className="th-page-subtitle">
            Manage staff records, roles, and permissions
          </p>
        </div>
        <div className="th-header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/staff/import')}
            icon={FaDownload}
          >
            Import Staff
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/staff/add')}
            icon={FaPlus}
          >
            Add Staff Member
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="th-stats-grid">
        <div className="th-stat-card">
          <div className="th-stat-icon-wrapper">
            <FaUsers className="th-stat-icon" />
          </div>
          <div className="th-stat-content">
            <span className="th-stat-number">{mockStaffData.length}</span>
            <span className="th-stat-label">Total Staff</span>
          </div>
        </div>
        <div className="th-stat-card">
          <div className="th-stat-icon-wrapper active">
            <FaCheckCircle className="th-stat-icon" />
          </div>
          <div className="th-stat-content">
            <span className="th-stat-number">
              {mockStaffData.filter(s => s.employment_status === 'Active').length}
            </span>
            <span className="th-stat-label">Active Staff</span>
          </div>
        </div>
        <div className="th-stat-card">
          <div className="th-stat-icon-wrapper warning">
            <FaClock className="th-stat-icon" />
          </div>
          <div className="th-stat-content">
            <span className="th-stat-number">
              {mockStaffData.filter(s => s.employment_status === 'Probation').length}
            </span>
            <span className="th-stat-label">On Probation</span>
          </div>
        </div>
        <div className="th-stat-card">
          <div className="th-stat-icon-wrapper primary">
            <FaAward className="th-stat-icon" />
          </div>
          <div className="th-stat-content">
            <span className="th-stat-number">
              {mockStaffData.filter(s => s.performance_rating === 'Excellent').length}
            </span>
            <span className="th-stat-label">Excellent Rating</span>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="th-controls-section">
        <div className="th-controls-left">
          <div className="th-search-container">
            <FaSearch className="th-search-icon" />
            <input
              type="text"
              placeholder="Search staff members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="th-search-input"
            />
          </div>
          
          <select
            value={filters.department}
            onChange={(e) => setFilters({...filters, department: e.target.value})}
            className="th-filter-select"
          >
            <option value="all">All Departments</option>
            {STAFF_DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="th-filter-select"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Probation">Probation</option>
            <option value="On Leave">On Leave</option>
            <option value="Suspended">Suspended</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="th-sort-select"
          >
            <option value="hire_date">Sort by Hire Date</option>
            <option value="name">Sort by Name</option>
            <option value="department">Sort by Department</option>
            <option value="position">Sort by Position</option>
            <option value="salary">Sort by Salary</option>
          </select>

          <button
            className="th-sort-order-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <FaSort />
          </button>
        </div>

        <div className="th-controls-right">
          <div className="th-view-toggle">
            <button
              className={`th-view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Card View"
            >
              <FaTh />
            </button>
            <button
              className={`th-view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <FaList />
            </button>
          </div>
          
          <span className="th-results-count">
            {sortedStaff.length} staff member{sortedStaff.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Staff Content */}
      <div className="th-staff-content">
        {viewMode === 'cards' ? (
          <div className="th-staff-grid">
            {sortedStaff.map(staff => {
              const DepartmentIcon = getDepartmentIcon(staff.department);
              const statusColor = getStatusColor(staff.employment_status);
              const performanceColor = getPerformanceColor(staff.performance_rating);
              const age = calculateAge(staff.date_of_birth);
              const tenure = calculateTenure(staff.hire_date);

              return (
                <div key={staff.id} className="th-staff-card">
                  <div className="th-card-header">
                    <div className="th-staff-avatar">
                      {staff.photo_url ? (
                        <img src={staff.photo_url} alt={`${staff.first_name} ${staff.last_name}`} />
                      ) : (
                        <div className="th-avatar-placeholder">
                          <FaUserCheck />
                        </div>
                      )}
                      <div className={`th-status-indicator ${statusColor}`}></div>
                    </div>
                    <div className="th-staff-actions">
                      <button
                        className="th-action-btn view"
                        onClick={() => navigate(`/staff/${staff.id}`)}
                        title="View Profile"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="th-action-btn edit"
                        onClick={() => navigate(`/staff/${staff.id}/edit`)}
                        title="Edit Staff"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </div>

                  <div className="th-card-body">
                    <div className="th-staff-info">
                      <h3 className="th-staff-name">
                        {staff.first_name} {staff.last_name}
                      </h3>
                      <p className="th-staff-id">{staff.employee_id}</p>
                      
                      <div className="th-staff-role">
                        <DepartmentIcon className="th-role-icon" />
                        <div className="th-role-details">
                          <span className="th-position">{staff.position}</span>
                          <span className="th-department">{staff.department}</span>
                        </div>
                      </div>

                      <div className="th-staff-meta">
                        <div className="th-meta-item">
                          <FaPhone className="th-meta-icon" />
                          <span>{staff.phone}</span>
                        </div>
                        <div className="th-meta-item">
                          <FaEnvelope className="th-meta-icon" />
                          <span>{staff.email}</span>
                        </div>
                        <div className="th-meta-item">
                          <FaMapMarkerAlt className="th-meta-icon" />
                          <span>{staff.address.city}, {staff.address.state}</span>
                        </div>
                        <div className="th-meta-item">
                          <FaCalendarAlt className="th-meta-icon" />
                          <span>Joined {format(new Date(staff.hire_date), 'MMM yyyy')}</span>
                        </div>
                      </div>

                      <div className="th-staff-stats">
                        <div className="th-stat-item">
                          <span className="th-stat-value">{staff.children_assigned}</span>
                          <span className="th-stat-label">Children</span>
                        </div>
                        <div className="th-stat-item">
                          <span className="th-stat-value">{staff.cases_handled}</span>
                          <span className="th-stat-label">Cases</span>
                        </div>
                        <div className="th-stat-item">
                          <span className="th-stat-value">{tenure}</span>
                          <span className="th-stat-label">Tenure</span>
                        </div>
                      </div>

                      <div className="th-staff-badges">
                        <span className={`th-status-badge ${statusColor}`}>
                          {staff.employment_status}
                        </span>
                        <span className={`th-performance-badge ${performanceColor}`}>
                          {staff.performance_rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="th-staff-table-container">
            <table className="th-staff-table">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Contact</th>
                  <th>Hire Date</th>
                  <th>Status</th>
                  <th>Performance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedStaff.map(staff => {
                  const statusColor = getStatusColor(staff.employment_status);
                  const performanceColor = getPerformanceColor(staff.performance_rating);

                  return (
                    <tr key={staff.id} className="th-table-row">
                      <td className="th-staff-cell">
                        <div className="th-staff-info-compact">
                          <div className="th-staff-avatar-small">
                            {staff.photo_url ? (
                              <img src={staff.photo_url} alt={`${staff.first_name} ${staff.last_name}`} />
                            ) : (
                              <FaUserCheck />
                            )}
                          </div>
                          <div className="th-staff-details">
                            <span className="th-staff-name-compact">
                              {staff.first_name} {staff.last_name}
                            </span>
                            <span className="th-staff-id-compact">{staff.employee_id}</span>
                          </div>
                        </div>
                      </td>
                      <td>{staff.position}</td>
                      <td>
                        <div className="th-department-cell">
                          {React.createElement(getDepartmentIcon(staff.department), {
                            className: 'th-department-icon'
                          })}
                          <span>{staff.department}</span>
                        </div>
                      </td>
                      <td>
                        <div className="th-contact-cell">
                          <div className="th-contact-item">
                            <FaPhone className="th-contact-icon" />
                            <span>{staff.phone}</span>
                          </div>
                          <div className="th-contact-item">
                            <FaEnvelope className="th-contact-icon" />
                            <span>{staff.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>{format(new Date(staff.hire_date), 'MMM dd, yyyy')}</td>
                      <td>
                        <span className={`th-status-badge ${statusColor}`}>
                          {staff.employment_status}
                        </span>
                      </td>
                      <td>
                        <span className={`th-performance-badge ${performanceColor}`}>
                          {staff.performance_rating}
                        </span>
                      </td>
                      <td>
                        <div className="th-table-actions">
                          <button
                            className="th-action-btn view"
                            onClick={() => navigate(`/staff/${staff.id}`)}
                            title="View Profile"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="th-action-btn edit"
                            onClick={() => navigate(`/staff/${staff.id}/edit`)}
                            title="Edit Staff"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {sortedStaff.length === 0 && (
          <div className="th-empty-state">
            <div className="th-empty-icon">
              <FaUsers />
            </div>
            <h3 className="th-empty-title">No staff members found</h3>
            <p className="th-empty-text">
              {searchQuery 
                ? `No staff members match "${searchQuery}"`
                : 'No staff members match the current filters'
              }
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/staff/add')}
              icon={FaPlus}
            >
              Add First Staff Member
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffList;