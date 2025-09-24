import React, { useState, useMemo } from 'react';
import { 
  FaSort, 
  FaSortUp, 
  FaSortDown,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaDownload,
  FaPrint,
  FaFilter,
  FaSearch,
  FaColumns,
  FaChevronLeft,
  FaChevronRight,
  FaMale,
  FaFemale,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaStethoscope,
  FaCalendarAlt,
  FaUser,
  FaEllipsisV
} from 'react-icons/fa';
import { format, differenceInYears } from 'date-fns';
import Button from '../UI/Button/Button';
import { NIGERIAN_STATES } from '../../utils/nigerianData';
import './ChildrenTable.css';

const ChildrenTable = ({ 
  children = [], 
  onSort, 
  sortBy, 
  sortOrder,
  onView,
  onEdit,
  onDelete,
  isLoading = false,
  className = ''
}) => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [columnFilters, setColumnFilters] = useState({});
  const [visibleColumns, setVisibleColumns] = useState(new Set([
    'select', 'photo', 'name', 'age', 'gender', 'status', 'education', 'health', 'admission', 'actions'
  ]));
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [searchHighlight, setSearchHighlight] = useState('');

  // Column definitions
  const columns = [
    {
      id: 'select',
      label: '',
      width: '50px',
      sortable: false,
      filterable: false,
      alwaysVisible: true,
      render: (child) => (
        <div className="th-table-checkbox">
          <input
            type="checkbox"
            checked={selectedRows.has(child.id)}
            onChange={() => toggleRowSelection(child.id)}
            className="th-checkbox"
          />
        </div>
      )
    },
    {
      id: 'photo',
      label: 'Photo',
      width: '80px',
      sortable: false,
      filterable: false,
      render: (child) => (
        <div className="th-table-photo">
          {child.photo_url ? (
            <img src={child.photo_url} alt={child.first_name} />
          ) : (
            <div className="th-photo-placeholder">
              <FaUser />
            </div>
          )}
          <div className={`th-status-dot th-status-${getStatusColor(child.current_status)}`}></div>
        </div>
      )
    },
    {
      id: 'child_id',
      label: 'ID',
      width: '100px',
      sortable: true,
      filterable: true,
      render: (child) => (
        <span className="th-child-id-cell">{child.child_id}</span>
      )
    },
    {
      id: 'name',
      label: 'Full Name',
      width: '200px',
      sortable: true,
      filterable: true,
      render: (child) => (
        <div className="th-name-cell">
          <div className="th-full-name">
            {highlightText(`${child.first_name} ${child.middle_name || ''} ${child.last_name}`.trim())}
          </div>
          <div className="th-name-meta">
            {child.preferred_language && (
              <span className="th-language-tag">{child.preferred_language}</span>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'age',
      label: 'Age',
      width: '80px',
      sortable: true,
      filterable: true,
      render: (child) => {
        const age = differenceInYears(new Date(), new Date(child.date_of_birth));
        return (
          <div className="th-age-cell">
            <span className="th-age-value">{age}</span>
            <span className="th-age-unit">years</span>
          </div>
        );
      }
    },
    {
      id: 'gender',
      label: 'Gender',
      width: '100px',
      sortable: true,
      filterable: true,
      filterOptions: ['Male', 'Female'],
      render: (child) => (
        <div className="th-gender-cell">
          {child.gender === 'Male' ? (
            <FaMale className="th-gender-icon th-male" />
          ) : (
            <FaFemale className="th-gender-icon th-female" />
          )}
          <span>{child.gender}</span>
        </div>
      )
    },
    {
      id: 'state_of_origin',
      label: 'Origin',
      width: '120px',
      sortable: true,
      filterable: true,
      filterOptions: NIGERIAN_STATES.map(state => state.label),
      render: (child) => (
        <div className="th-origin-cell">
          <FaMapMarkerAlt className="th-origin-icon" />
          <span>{child.state_of_origin}</span>
        </div>
      )
    },
    {
      id: 'current_status',
      label: 'Status',
      width: '120px',
      sortable: true,
      filterable: true,
      filterOptions: ['Active', 'Exited', 'Transferred', 'Adopted', 'Inactive'],
      render: (child) => (
        <span className={`th-status-badge th-badge-${getStatusColor(child.current_status)}`}>
          {child.current_status}
        </span>
      )
    },
    {
      id: 'education_level',
      label: 'Education',
      width: '130px',
      sortable: true,
      filterable: true,
      render: (child) => (
        <div className="th-education-cell">
          <FaGraduationCap className="th-education-icon" />
          <div className="th-education-info">
            <span className="th-education-level">{child.education_level}</span>
            {child.school_name && (
              <span className="th-school-name">{child.school_name}</span>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'health_status',
      label: 'Health',
      width: '100px',
      sortable: true,
      filterable: true,
      filterOptions: ['Excellent', 'Good', 'Fair', 'Poor'],
      render: (child) => (
        <div className="th-health-cell">
          <FaStethoscope className="th-health-icon" />
          <span className={`th-health-status th-health-${getHealthColor(child.health_status)}`}>
            {child.health_status}
          </span>
        </div>
      )
    },
    {
      id: 'admission_date',
      label: 'Admission',
      width: '120px',
      sortable: true,
      filterable: false,
      render: (child) => (
        <div className="th-date-cell">
          <FaCalendarAlt className="th-date-icon" />
          <span>{format(new Date(child.admission_date), 'MMM dd, yyyy')}</span>
        </div>
      )
    },
    {
      id: 'case_worker',
      label: 'Case Worker',
      width: '150px',
      sortable: true,
      filterable: true,
      render: (child) => (
        <div className="th-worker-cell">
          <span className="th-worker-name">{child.case_worker}</span>
        </div>
      )
    },
    {
      id: 'genotype',
      label: 'Genotype',
      width: '80px',
      sortable: true,
      filterable: true,
      filterOptions: ['AA', 'AS', 'SS', 'AC', 'SC', 'CC', 'Unknown'],
      render: (child) => (
        <span className={`th-genotype-badge ${getGenotypeColor(child.genotype)}`}>
          {child.genotype || 'Unknown'}
        </span>
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      width: '120px',
      sortable: false,
      filterable: false,
      alwaysVisible: true,
      render: (child) => (
        <div className="th-actions-cell">
          <button
            className="th-action-btn th-action-view"
            onClick={() => onView(child)}
            title="View Profile"
          >
            <FaEye />
          </button>
          <button
            className="th-action-btn th-action-edit"
            onClick={() => onEdit(child)}
            title="Edit Child"
          >
            <FaEdit />
          </button>
          <div className="th-action-dropdown">
            <button className="th-action-btn th-action-more">
              <FaEllipsisV />
            </button>
            <div className="th-dropdown-menu">
              <button onClick={() => handleAction('export', child)}>
                <FaDownload /> Export
              </button>
              <button onClick={() => handleAction('print', child)}>
                <FaPrint /> Print
              </button>
              {onDelete && (
                <button 
                  onClick={() => onDelete(child)}
                  className="th-action-danger"
                >
                  <FaTrash /> Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )
    }
  ];

  // Helper functions
  const getStatusColor = (status) => {
    const statusColors = {
      'Active': 'success',
      'Exited': 'muted',
      'Transferred': 'info',
      'Adopted': 'primary',
      'Inactive': 'warning'
    };
    return statusColors[status] || 'muted';
  };

  const getHealthColor = (status) => {
    const healthColors = {
      'Excellent': 'success',
      'Good': 'primary',
      'Fair': 'warning',
      'Poor': 'error'
    };
    return healthColors[status] || 'muted';
  };

  const getGenotypeColor = (genotype) => {
    const genotypeColors = {
      'AA': 'th-genotype-normal',
      'AS': 'th-genotype-carrier',
      'AC': 'th-genotype-carrier',
      'SS': 'th-genotype-disease',
      'SC': 'th-genotype-disease',
      'CC': 'th-genotype-rare'
    };
    return genotypeColors[genotype] || 'th-genotype-unknown';
  };

  const highlightText = (text) => {
    if (!searchHighlight || !text) return text;
    
    const regex = new RegExp(`(${searchHighlight})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      part.toLowerCase() === searchHighlight.toLowerCase() ? (
        <mark key={index} className="th-search-highlight">{part}</mark>
      ) : part
    );
  };

  // Row selection
  const toggleRowSelection = (id) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRows(newSelection);
  };

  const selectAllRows = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(child => child.id)));
    }
  };

  // Sorting
  const handleSort = (columnId) => {
    if (!columns.find(col => col.id === columnId)?.sortable) return;
    onSort(columnId);
  };

  const getSortIcon = (columnId) => {
    if (sortBy !== columnId) return <FaSort className="th-sort-icon" />;
    return sortOrder === 'asc' ? 
      <FaSortUp className="th-sort-icon th-sort-active" /> : 
      <FaSortDown className="th-sort-icon th-sort-active" />;
  };

  // Filtering
  const handleColumnFilter = (columnId, value) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnId]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Apply filters
  const filteredData = useMemo(() => {
    return children.filter(child => {
      return Object.entries(columnFilters).every(([columnId, filterValue]) => {
        if (!filterValue) return true;
        
        const column = columns.find(col => col.id === columnId);
        if (!column) return true;
        
        let cellValue = child[columnId];
        
        // Handle special cases
        if (columnId === 'name') {
          cellValue = `${child.first_name} ${child.middle_name || ''} ${child.last_name}`.trim();
        } else if (columnId === 'age') {
          cellValue = differenceInYears(new Date(), new Date(child.date_of_birth)).toString();
        }
        
        if (typeof cellValue === 'string') {
          return cellValue.toLowerCase().includes(filterValue.toLowerCase());
        }
        
        return cellValue === filterValue;
      });
    });
  }, [children, columnFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // Column visibility
  const visibleColumnsList = columns.filter(col => 
    visibleColumns.has(col.id) || col.alwaysVisible
  );

  const toggleColumnVisibility = (columnId) => {
    const newVisible = new Set(visibleColumns);
    if (newVisible.has(columnId)) {
      newVisible.delete(columnId);
    } else {
      newVisible.add(columnId);
    }
    setVisibleColumns(newVisible);
  };

  // Bulk actions
  const handleBulkAction = (action) => {
    const selectedChildren = children.filter(child => selectedRows.has(child.id));
    console.log(`Bulk ${action} for:`, selectedChildren);
    
    switch (action) {
      case 'export':
        // Handle bulk export
        break;
      case 'print':
        // Handle bulk print
        break;
      case 'delete':
        // Handle bulk delete
        break;
      default:
        break;
    }
  };

  const handleAction = (action, child) => {
    console.log(`${action} for child:`, child);
    // Implement action handlers
  };

  if (isLoading) {
    return (
      <div className="th-table-loading">
        <div className="th-loading-spinner"></div>
        <p>Loading children data...</p>
      </div>
    );
  }

  return (
    <div className={`th-children-table-container ${className}`}>
      {/* Table Controls */}
      <div className="th-table-controls">
        <div className="th-table-info">
          <span className="th-table-count">
            {selectedRows.size > 0 ? (
              <>
                {selectedRows.size} of {filteredData.length} selected
              </>
            ) : (
              <>
                Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length}
              </>
            )}
          </span>
        </div>

        <div className="th-table-actions">
          {selectedRows.size > 0 && (
            <div className="th-bulk-actions">
              <Button
                variant="glass"
                size="sm"
                icon={<FaDownload />}
                onClick={() => handleBulkAction('export')}
              >
                Export Selected
              </Button>
              <Button
                variant="glass"
                size="sm"
                icon={<FaPrint />}
                onClick={() => handleBulkAction('print')}
              >
                Print Selected
              </Button>
            </div>
          )}

          <div className="th-table-settings">
            <button
              className="th-table-setting-btn"
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              title="Column Settings"
            >
              <FaColumns />
            </button>
            
            {showColumnSelector && (
              <div className="th-column-selector">
                <h4>Visible Columns</h4>
                {columns.filter(col => !col.alwaysVisible).map(column => (
                  <label key={column.id} className="th-column-option">
                    <input
                      type="checkbox"
                      checked={visibleColumns.has(column.id)}
                      onChange={() => toggleColumnVisibility(column.id)}
                    />
                    <span>{column.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="th-table-wrapper">
        <table className="th-children-table">
          <thead className="th-table-head">
            <tr>
              <th className="th-checkbox-header">
                <input
                  type="checkbox"
                  checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                  onChange={selectAllRows}
                  className="th-checkbox"
                />
              </th>
              {visibleColumnsList.filter(col => col.id !== 'select').map(column => (
                <th
                  key={column.id}
                  className={`th-table-header ${column.sortable ? 'th-sortable' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="th-header-content">
                    <span className="th-header-label">{column.label}</span>
                    {column.sortable && getSortIcon(column.id)}
                  </div>
                  
                  {column.filterable && (
                    <div className="th-column-filter">
                      {column.filterOptions ? (
                        <select
                          value={columnFilters[column.id] || ''}
                          onChange={(e) => handleColumnFilter(column.id, e.target.value)}
                          className="th-filter-select"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="">All</option>
                          {column.filterOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={columnFilters[column.id] || ''}
                          onChange={(e) => handleColumnFilter(column.id, e.target.value)}
                          className="th-filter-input"
                          placeholder="Filter..."
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="th-table-body">
            {paginatedData.map((child, index) => (
              <tr 
                key={child.id} 
                className={`th-table-row ${selectedRows.has(child.id) ? 'th-row-selected' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {visibleColumnsList.map(column => (
                  <td key={column.id} className="th-table-cell">
                    {column.render(child)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="th-table-pagination">
          <div className="th-pagination-info">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="th-page-size-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="th-pagination-controls">
            <button
              className="th-pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>
            
            <div className="th-pagination-pages">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={page}
                    className={`th-pagination-page ${currentPage === page ? 'th-page-active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              className="th-pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>

          <div className="th-pagination-summary">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}

      {/* Empty State */}
      {paginatedData.length === 0 && !isLoading && (
        <div className="th-table-empty">
          <div className="th-empty-icon">
            <FaSearch />
          </div>
          <h3>No Children Found</h3>
          <p>
            {Object.keys(columnFilters).length > 0
              ? 'No children match your current filters.'
              : 'No children data available.'
            }
          </p>
          {Object.keys(columnFilters).length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                setColumnFilters({});
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChildrenTable;