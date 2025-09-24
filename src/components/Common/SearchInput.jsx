// src/components/Common/SearchInput.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';
import { debounce } from '../../utils/helpers';
import './SearchInput.css';

const SearchInput = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search...',
  size = 'md',
  loading = false,
  suggestions = [],
  showSuggestions = false,
  onSuggestionSelect,
  clearable = true,
  debounceMs = 300,
  className = '',
  autoFocus = false,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debouncedSearch = useRef(null);

  // Initialize debounced search function
  useEffect(() => {
    debouncedSearch.current = debounce((searchValue) => {
      if (onSearch) {
        onSearch(searchValue);
      }
    }, debounceMs);
  }, [onSearch, debounceMs]);

  // Sync with external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedIndex(-1);
    
    if (onChange) {
      onChange(newValue);
    }
    
    if (debouncedSearch.current) {
      debouncedSearch.current(newValue);
    }
    
    if (showSuggestions && newValue.trim()) {
      setShowSuggestionsList(true);
    } else {
      setShowSuggestionsList(false);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setShowSuggestionsList(false);
    setSelectedIndex(-1);
    
    if (onChange) {
      onChange('');
    }
    
    if (onSearch) {
      onSearch('');
    }
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSuggestionClick = (suggestion, index) => {
    const suggestionValue = typeof suggestion === 'string' ? suggestion : suggestion.value || suggestion.label;
    setInputValue(suggestionValue);
    setShowSuggestionsList(false);
    setSelectedIndex(-1);
    
    if (onChange) {
      onChange(suggestionValue);
    }
    
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion, index);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestionsList || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex], selectedIndex);
        } else if (onSearch) {
          onSearch(inputValue);
          setShowSuggestionsList(false);
        }
        break;
      
      case 'Escape':
        setShowSuggestionsList(false);
        setSelectedIndex(-1);
        if (inputRef.current) {
          inputRef.current.blur();
        }
        break;
      
      default:
        break;
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (showSuggestions && inputValue.trim() && suggestions.length > 0) {
      setShowSuggestionsList(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow clicking
    setTimeout(() => {
      setShowSuggestionsList(false);
      setSelectedIndex(-1);
    }, 150);
  };

  const getSuggestionText = (suggestion) => {
    if (typeof suggestion === 'string') return suggestion;
    return suggestion.label || suggestion.value || suggestion.name || String(suggestion);
  };

  const getSuggestionKey = (suggestion, index) => {
    if (typeof suggestion === 'object' && suggestion.id) return suggestion.id;
    return `suggestion-${index}`;
  };

  return (
    <div className={`th-search-input th-search-${size} ${className}`}>
      <div className={`th-search-wrapper ${isFocused ? 'focused' : ''}`}>
        <div className="th-search-icon">
          {loading ? <FaSpinner className="th-spinner" /> : <FaSearch />}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="th-search-field"
          disabled={loading}
          {...props}
        />
        
        {clearable && inputValue && (
          <button
            type="button"
            className="th-search-clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
      </div>
      
      {showSuggestionsList && suggestions.length > 0 && (
        <div ref={suggestionsRef} className="th-suggestions-list">
          {suggestions.map((suggestion, index) => (
            <div
              key={getSuggestionKey(suggestion, index)}
              className={`th-suggestion-item ${
                index === selectedIndex ? 'selected' : ''
              }`}
              onClick={() => handleSuggestionClick(suggestion, index)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="th-suggestion-text">
                {getSuggestionText(suggestion)}
              </span>
              {typeof suggestion === 'object' && suggestion.description && (
                <span className="th-suggestion-description">
                  {suggestion.description}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;