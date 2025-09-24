// src/components/Common/FilterDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaFilter, FaChevronDown, FaCheck, FaTimes } from 'react-icons/fa';
import './FilterDropdown.css';

const FilterDropdown = ({
  options = [],
  value = [],
  onChange,
  placeholder = 'Filter by...',
  multiSelect = true,
  searchable = false,
  disabled = false,
  size = 'md',
  variant = 'default',
  className = '',
  renderOption,
  renderValue,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search term
  const filteredOptions = searchable && searchTerm
    ? options.filter(option => {
        const label = getOptionLabel(option).toLowerCase();
        return label.includes(searchTerm.toLowerCase());
      })
    : options;

  const getOptionValue = (option) => {
    if (typeof option === 'string') return option;
    return option.value || option.id || option;
  };

  const getOptionLabel = (option) => {
    if (typeof option === 'string') return option;
    return option.label || option.name || option.value || String(option);
  };

  const isSelected = (option) => {
    const optionValue = getOptionValue(option);
    if (multiSelect) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  const handleOptionClick = (option) => {
    const optionValue = getOptionValue(option);

    if (multiSelect) {
      const currentValue = Array.isArray(value) ? value : [];
      const newValue = isSelected(option)
        ? currentValue.filter(v => v !== optionValue)
        : [...currentValue, optionValue];
      
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    onChange(multiSelect ? [] : '');
  };

  const getDisplayValue = () => {
    if (multiSelect) {
      const selectedCount = Array.isArray(value) ? value.length : 0;
      if (selectedCount === 0) return placeholder;
      if (selectedCount === 1) {
        const selectedOption = options.find(opt => getOptionValue(opt) === value[0]);
        return selectedOption ? getOptionLabel(selectedOption) : value[0];
      }
      return `${selectedCount} selected`;
    } else {
      if (!value) return placeholder;
      const selectedOption = options.find(opt => getOptionValue(opt) === value);
      return selectedOption ? getOptionLabel(selectedOption) : value;
    }
  };

  const hasSelection = multiSelect 
    ? Array.isArray(value) && value.length > 0
    : Boolean(value);

  return (
    <div 
      ref={dropdownRef}
      className={`th-filter-dropdown th-filter-${size} th-filter-${variant} ${className} ${isOpen ? 'open' : ''}`}
      {...props}
    >
      <div
        className={`th-filter-trigger ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="th-filter-icon">
          <FaFilter />
        </div>
        
        <div className="th-filter-value">
          {renderValue ? renderValue(value, getDisplayValue()) : getDisplayValue()}
        </div>
        
        <div className="th-filter-actions">
          {hasSelection && (
            <button
              type="button"
              className="th-filter-clear"
              onClick={handleClearAll}
              aria-label="Clear selection"
            >
              <FaTimes />
            </button>
          )}
          <div className={`th-filter-chevron ${isOpen ? 'open' : ''}`}>
            <FaChevronDown />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="th-filter-dropdown-menu">
          {searchable && (
            <div className="th-filter-search">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search options..."
                className="th-filter-search-input"
                autoFocus
              />
            </div>
          )}

          <div className="th-filter-options">
            {filteredOptions.length === 0 ? (
              <div className="th-filter-no-options">
                {searchTerm ? 'No matching options' : 'No options available'}
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const optionValue = getOptionValue(option);
                const optionLabel = getOptionLabel(option);
                const selected = isSelected(option);

                return (
                  <div
                    key={`${optionValue}-${index}`}
                    className={`th-filter-option ${selected ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(option)}
                  >
                    {multiSelect && (
                      <div className={`th-filter-checkbox ${selected ? 'checked' : ''}`}>
                        {selected && <FaCheck />}
                      </div>
                    )}
                    
                    <div className="th-filter-option-content">
                      {renderOption ? renderOption(option, selected) : (
                        <>
                          <span className="th-filter-option-label">{optionLabel}</span>
                          {typeof option === 'object' && option.description && (
                            <span className="th-filter-option-description">
                              {option.description}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {multiSelect && hasSelection && (
            <div className="th-filter-footer">
              <button
                type="button"
                className="th-filter-clear-all"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;