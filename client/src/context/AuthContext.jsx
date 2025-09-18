import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Use a constant for the inactivity timeout for clarity and easy modification.
const INACTIVITY_TIMEOUT_MS = 1* 60 * 1000; // 2 minutes

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const inactivityTimer = useRef(null);

  const api = axios.create({
    baseURL: 'https://harsha-bills.onrender.com/api',
  });

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  }, []);

  api.interceptors.request.use((config) => {
    const localToken = localStorage.getItem('token');
    if (localToken) {
      config.headers['x-auth-token'] = localToken;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
        // Pass a state message on navigation to the login page.
        navigate('/login', { state: { message: 'Your session has expired. Please log in again.' } });
      }
      return Promise.reject(error);
    }
  );

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser({});
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  const login = async (userData) => {
    try {
      const res = await api.post('/auth/login', userData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser({});
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => {
      logout();
      // Also navigate with a message when the inactivity timer logs the user out.
      navigate('/login', { state: { message: 'You have been logged out due to inactivity.' } });
    }, INACTIVITY_TIMEOUT_MS);
  }, [logout, navigate]);

  useEffect(() => {
    if (token) {
      const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
      const resetTimer = () => resetInactivityTimer();

      events.forEach((event) => {
        window.addEventListener(event, resetTimer);
      });

      resetInactivityTimer(); // Initial timer start

      return () => {
        events.forEach((event) => {
          window.removeEventListener(event, resetTimer);
        });
        if (inactivityTimer.current) {
          clearTimeout(inactivityTimer.current);
        }
      };
    }
  }, [token, resetInactivityTimer]);

  const value = { token, user, error, register, login, logout, api };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
