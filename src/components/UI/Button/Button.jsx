import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'base',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClass = 'th-btn';
  const variantClass = `th-btn-${variant}`;
  const sizeClass = size !== 'base' ? `th-btn-${size}` : '';
  const fullWidthClass = fullWidth ? 'th-btn-full' : '';
  
  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    fullWidthClass,
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  const renderIcon = () => {
    if (loading) {
      return <FaSpinner className="th-btn-spinner" />;
    }
    return icon;
  };

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      <span className="th-btn-text">{children}</span>
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
};

export default Button;