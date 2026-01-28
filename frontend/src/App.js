import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import './App.css';
import './index.css';

// Pages
import LandingPage from './pages/LandingPage';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Bills from './pages/Bills';
import Ledger from './pages/Ledger';
import Invoices from './pages/Invoices';
import InvoiceView from './pages/InvoiceView';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Settings from './pages/Settings';

// Layout
import AppLayout from './components/Layout/AppLayout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // If user data passed from AuthCallback, render immediately
  const [isAuthenticated, setIsAuthenticated] = useState(
    location.state?.user ? true : null
  );

  React.useEffect(() => {
    // Skip check if user data already passed from AuthCallback
    if (location.state?.user) {
      setIsAuthenticated(true);
      return;
    }

    // Check authentication status
    if (!loading) {
      setIsAuthenticated(user ? true : false);
    }
  }, [user, loading, location.state]);
  
  // Show loading while checking
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function AppRouter() {
  const location = useLocation();
  
  // Check URL fragment (not query params) for session_id - MUST be synchronous
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bills"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Bills />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ledger"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Ledger />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoices"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Invoices />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoices/:invoiceId"
        element={
          <ProtectedRoute>
            <InvoiceView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Customers />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Products />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;