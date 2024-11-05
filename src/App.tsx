import React, { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/Login';
import RegisterForm from './components/Register';
import Dashboard from './pages/Dashboard';
import { getSession } from './utils/auth';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Initialize authentication state from token
    const token = getSession();
    return !!token;
  });
  
  // Effect to watch for token changes
  useEffect(() => {
    const handleStorageChange = () => {
      const token = getSession();
      setIsAuthenticated(!!token);
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginForm setIsAuthenticated={setIsAuthenticated} />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <RegisterForm setIsAuthenticated={setIsAuthenticated} />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <Dashboard setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;