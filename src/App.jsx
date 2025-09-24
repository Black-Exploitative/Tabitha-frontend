// src/App.jsx - Simplified without registration
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import MainLayout from './components/Layout/MainLayout';
import AuthLayout from './components/Layout/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import ChildrenList from './pages/children/ChildrenList';
import ChildProfile from './pages/children/ChildProfile';
import AddChild from './pages/children/AddChild';
import StaffList from './pages/staff/StaffList';
//import Reports from './pages/reports/Reports';
//import ReportBuilder from './pages/reports/ReportBuilder';
import StaffProfile from './pages/staff/StaffProfile';
import AddStaff from './pages/staff/AddStaff';

// Components
import ProtectedRoute from './components/Common/ProtectedRoute';
import ErrorBoundary from './components/Common/ErrorBoundary';

// Styles
import './styles/globals.css';
import './styles/luxury.css';
import './styles/components.css';
import './styles/responsive.css';
import './index.css';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <div className="th-app">
                <Routes>
                  {/* Auth Routes - Login Only */}
                  <Route path="/auth/*" element={
                    <AuthLayout>
                      <Routes>
                        <Route path="login" element={<Login />} />
                        <Route path="*" element={<Navigate to="/auth/login" replace />} />
                      </Routes>
                    </AuthLayout>
                  } />

                  {/* Protected Routes */}
                  <Route path="/*" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                       
                          {/* Children Routes */}
                          <Route path="/children" element={<ChildrenList />} />
                          <Route path="/children/:id" element={<ChildProfile />} />
                          <Route path="/children/add" element={<AddChild />} />
                          
                          {/* Staff Routes */}
                          <Route path="/staff" element={<StaffList />} />
                          <Route path="/staff/:id" element={<StaffProfile />} />
                          <Route path="/staff/add" element={<AddStaff />} />
                          
                          {/* Reports Routes */}
                          {/*<Route path="/reports" element={<Reports />} />
                          <Route path="/reports/builder" element={<ReportBuilder />} />*/}
                          
                          {/* Default redirect */}
                          <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                </Routes>
                <Toaster position="top-right" />
              </div>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;