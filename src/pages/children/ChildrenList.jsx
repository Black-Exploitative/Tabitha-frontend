import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaDownload,
  FaPrint,
  FaChild,
  FaGraduationCap,
  FaUserMd,
  FaHeart,
  FaTh,
  FaList,
  FaSortAmountDown,
  FaSortAmountUp,
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaExclamationTriangle
} from 'react-icons/fa';
import Button from '../../components/UI/Button/Button';
import ChildCard from '../../components/Children/ChildCard';
import ChildrenTable from '../../components/Children/ChildrenTable';
import SearchInput from '../../components/Common/SearchInput';
import LoadingSpinner from '../../components/UI/Loading/LoadingSpinner';
import { childrenService } from '../../services/children';
import { useAuth } from '../../context/AuthContext';
import { NIGERIAN_STATES } from '../../utils/nigerianData';
import './ChildrenList.css';

const FilterDropdown = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const isActive = value !== 'all';

  return (
    <div className="th-filter-dropdown" ref={dropdownRef}>
      <button
        className={`th-filter-btn ${isActive ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption?.label || label}
        <FaChevronDown style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </button>
      
      {isOpen && (
        <div className="th-filter-dropdown-menu">
          {options.map(option => (
            <div
              key={option.value}
              className={`th-filter-option ${value === option.value ? 'selected' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ChildrenList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [viewMode, setViewMode] = useState('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('admission_date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    ageRange: 'all',
    gender: 'all',
    state: 'all',
    educationLevel: 'all',
    healthStatus: 'all'
  });

  const { 
    data: childrenData, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['children', { searchQuery, sortBy, sortOrder, filters }],
    queryFn: () => {
      const params = {};
      
      if (searchQuery.trim()) {
        params.searchQuery = searchQuery.trim();
      }
      
      if (sortBy !== 'admission_date') {
        params.sortBy = sortBy;
      }
      
      if (sortOrder !== 'desc') {
        params.sortOrder = sortOrder;
      }
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== 'all' && value !== '') {
          params[key] = value;
        }
      });
      
      return childrenService.getChildren(params);
    },
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (childId) => childrenService.deleteChild(childId),
    onSuccess: () => {
      queryClient.invalidateQueries(['children']);
      setDeleteConfirm(null);
    },
    onError: (error) => {
      console.error('Failed to delete child:', error);
    }
  });

  const mockChildren = [
    {
      id: 1,
      child_id: 'TH-2024-001',
      first_name: 'Sarah',
      middle_name: 'Adunni',
      last_name: 'Adebayo',
      date_of_birth: '2015-03-15',
      gender: 'Female',
      admission_date: '2024-01-15',
      current_status: 'Active',
      state_of_origin: 'Lagos',
      preferred_language: 'Yoruba',
      education_level: 'Primary 4',
      school_name: 'St. Mary\'s Primary School',
      health_status: 'Good',
      genotype: 'AA',
      blood_type: 'O+',
      photo_url: null,
      guardian_name: 'Mrs. Kemi Adebayo',
      case_worker: 'Dr. Amina Hassan',
      ambition: 'Doctor',
      last_checkup: '2024-05-15'
    },
    {
      id: 2,
      child_id: 'TH-2024-002',
      first_name: 'Ahmed',
      middle_name: 'Musa',
      last_name: 'Ibrahim',
      date_of_birth: '2012-08-22',
      gender: 'Male',
      admission_date: '2024-02-10',
      current_status: 'Active',
      state_of_origin: 'Kano',
      preferred_language: 'Hausa',
      education_level: 'JSS 2',
      school_name: 'Government Secondary School',
      health_status: 'Excellent',
      genotype: 'AS',
      blood_type: 'A+',
      photo_url: null,
      guardian_name: 'Malam Yusuf Ibrahim',
      case_worker: 'Mrs. Fatima Yusuf',
      ambition: 'Engineer',
      last_checkup: '2024-06-01'
    },
    {
      id: 3,
      child_id: 'TH-2024-003',
      first_name: 'Chioma',
      middle_name: 'Grace',
      last_name: 'Okafor',
      date_of_birth: '2016-11-30',
      gender: 'Female',
      admission_date: '2024-03-05',
      current_status: 'Active',
      state_of_origin: 'Anambra',
      preferred_language: 'Igbo',
      education_level: 'Primary 2',
      school_name: 'Holy Trinity Primary School',
      health_status: 'Good',
      genotype: 'AA',
      blood_type: 'B+',
      photo_url: null,
      guardian_name: 'Mr. Emeka Okafor',
      case_worker: 'Mr. Chinedu Obi',
      ambition: 'Teacher',
      last_checkup: '2024-05-20'
    }
  ];

  const children = childrenData?.children || mockChildren;
  const totalCount = childrenData?.total || mockChildren.length;

  const stats = useMemo(() => {
    const active = children.filter(child => child.current_status === 'Active').length;
    const avgAge = children.reduce((sum, child) => {
      const age = new Date().getFullYear() - new Date(child.date_of_birth).getFullYear();
      return sum + age;
    }, 0) / children.length;
    
    const genderBreakdown = children.reduce((acc, child) => {
      acc[child.gender] = (acc[child.gender] || 0) + 1;
      return acc;
    }, {});

    return {
      total: children.length,
      active,
      avgAge: Math.round(avgAge),
      male: genderBreakdown.Male || 0,
      female: genderBreakdown.Female || 0
    };
  }, [children]);

  const filterOptions = {
    status: [
      { value: 'all', label: 'All Status' },
      { value: 'Active', label: 'Active' },
      { value: 'Exited', label: 'Exited' },
      { value: 'Transferred', label: 'Transferred' },
      { value: 'Adopted', label: 'Adopted' }
    ],
    ageRange: [
      { value: 'all', label: 'All Ages' },
      { value: '0-5', label: '0-5 years' },
      { value: '6-12', label: '6-12 years' },
      { value: '13-17', label: '13-17 years' },
      { value: '18+', label: '18+ years' }
    ],
    gender: [
      { value: 'all', label: 'All Genders' },
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' }
    ],
    state: [
      { value: 'all', label: 'All States' },
      ...NIGERIAN_STATES
    ],
    educationLevel: [
      { value: 'all', label: 'All Levels' },
      { value: 'Pre-School', label: 'Pre-School' },
      { value: 'Primary', label: 'Primary School' },
      { value: 'Secondary', label: 'Secondary School' },
      { value: 'Tertiary', label: 'Tertiary' }
    ],
    healthStatus: [
      { value: 'all', label: 'All Health Status' },
      { value: 'Excellent', label: 'Excellent' },
      { value: 'Good', label: 'Good' },
      { value: 'Fair', label: 'Fair' },
      { value: 'Poor', label: 'Poor' }
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
      status: 'all',
      ageRange: 'all',
      gender: 'all',
      state: 'all',
      educationLevel: 'all',
      healthStatus: 'all'
    });
    setSearchQuery('');
  };

  const exportData = (format) => {
    console.log(`Exporting children data as ${format}`);
  };

  const handleQuickDelete = (childId) => {
    setDeleteConfirm(childId);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteMutation.mutate(deleteConfirm);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const getChildAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <div className="th-children-loading">
        <LoadingSpinner size="lg" />
        <p>Loading children records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="th-children-error">
        <h2>Error loading children</h2>
        <p>Please try refreshing the page</p>
        <Button onClick={refetch} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="th-children-list">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="th-modal-overlay">
          <div className="th-modal">
            <div className="th-modal-header">
              <div className="th-modal-icon">
                <FaExclamationTriangle />
              </div>
              <h3>Delete Child Record</h3>
            </div>
            <p>
              Are you sure you want to delete this child's record? This action cannot be undone and all associated data will be permanently removed.
            </p>
            <div className="th-modal-actions">
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={confirmDelete}
                loading={deleteMutation.isPending}
                icon={<FaTrash />}
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="th-header-content">
        <div className="th-header-main">
          <h1 className="th-page-title">
            <FaChild className="th-title-icon" />
            Children Management
          </h1>
          <p className="th-page-subtitle">
            Manage and track all children records at Tabitha Home
          </p>
        </div>
        
        <div className="th-page-actions">
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
            onClick={() => navigate('/children/add')}
          >
            Add Child
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="th-children-stats">
        <div className="th-stat-card">
          <div className="th-stat-icon th-stat-primary">
            <FaChild />
          </div>
          <div className="th-stat-content">
            <span className="th-stat-value">{stats.total}</span>
            <span className="th-stat-label">Total Children</span>
          </div>
        </div>
        
        <div className="th-stat-card">
          <div className="th-stat-icon th-stat-success">
            <FaHeart />
          </div>
          <div className="th-stat-content">
            <span className="th-stat-value">{stats.active}</span>
            <span className="th-stat-label">Active</span>
          </div>
        </div>
        
        <div className="th-stat-card">
          <div className="th-stat-icon th-stat-info">
            <FaGraduationCap />
          </div>
          <div className="th-stat-content">
            <span className="th-stat-value">{stats.avgAge}</span>
            <span className="th-stat-label">Avg Age</span>
          </div>
        </div>
        
        <div className="th-stat-card">
          <div className="th-stat-icon th-stat-accent">
            <FaUserMd />
          </div>
          <div className="th-stat-content">
            <span className="th-stat-value">{stats.male}/{stats.female}</span>
            <span className="th-stat-label">M/F Ratio</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="th-children-controls">
        <div className="th-controls-left">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search children by name, ID, or case worker..."
            className="th-children-search"
          />
          
          <div className="th-filter-group">
            <FilterDropdown
              label="Status"
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              options={filterOptions.status}
            />
            
            <FilterDropdown
              label="Age"
              value={filters.ageRange}
              onChange={(value) => handleFilterChange('ageRange', value)}
              options={filterOptions.ageRange}
            />
            
            <FilterDropdown
              label="Gender"
              value={filters.gender}
              onChange={(value) => handleFilterChange('gender', value)}
              options={filterOptions.gender}
            />
            
            <FilterDropdown
              label="State"
              value={filters.state}
              onChange={(value) => handleFilterChange('state', value)}
              options={filterOptions.state}
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </div>
        
        <div className="th-controls-right">
          <div className="th-sort-controls">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="th-sort-select"
            >
              <option value="admission_date">Admission Date</option>
              <option value="first_name">Name</option>
              <option value="date_of_birth">Age</option>
              <option value="education_level">Education</option>
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
          Showing {children.length} of {totalCount} children
        </span>
        {(searchQuery || Object.values(filters).some(f => f !== 'all')) && (
          <span className="th-filter-indicator">
            (Filtered)
          </span>
        )}
      </div>

      {/* Children List */}
      <div className="th-children-content">
        {children.length > 0 ? (
          viewMode === 'cards' ? (
            <div className="th-children-list-container">
              {children.map(child => {
                const initials = `${child.first_name[0]}${child.last_name[0]}`;
                const age = getChildAge(child.date_of_birth);
                
                return (
                  <div key={child.id} className="th-child-row">
                    <div className="th-child-info">
                      <div className="th-child-main">
                        <div className="th-child-avatar">
                          {child.photo_url ? (
                            <img src={child.photo_url} alt={child.first_name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            initials
                          )}
                        </div>
                        <div className="th-child-details">
                          <h3 className="th-child-name">
                            {child.first_name} {child.middle_name} {child.last_name}
                          </h3>
                          <p className="th-child-id">{child.child_id}</p>
                        </div>
                      </div>
                      
                      <div className="th-child-meta">
                        <div className="th-meta-item">
                          <span className="th-meta-label">Age</span>
                          <span className="th-meta-value">{age} years</span>
                        </div>
                        <div className="th-meta-item">
                          <span className="th-meta-label">Gender</span>
                          <span className="th-meta-value">{child.gender}</span>
                        </div>
                        <div className="th-meta-item">
                          <span className="th-meta-label">Education</span>
                          <span className="th-meta-value">{child.education_level}</span>
                        </div>
                        <div className="th-meta-item">
                          <span className="th-meta-label">Case Worker</span>
                          <span className="th-meta-value">{child.case_worker}</span>
                        </div>
                      </div>
                      
                      <div>
                        <span className={`th-child-status th-status-${child.current_status.toLowerCase()}`}>
                          {child.current_status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="th-quick-actions">
                      <button
                        className="th-action-btn"
                        onClick={() => navigate(`/children/${child.id}`)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      
                      {user?.permissions?.includes('children.update') && (
                        <button
                          className="th-action-btn edit"
                          onClick={() => navigate(`/children/${child.id}/edit`)}
                          title="Edit Child"
                        >
                          <FaEdit />
                        </button>
                      )}
                      
                      {user?.permissions?.includes('children.delete') && (
                        <button
                          className="th-action-btn delete"
                          onClick={() => handleQuickDelete(child.id)}
                          title="Delete Child"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <ChildrenTable
              children={children}
              onSort={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onView={(child) => navigate(`/children/${child.id}`)}
              onEdit={(child) => navigate(`/children/${child.id}/edit`)}
              onDelete={(child) => handleQuickDelete(child.id)}
            />
          )
        ) : (
          <div className="th-children-empty">
            <div className="th-empty-icon">
              <FaChild />
            </div>
            <h3>No Children Found</h3>
            <p>
              {searchQuery || Object.values(filters).some(f => f !== 'all')
                ? 'No children match your current search and filter criteria.'
                : 'No children have been registered yet.'
              }
            </p>
            {user?.permissions?.includes('children.create') && (
              <Button
                variant="primary"
                icon={<FaPlus />}
                onClick={() => navigate('/children/add')}
              >
                Add First Child
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildrenList;