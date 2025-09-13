import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const inactivityTimer = useRef(null);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
  });

  api.interceptors.request.use((config) => {
    const localToken = localStorage.getItem('token');
    if (localToken) {
      config.headers['x-auth-token'] = localToken;
    }
    return config;
  });

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

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => {
      logout();
    }, 2* 60 * 1000); // 5 minutes
  };

  useEffect(() => {
    if (token) {
      const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

      const resetTimer = () => {
        resetInactivityTimer();
      };

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
  }, [token]);

  const value = { token, user, error, register, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
