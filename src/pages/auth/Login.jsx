// src/pages/auth/Login.jsx - Without registration link
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button/Button';
import './Auth.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (error) {
      // Error handling is done in the context
    }
  };

  return (
    <div className="th-auth-form-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--th-bg-auth, #f8f9fa)' }}>
      <div className="th-auth-form th-fade-in" style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.08)', borderRadius: '18px', padding: '2.5rem 2rem', background: '#fff' }}>
        <div className="th-auth-header">
          <h2 className="th-auth-form-title">Welcome Back</h2>
          <p className="th-auth-form-subtitle">
            Sign in to continue managing Tabitha Home
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="th-auth-form-content" autoComplete="on">
          {error && (
            <div className="th-alert th-alert-error th-slide-up" role="alert">
              <span>{error}</span>
            </div>
          )}
          <div className="th-form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="th-label" htmlFor="email">Email Address</label>
            <div className="th-input-group">
              <FaUser className="th-input-icon" />
              <input
                id="email"
                type="email"
                className={`th-input th-input-with-icon ${errors.email ? 'th-input-error' : ''}`}
                placeholder="Enter your email"
                autoComplete="email"
                aria-label="Email Address"
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
          <div className="th-form-group" style={{ marginBottom: '2rem' }}>
            <label className="th-label" htmlFor="password">Password</label>
            <div className="th-input-group">
              <FaLock className="th-input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`th-input th-input-with-icon ${errors.password ? 'th-input-error' : ''}`}
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-label="Password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              <button
                type="button"
                className="th-input-action"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span className="th-error-text">{errors.password.message}</span>
            )}
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={!isValid}
            icon={<FaArrowRight />}
            iconPosition="right"
            style={{ width: '100%', marginBottom: '1.5rem', fontWeight: 600, fontSize: '1.1rem', padding: '1rem 0' }}
          >
            Sign In
          </Button>
          <div className="th-auth-footer">
            <p className="th-text-muted" style={{ fontSize: '0.95rem' }}>
              Contact your administrator for account access
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;