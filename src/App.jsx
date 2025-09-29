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
import EditChild from './pages/children/EditChild';
import StaffList from './pages/staff/StaffList';
import StaffProfile from './pages/staff/StaffProfile';
import AddStaff from './pages/staff/AddStaff';
import EditStaff from './pages/staff/EditStaff';
import Settings from './pages/settings/Settings';
import Health from './pages/health/Health';
import Education from './pages/education/Education';
import Activities from './pages/activities/Activities';
import Reports from './pages/reports/Reports';
import ReportBuilder from './pages/reports/ReportBuilder';
import ReportsDashboard from './pages/reports/ReportsDashboard';
import Calendar from './pages/calender/Calender';
import Documents from './pages/documents/Documents';
import Notifications from './pages/notifications/Notifications';

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
                          <Route path="/children/:id/edit" element={<EditChild />} />
                          
                          {/* Staff Routes */}
                          <Route path="/staff" element={<StaffList />} />
                          <Route path="/staff/:id" element={<StaffProfile />} />
                          <Route path="/staff/add" element={<AddStaff />} />
                          <Route path="/staff/:id/edit" element={<EditStaff />} />
                          
                          {/* Health Routes */}
                          <Route path="/health" element={<Health />} />
                          
                          {/* Education Routes */}
                          <Route path="/education" element={<Education />} />
                          
                          {/* Activities Routes */}
                          <Route path="/activities" element={<Activities />} />
                          
                          {/* Reports Routes */}
                          <Route path="/reports" element={<ReportsDashboard />} />
                          <Route path="/reports/builder" element={<ReportBuilder />} />
                          <Route path="/reports/analytics" element={<Reports />} />
                          
                          {/* Calendar Routes */}
                          <Route path="/calendar" element={<Calendar />} />
                          
                          {/* Documents Routes */}
                          <Route path="/documents" element={<Documents />} />
                          
                          {/* Notifications Routes */}
                          <Route path="/notifications" element={<Notifications />} />
                          
                          {/* Settings Routes */}
                          <Route path="/settings" element={<Settings />} />
                          
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