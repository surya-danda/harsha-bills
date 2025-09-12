import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import YearlyReportPage from './pages/YearlyReportPage'; // Import the new page
import { AuthProvider } from './context/AuthContext';
import { EntryProvider } from './context/EntryContext';

function App() {
  return (
    <AuthProvider>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <main className="container mx-auto p-4">
          <Routes>
            {/* Protected Routes */}
            <Route path="/" element={<PrivateRoute />}>
              <Route 
                path="/" 
                element={
                  <EntryProvider>
                    <DashboardPage />
                  </EntryProvider>
                } 
              />
              <Route path="/yearly-report" element={<YearlyReportPage />} />
            </Route>
            
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;

