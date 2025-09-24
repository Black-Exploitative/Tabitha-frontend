// src/context/ThemeContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ThemeContext = createContext();

const initialState = {
  theme: 'light',
  primaryColor: 'orange',
  fontSize: 'base',
  animations: true,
  darkMode: false
};

const themeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode, theme: !state.darkMode ? 'dark' : 'light' };
    case 'SET_PRIMARY_COLOR':
      return { ...state, primaryColor: action.payload };
    case 'SET_FONT_SIZE':
      return { ...state, fontSize: action.payload };
    case 'TOGGLE_ANIMATIONS':
      return { ...state, animations: !state.animations };
    case 'RESET_THEME':
      return initialState;
    default:
      return state;
  }
};

export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('th-theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        Object.keys(parsedTheme).forEach(key => {
          if (key === 'theme') {
            dispatch({ type: 'SET_THEME', payload: parsedTheme[key] });
          } else if (key === 'darkMode') {
            if (parsedTheme[key] !== state.darkMode) {
              dispatch({ type: 'TOGGLE_DARK_MODE' });
            }
          }
        });
      } catch (error) {
        console.warn('Failed to parse saved theme:', error);
      }
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('th-theme', JSON.stringify(state));
    
    // Apply theme to document root
    document.documentElement.setAttribute('data-theme', state.theme);
    document.documentElement.setAttribute('data-primary-color', state.primaryColor);
    document.documentElement.setAttribute('data-font-size', state.fontSize);
    
    if (state.animations) {
      document.documentElement.classList.remove('th-no-animations');
    } else {
      document.documentElement.classList.add('th-no-animations');
    }
  }, [state]);

  const setTheme = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const setPrimaryColor = (color) => {
    dispatch({ type: 'SET_PRIMARY_COLOR', payload: color });
  };

  const setFontSize = (size) => {
    dispatch({ type: 'SET_FONT_SIZE', payload: size });
  };

  const toggleAnimations = () => {
    dispatch({ type: 'TOGGLE_ANIMATIONS' });
  };

  const resetTheme = () => {
    dispatch({ type: 'RESET_THEME' });
  };

  const value = {
    ...state,
    setTheme,
    toggleDarkMode,
    setPrimaryColor,
    setFontSize,
    toggleAnimations,
    resetTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};