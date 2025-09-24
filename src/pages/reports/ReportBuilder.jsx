// src/pages/reports/ReportBuilder.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaEye,
  FaDownload,
  FaSave,
  FaCog,
  FaFilter,
  FaChartBar,
  FaArrowUp,
  FaChartPie,
  FaTable,
  FaCalendarAlt,
  FaChild,
  FaUsers,
  FaUserMd,
  FaGraduationCap,
  FaMoneyBillAlt,
  FaClipboardList,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaTransgender,
  FaHome,
  FaGraduationCap as FaEducation,
  FaHeartbeat,
  FaFileAlt,
  FaGripVertical,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaPlay,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Button from '../../components/UI/Button/Button';
import { NIGERIAN_STATES } from '../../utils/nigerianData';
import './ReportBuilder.css';

const ReportBuilder = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [reportConfig, setReportConfig] = useState({
    name: '',
    description: '',
    category: 'children',
    output_format: 'pdf',
    chart_type: 'table',
    selected_fields: [],
    filters: [],
    grouping: null,
    sorting: [],
    scheduling: {
      enabled: false,
      frequency: 'monthly',
      recipients: []
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Report name and category' },
    { id: 2, title: 'Data Source', description: 'Select fields and data' },
    { id: 3, title: 'Filters', description: 'Apply data filters' },
    { id: 4, title: 'Visualization', description: 'Choose chart type' },
    { id: 5, title: 'Schedule', description: 'Automated generation' },
    { id: 6, title: 'Preview', description: 'Review and generate' }
  ];

  const dataCategories = {
    children: {
      label: 'Children Data',
      icon: FaChild,
      description: 'Information about children in care',
      fields: {
        basic: {
          label: 'Basic Information',
          fields: [
            { id: 'child_id', label: 'Child ID', type: 'text' },
            { id: 'full_name', label: 'Full Name', type: 'text' },
            { id: 'date_of_birth', label: 'Date of Birth', type: 'date' },
            { id: 'age', label: 'Age', type: 'number' },
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
            { id: 'admission_date', label: 'Admission Date', type: 'date' },
            { id: 'current_status', label: 'Current Status', type: 'select', options: ['Active', 'Exited', 'Transferred'] }
          ]
        },
        location: {
          label: 'Location Information',
          fields: [
            { id: 'state_of_origin', label: 'State of Origin', type: 'select', options: NIGERIAN_STATES },
            { id: 'lga', label: 'Local Government Area', type: 'text' },
            { id: 'room_assignment', label: 'Room Assignment', type: 'text' },
            { id: 'arrival_circumstances', label: 'Arrival Circumstances', type: 'text' }
          ]
        },
        health: {
          label: 'Health Information',
          fields: [
            { id: 'blood_type', label: 'Blood Type', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
            { id: 'genotype', label: 'Genotype', type: 'select', options: ['AA', 'AS', 'SS', 'AC', 'SC'] },
            { id: 'height_cm', label: 'Height (cm)', type: 'number' },
            { id: 'weight_kg', label: 'Weight (kg)', type: 'number' },
            { id: 'health_status', label: 'Health Status', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Poor'] },
            { id: 'allergies', label: 'Allergies', type: 'text' },
            { id: 'medical_conditions', label: 'Medical Conditions', type: 'text' }
          ]
        },
        education: {
          label: 'Education Information',
          fields: [
            { id: 'education_level', label: 'Education Level', type: 'select', options: ['Pre-Primary', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JSS 1', 'JSS 2', 'JSS 3'] },
            { id: 'school_name', label: 'School Name', type: 'text' },
            { id: 'academic_performance', label: 'Academic Performance', type: 'select', options: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'] },
            { id: 'ambition', label: 'Career Ambition', type: 'text' }
          ]
        }
      }
    },
    staff: {
      label: 'Staff Data',
      icon: FaUsers,
      description: 'Staff member information and performance',
      fields: {
        basic: {
          label: 'Basic Information',
          fields: [
            { id: 'employee_id', label: 'Employee ID', type: 'text' },
            { id: 'full_name', label: 'Full Name', type: 'text' },
            { id: 'position', label: 'Position', type: 'text' },
            { id: 'department', label: 'Department', type: 'select', options: ['Administration', 'Childcare', 'Medical', 'Education', 'Security'] },
            { id: 'hire_date', label: 'Hire Date', type: 'date' },
            { id: 'employment_status', label: 'Employment Status', type: 'select', options: ['Active', 'Probation', 'On Leave', 'Terminated'] }
          ]
        },
        performance: {
          label: 'Performance Metrics',
          fields: [
            { id: 'performance_rating', label: 'Performance Rating', type: 'select', options: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'] },
            { id: 'children_assigned', label: 'Children Assigned', type: 'number' },
            { id: 'cases_handled', label: 'Cases Handled', type: 'number' },
            { id: 'training_completed', label: 'Training Completed', type: 'number' }
          ]
        }
      }
    },
    medical: {
      label: 'Medical Data',
      icon: FaUserMd,
      description: 'Health records and medical information',
      fields: {
        records: {
          label: 'Medical Records',
          fields: [
            { id: 'checkup_date', label: 'Checkup Date', type: 'date' },
            { id: 'doctor_name', label: 'Doctor Name', type: 'text' },
            { id: 'diagnosis', label: 'Diagnosis', type: 'text' },
            { id: 'treatment', label: 'Treatment', type: 'text' },
            { id: 'next_appointment', label: 'Next Appointment', type: 'date' }
          ]
        },
        vaccinations: {
          label: 'Vaccination Records',
          fields: [
            { id: 'vaccine_name', label: 'Vaccine Name', type: 'text' },
            { id: 'vaccination_date', label: 'Vaccination Date', type: 'date' },
            { id: 'due_date', label: 'Due Date', type: 'date' },
            { id: 'vaccination_status', label: 'Status', type: 'select', options: ['Completed', 'Due', 'Overdue'] }
          ]
        }
      }
    },
    financial: {
      label: 'Financial Data',
      icon: FaMoneyBillAlt,
      description: 'Budget and financial information',
      fields: {
        budget: {
          label: 'Budget Information',
          fields: [
            { id: 'budget_category', label: 'Budget Category', type: 'select', options: ['Childcare', 'Medical', 'Education', 'Administration', 'Maintenance'] },
            { id: 'allocated_amount', label: 'Allocated Amount', type: 'number' },
            { id: 'spent_amount', label: 'Spent Amount', type: 'number' },
            { id: 'remaining_amount', label: 'Remaining Amount', type: 'number' },
            { id: 'expense_date', label: 'Expense Date', type: 'date' }
          ]
        }
      }
    }
  };

  const chartTypes = [
    { id: 'table', label: 'Table', icon: FaTable, description: 'Tabular data display' },
    { id: 'bar', label: 'Bar Chart', icon: FaChartBar, description: 'Compare values across categories' },
    { id: 'line', label: 'Line Chart', icon: FaArrowUp, description: 'Show trends over time' },
    { id: 'pie', label: 'Pie Chart', icon: FaChartPie, description: 'Show proportions and percentages' },
    { id: 'doughnut', label: 'Doughnut Chart', icon: FaChartPie, description: 'Alternative pie chart style' }
  ];

  const filterOperators = {
    text: ['equals', 'contains', 'starts_with', 'ends_with', 'not_equals'],
    number: ['equals', 'greater_than', 'less_than', 'between', 'not_equals'],
    date: ['equals', 'after', 'before', 'between', 'in_last_days'],
    select: ['equals', 'in', 'not_equals', 'not_in']
  };

  const addField = (field, categoryId, groupId) => {
    const fieldWithMetadata = {
      ...field,
      category: categoryId,
      group: groupId,
      id: `${categoryId}_${groupId}_${field.id}_${Date.now()}`
    };
    
    setReportConfig(prev => ({
      ...prev,
      selected_fields: [...prev.selected_fields, fieldWithMetadata]
    }));
  };

  const removeField = (fieldIndex) => {
    setReportConfig(prev => ({
      ...prev,
      selected_fields: prev.selected_fields.filter((_, index) => index !== fieldIndex)
    }));
  };

  const addFilter = () => {
    if (reportConfig.selected_fields.length === 0) return;
    
    const newFilter = {
      id: Date.now(),
      field: reportConfig.selected_fields[0],
      operator: 'equals',
      value: '',
      logic: 'AND'
    };
    
    setReportConfig(prev => ({
      ...prev,
      filters: [...prev.filters, newFilter]
    }));
  };

  const updateFilter = (filterId, updates) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.map(filter => 
        filter.id === filterId ? { ...filter, ...updates } : filter
      )
    }));
  };

  const removeFilter = (filterId) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.filter(filter => filter.id !== filterId)
    }));
  };

  const generatePreview = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call for preview data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock preview data based on selected fields
      const mockData = generateMockData();
      setPreviewData(mockData);
      
    } catch (error) {
      console.error('Preview generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockData = () => {
    const fields = reportConfig.selected_fields;
    const mockRows = [];
    
    for (let i = 0; i < 10; i++) {
      const row = {};
      fields.forEach(field => {
        switch (field.type) {
          case 'text':
            row[field.id] = `Sample ${field.label} ${i + 1}`;
            break;
          case 'number':
            row[field.id] = Math.floor(Math.random() * 100) + 1;
            break;
          case 'date':
            row[field.id] = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0];
            break;
          case 'select':
            row[field.id] = field.options[Math.floor(Math.random() * field.options.length)];
            break;
          default:
            row[field.id] = 'Sample Data';
        }
      });
      mockRows.push(row);
    }
    
    return mockRows;
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(reportConfig.selected_fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setReportConfig(prev => ({
      ...prev,
      selected_fields: items
    }));
  };

  const saveReport = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call to save report
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Report saved:', reportConfig);
      
      navigate('/reports', {
        state: {
          message: 'Report created successfully!',
          type: 'success'
        }
      });
      
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="th-report-builder">
      {/* Header */}
      <div className="th-builder-header">
        <div className="th-header-navigation">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/reports')}
            icon={FaArrowLeft}
          >
            Back to Reports
          </Button>
        </div>
        
        <div className="th-header-content">
          <h1 className="th-page-title">Custom Report Builder</h1>
          <p className="th-page-subtitle">Create customized reports with your specific data requirements</p>
        </div>
      </div>

      {/* Steps Progress */}
      <div className="th-steps-container">
        <div className="th-steps-progress">
          {steps.map((step, index) => (
            <div key={step.id} className="th-step-wrapper">
              <div 
                className={`th-step-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
                onClick={() => setCurrentStep(step.id)}
              >
                <div className="th-step-number">
                  {currentStep > step.id ? <FaCheckCircle /> : step.id}
                </div>
                <div className="th-step-content">
                  <h3 className="th-step-title">{step.title}</h3>
                  <p className="th-step-description">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`th-step-connector ${currentStep > step.id ? 'completed' : ''}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Builder Content */}
      <div className="th-builder-content">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="th-builder-step">
            <div className="th-step-header">
              <h2 className="th-step-title">Basic Report Information</h2>
              <p className="th-step-description">Provide basic details about your report</p>
            </div>
            
            <div className="th-step-body">
              <div className="th-form-grid">
                <div className="th-form-group">
                  <label className="th-form-label">Report Name *</label>
                  <input
                    type="text"
                    value={reportConfig.name}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                    className="th-form-input"
                    placeholder="Enter report name"
                  />
                </div>
                
                <div className="th-form-group">
                  <label className="th-form-label">Category *</label>
                  <select
                    value={reportConfig.category}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, category: e.target.value }))}
                    className="th-form-select"
                  >
                    {Object.entries(dataCategories).map(([key, category]) => (
                      <option key={key} value={key}>{category.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="th-form-group th-form-group-full">
                  <label className="th-form-label">Description</label>
                  <textarea
                    value={reportConfig.description}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                    className="th-form-textarea"
                    rows="3"
                    placeholder="Describe what this report will show"
                  />
                </div>
                
                <div className="th-form-group">
                  <label className="th-form-label">Output Format</label>
                  <select
                    value={reportConfig.output_format}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, output_format: e.target.value }))}
                    className="th-form-select"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="excel">Excel Spreadsheet</option>
                    <option value="csv">CSV File</option>
                    <option value="html">HTML Report</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Data Source */}
        {currentStep === 2 && (
          <div className="th-builder-step">
            <div className="th-step-header">
              <h2 className="th-step-title">Select Data Fields</h2>
              <p className="th-step-description">Choose which data fields to include in your report</p>
            </div>
            
            <div className="th-step-body">
              <div className="th-data-source-grid">
                {/* Available Fields */}
                <div className="th-available-fields">
                  <h3 className="th-section-title">Available Fields</h3>
                  <div className="th-fields-container">
                    {Object.entries(dataCategories[reportConfig.category].fields).map(([groupKey, group]) => (
                      <div key={groupKey} className="th-field-group">
                        <h4 className="th-group-title">{group.label}</h4>
                        <div className="th-fields-list">
                          {group.fields.map(field => (
                            <div key={field.id} className="th-field-item">
                              <div className="th-field-info">
                                <span className="th-field-label">{field.label}</span>
                                <span className="th-field-type">{field.type}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addField(field, reportConfig.category, groupKey)}
                                icon={FaPlus}
                                disabled={reportConfig.selected_fields.some(f => f.label === field.label)}
                              >
                                Add
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Fields */}
                <div className="th-selected-fields">
                  <h3 className="th-section-title">
                    Selected Fields ({reportConfig.selected_fields.length})
                  </h3>
                  
                  {reportConfig.selected_fields.length === 0 ? (
                    <div className="th-empty-state">
                      <FaInfoCircle className="th-empty-icon" />
                      <p>No fields selected yet. Add fields from the left panel.</p>
                    </div>
                  ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="selected-fields">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="th-selected-fields-list"
                          >
                            {reportConfig.selected_fields.map((field, index) => (
                              <Draggable key={field.id} draggableId={field.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="th-selected-field-item"
                                  >
                                    <div
                                      {...provided.dragHandleProps}
                                      className="th-drag-handle"
                                    >
                                      <FaGripVertical />
                                    </div>
                                    <div className="th-field-content">
                                      <span className="th-field-label">{field.label}</span>
                                      <span className="th-field-meta">
                                        {field.group} • {field.type}
                                      </span>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeField(index)}
                                      icon={FaTrash}
                                      className="th-remove-btn"
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Filters */}
        {currentStep === 3 && (
          <div className="th-builder-step">
            <div className="th-step-header">
              <h2 className="th-step-title">Apply Data Filters</h2>
              <p className="th-step-description">Filter the data to show only what you need</p>
            </div>
            
            <div className="th-step-body">
              <div className="th-filters-section">
                <div className="th-filters-header">
                  <h3 className="th-section-title">Filters ({reportConfig.filters.length})</h3>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={addFilter}
                    icon={FaPlus}
                    disabled={reportConfig.selected_fields.length === 0}
                  >
                    Add Filter
                  </Button>
                </div>

                {reportConfig.filters.length === 0 ? (
                  <div className="th-empty-state">
                    <FaFilter className="th-empty-icon" />
                    <p>No filters applied. All data will be included in the report.</p>
                    {reportConfig.selected_fields.length === 0 && (
                      <small>Add data fields first to enable filtering.</small>
                    )}
                  </div>
                ) : (
                  <div className="th-filters-list">
                    {reportConfig.filters.map((filter, index) => (
                      <div key={filter.id} className="th-filter-item">
                        <div className="th-filter-header">
                          <span className="th-filter-logic">
                            {index === 0 ? 'WHERE' : filter.logic}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFilter(filter.id)}
                            icon={FaTrash}
                            className="th-remove-btn"
                          >
                            Remove
                          </Button>
                        </div>
                        
                        <div className="th-filter-controls">
                          <select
                            value={filter.field.id}
                            onChange={(e) => {
                              const selectedField = reportConfig.selected_fields.find(f => f.id === e.target.value);
                              updateFilter(filter.id, { field: selectedField });
                            }}
                            className="th-filter-select field"
                          >
                            {reportConfig.selected_fields.map(field => (
                              <option key={field.id} value={field.id}>{field.label}</option>
                            ))}
                          </select>
                          
                          <select
                            value={filter.operator}
                            onChange={(e) => updateFilter(filter.id, { operator: e.target.value })}
                            className="th-filter-select operator"
                          >
                            {filterOperators[filter.field.type]?.map(op => (
                              <option key={op} value={op}>
                                {op.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </option>
                            ))}
                          </select>
                          
                          {filter.field.type === 'select' ? (
                            <select
                              value={filter.value}
                              onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                              className="th-filter-select value"
                            >
                              <option value="">Select value</option>
                              {filter.field.options?.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={filter.field.type === 'number' ? 'number' : filter.field.type === 'date' ? 'date' : 'text'}
                              value={filter.value}
                              onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                              className="th-filter-input"
                              placeholder="Enter value"
                            />
                          )}
                          
                          {index > 0 && (
                            <select
                              value={filter.logic}
                              onChange={(e) => updateFilter(filter.id, { logic: e.target.value })}
                              className="th-filter-select logic"
                            >
                              <option value="AND">AND</option>
                              <option value="OR">OR</option>
                            </select>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Visualization */}
        {currentStep === 4 && (
          <div className="th-builder-step">
            <div className="th-step-header">
              <h2 className="th-step-title">Choose Visualization</h2>
              <p className="th-step-description">Select how to display your data</p>
            </div>
            
            <div className="th-step-body">
              <div className="th-chart-types-grid">
                {chartTypes.map(chartType => {
                  const Icon = chartType.icon;
                  return (
                    <div
                      key={chartType.id}
                      className={`th-chart-type-card ${reportConfig.chart_type === chartType.id ? 'selected' : ''}`}
                      onClick={() => setReportConfig(prev => ({ ...prev, chart_type: chartType.id }))}
                    >
                      <div className="th-chart-icon">
                        <Icon />
                      </div>
                      <div className="th-chart-info">
                        <h4 className="th-chart-name">{chartType.label}</h4>
                        <p className="th-chart-description">{chartType.description}</p>
                      </div>
                      {reportConfig.chart_type === chartType.id && (
                        <div className="th-selected-indicator">
                          <FaCheckCircle />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {reportConfig.chart_type !== 'table' && (
                <div className="th-chart-config">
                  <h3 className="th-section-title">Chart Configuration</h3>
                  <div className="th-config-grid">
                    <div className="th-form-group">
                      <label className="th-form-label">Group By</label>
                      <select
                        value={reportConfig.grouping || ''}
                        onChange={(e) => setReportConfig(prev => ({ ...prev, grouping: e.target.value || null }))}
                        className="th-form-select"
                      >
                        <option value="">No grouping</option>
                        {reportConfig.selected_fields
                          .filter(field => field.type === 'select' || field.type === 'text')
                          .map(field => (
                            <option key={field.id} value={field.id}>{field.label}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Schedule */}
        {currentStep === 5 && (
          <div className="th-builder-step">
            <div className="th-step-header">
              <h2 className="th-step-title">Schedule Report</h2>
              <p className="th-step-description">Set up automated report generation (optional)</p>
            </div>
            
            <div className="th-step-body">
              <div className="th-scheduling-section">
                <div className="th-schedule-toggle">
                  <label className="th-toggle-label">
                    <input
                      type="checkbox"
                      checked={reportConfig.scheduling.enabled}
                      onChange={(e) => setReportConfig(prev => ({
                        ...prev,
                        scheduling: { ...prev.scheduling, enabled: e.target.checked }
                      }))}
                      className="th-toggle-input"
                    />
                    <span className="th-toggle-slider"></span>
                    Enable automatic report generation
                  </label>
                </div>

                {reportConfig.scheduling.enabled && (
                  <div className="th-schedule-config">
                    <div className="th-form-grid">
                      <div className="th-form-group">
                        <label className="th-form-label">Frequency</label>
                        <select
                          value={reportConfig.scheduling.frequency}
                          onChange={(e) => setReportConfig(prev => ({
                            ...prev,
                            scheduling: { ...prev.scheduling, frequency: e.target.value }
                          }))}
                          className="th-form-select"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                      
                      <div className="th-form-group">
                        <label className="th-form-label">Email Recipients</label>
                        <input
                          type="email"
                          placeholder="Enter email addresses (comma separated)"
                          className="th-form-input"
                          onChange={(e) => {
                            const emails = e.target.value.split(',').map(email => email.trim()).filter(email => email);
                            setReportConfig(prev => ({
                              ...prev,
                              scheduling: { ...prev.scheduling, recipients: emails }
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Preview */}
        {currentStep === 6 && (
          <div className="th-builder-step">
            <div className="th-step-header">
              <h2 className="th-step-title">Preview & Generate</h2>
              <p className="th-step-description">Review your report configuration and generate</p>
            </div>
            
            <div className="th-step-body">
              {/* Report Summary */}
              <div className="th-report-summary">
                <h3 className="th-section-title">Report Summary</h3>
                <div className="th-summary-grid">
                  <div className="th-summary-item">
                    <span className="th-summary-label">Report Name:</span>
                    <span className="th-summary-value">{reportConfig.name || 'Untitled Report'}</span>
                  </div>
                  <div className="th-summary-item">
                    <span className="th-summary-label">Category:</span>
                    <span className="th-summary-value">{dataCategories[reportConfig.category].label}</span>
                  </div>
                  <div className="th-summary-item">
                    <span className="th-summary-label">Fields:</span>
                    <span className="th-summary-value">{reportConfig.selected_fields.length} selected</span>
                  </div>
                  <div className="th-summary-item">
                    <span className="th-summary-label">Filters:</span>
                    <span className="th-summary-value">{reportConfig.filters.length} applied</span>
                  </div>
                  <div className="th-summary-item">
                    <span className="th-summary-label">Output:</span>
                    <span className="th-summary-value">{reportConfig.output_format.toUpperCase()}</span>
                  </div>
                  <div className="th-summary-item">
                    <span className="th-summary-label">Visualization:</span>
                    <span className="th-summary-value">{chartTypes.find(ct => ct.id === reportConfig.chart_type)?.label}</span>
                  </div>
                </div>
              </div>

              {/* Preview Actions */}
                <div className="th-preview-actions">
                <Button
                  variant="primary"
                  icon={FaEye}
                  disabled={isGenerating || reportConfig.selected_fields.length === 0}
                  onClick={generatePreview}
                >
                  {isGenerating ? 'Generating...' : 'Preview Report'}
                </Button>
                
                <Button
                  variant="outline"
                  icon={FaDownload}
                  disabled={isGenerating || reportConfig.selected_fields.length === 0}
                  onClick={saveReport}
                >
                  Generate & Download
                </Button>
              </div>

              {/* Preview Data */}
              {previewData && (
                <div className="th-report-preview">
                  <h3 className="th-section-title">Report Preview</h3>
                  
                  {reportConfig.chart_type === 'table' ? (
                    <div className="th-preview-table-container">
                      <table className="th-preview-table">
                        <thead>
                          <tr>
                            {reportConfig.selected_fields.map(field => (
                              <th key={field.id}>{field.label}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((row, index) => (
                            <tr key={index}>
                              {reportConfig.selected_fields.map(field => (
                                <td key={field.id}>{row[field.id]}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="th-preview-chart">
                      <div className="th-chart-placeholder">
                        <FaChartBar className="th-chart-icon" />
                        <p>Chart visualization will appear here</p>
                        <small>Sample data: {previewData.length} records</small>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Validation Warnings */}
              {reportConfig.selected_fields.length === 0 && (
                <div className="th-validation-warning">
                  <FaExclamationTriangle className="th-warning-icon" />
                  <div>
                    <h4>No Fields Selected</h4>
                    <p>Please go back to Step 2 and select at least one field for your report.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="th-builder-footer">
        <div className="th-footer-content">
          <div className="th-footer-left">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                icon={FaChevronDown}
              >
                Previous
              </Button>
            )}
          </div>
          
          <div className="th-footer-center">
            <span className="th-step-indicator">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          
          <div className="th-footer-right">
            {currentStep < steps.length ? (
              <Button
                variant="primary"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  (currentStep === 1 && !reportConfig.name) ||
                  (currentStep === 2 && reportConfig.selected_fields.length === 0)
                }
              >
                Next
                <FaChevronUp className="th-btn-icon-right" />
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={saveReport}
                disabled={isGenerating || reportConfig.selected_fields.length === 0}
                icon={FaSave}
              >
                {isGenerating ? 'Saving...' : 'Save Report'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="th-loading-overlay">
          <div className="th-loading-content">
            <div className="th-spinner">
              <FaClock className="th-spinner-icon" />
            </div>
            <h3>Generating Report...</h3>
            <p>Please wait while we process your request</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportBuilder;