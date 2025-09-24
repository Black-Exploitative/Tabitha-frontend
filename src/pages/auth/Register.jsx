import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button/Button';
import { NIGERIAN_STATES, STAFF_POSITIONS } from '../../utils/nigerianData';
import './Auth.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading, error } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...registrationData } = data;
      await registerUser(registrationData);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      // Error handling is done in the context
    }
  };

  return (
    <div className="th-auth-form th-auth-form-wide th-fade-in">
      <div className="th-auth-header">
        <h2 className="th-auth-form-title">Join Tabitha Home</h2>
        <p className="th-auth-form-subtitle">
          Create your account to start making a difference
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="th-auth-form-content">
        {error && (
          <div className="th-alert th-alert-error th-slide-up">
            <span>{error}</span>
          </div>
        )}

        <div className="th-form-row">
          <div className="th-form-group">
            <label className="th-label">First Name</label>
            <div className="th-input-group">
              <FaUser className="th-input-icon" />
              <input
                type="text"
                className={`th-input th-input-with-icon ${errors.first_name ? 'th-input-error' : ''}`}
                placeholder="Enter first name"
                {...register('first_name', {
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters'
                  }
                })}
              />
            </div>
            {errors.first_name && (
              <span className="th-error-text">{errors.first_name.message}</span>
            )}
          </div>

          <div className="th-form-group">
            <label className="th-label">Last Name</label>
            <div className="th-input-group">
              <FaUser className="th-input-icon" />
              <input
                type="text"
                className={`th-input th-input-with-icon ${errors.last_name ? 'th-input-error' : ''}`}
                placeholder="Enter last name"
                {...register('last_name', {
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters'
                  }
                })}
              />
            </div>
            {errors.last_name && (
              <span className="th-error-text">{errors.last_name.message}</span>
            )}
          </div>
        </div>

        <div className="th-form-group">
          <label className="th-label">Email Address</label>
          <div className="th-input-group">
            <FaEnvelope className="th-input-icon" />
            <input
              type="email"
              className={`th-input th-input-with-icon ${errors.email ? 'th-input-error' : ''}`}
              placeholder="Enter your email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
          </div>
          {errors.email && (
            <span className="th-error-text">{errors.email.message}</span>
          )}
        </div>

        <div className="th-form-group">
          <label className="th-label">Phone Number</label>
          <div className="th-input-group">
            <FaPhone className="th-input-icon" />
            <input
              type="tel"
              className={`th-input th-input-with-icon ${errors.phone ? 'th-input-error' : ''}`}
              placeholder="08012345678"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^(\+234|0)[789][01]\d{8}$/,
                  message: 'Enter a valid Nigerian phone number'
                }
              })}
            />
          </div>
          {errors.phone && (
            <span className="th-error-text">{errors.phone.message}</span>
          )}
        </div>

        <div className="th-form-row">
          <div className="th-form-group">
            <label className="th-label">Position</label>
            <select
              className={`th-select ${errors.position ? 'th-input-error' : ''}`}
              {...register('position', {
                required: 'Position is required'
              })}
            >
              <option value="">Select position</option>
              {STAFF_POSITIONS.map(position => (
                <option key={position.value} value={position.value}>
                  {position.label}
                </option>
              ))}
            </select>
            {errors.position && (
              <span className="th-error-text">{errors.position.message}</span>
            )}
          </div>

          <div className="th-form-group">
            <label className="th-label">State</label>
            <select
              className={`th-select ${errors.state ? 'th-input-error' : ''}`}
              {...register('state', {
                required: 'State is required'
              })}
            >
              <option value="">Select state</option>
              {NIGERIAN_STATES.map(state => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
            {errors.state && (
              <span className="th-error-text">{errors.state.message}</span>
            )}
          </div>
        </div>

        <div className="th-form-row">
          <div className="th-form-group">
            <label className="th-label">Password</label>
            <div className="th-input-group">
              <FaLock className="th-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className={`th-input th-input-with-icon ${errors.password ? 'th-input-error' : ''}`}
                placeholder="Create password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain uppercase, lowercase, and number'
                  }
                })}
              />
              <button
                type="button"
                className="th-input-action"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span className="th-error-text">{errors.password.message}</span>
            )}
          </div>

          <div className="th-form-group">
            <label className="th-label">Confirm Password</label>
            <div className="th-input-group">
              <FaLock className="th-input-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={`th-input th-input-with-icon ${errors.confirmPassword ? 'th-input-error' : ''}`}
                placeholder="Confirm password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
              />
              <button
                type="button"
                className="th-input-action"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="th-error-text">{errors.confirmPassword.message}</span>
            )}
          </div>
        </div>

        <div className="th-form-group">
          <label className="th-checkbox-container">
            <input
              type="checkbox"
              className="th-checkbox"
              {...register('terms', {
                required: 'You must agree to the terms and conditions'
              })}
            />
            <span className="th-checkbox-label">
              I agree to the{' '}
              <Link to="/terms" className="th-link">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="th-link">Privacy Policy</Link>
            </span>
          </label>
          {errors.terms && (
            <span className="th-error-text">{errors.terms.message}</span>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={!isValid}
          icon={<FaUserPlus />}
          iconPosition="right"
        >
          Create Account
        </Button>

        <div className="th-auth-divider">
          <span>or</span>
        </div>

        <div className="th-auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/auth/login" className="th-link th-link-primary">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;