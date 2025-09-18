import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const EntryContext = createContext();

export const useEntry = () => {
  return useContext(EntryContext);
};

export const EntryProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);

  const api = axios.create({
    baseURL: 'https://harsha-bills.onrender.com/api',
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        setError('Your session has expired. Please log in again.');
      }
      return Promise.reject(error);
    }
  );

  const getEntries = useCallback(async (year, month) => {
    console.log(`%cFetching entries for ${month}/${year}...`, 'color: blue;');
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/entries', {
        params: { year, month },
      });
      console.log('%cFetch successful!', 'color: green;', res.data);
      setEntries(res.data);
    } catch (err) {
      console.error('%cFetch failed!', 'color: red;', err);
      if (err.response?.status !== 401) {
        setError(err.response?.data?.msg || 'Failed to fetch entries');
      }
      setEntries([]);
    } finally {
      console.log('%cSetting loading to false.', 'color: gray;');
      setLoading(false);
    }
  }, []); // useCallback ensures this function is stable

  const addEntry = useCallback(async (entryData) => {
    try {
      await api.post('/entries', entryData);
      await getEntries(filterYear, filterMonth); 
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add entry');
    }
  }, [getEntries, filterYear, filterMonth]);

  const updateEntry = useCallback(async (id, entryData) => {
    try {
      await api.put(`/entries/${id}`, entryData);
      await getEntries(filterYear, filterMonth);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update entry');
    }
  }, [getEntries, filterYear, filterMonth]);

  const deleteEntry = useCallback(async (id) => {
    try {
      await api.delete(`/entries/${id}`);
      await getEntries(filterYear, filterMonth);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to delete entry');
    }
  }, [getEntries, filterYear, filterMonth]);

  useEffect(() => {
    console.log('Filter changed. Triggering useEffect.');
    const token = localStorage.getItem('token');
    if (token) {
      getEntries(filterYear, filterMonth);
    } else {
      setLoading(false);
    }
  }, [filterYear, filterMonth, getEntries]);
  
  const value = {
    entries,
    loading,
    error,
    filterYear,
    filterMonth,
    setFilterYear,
    setFilterMonth,
    getEntries,
    addEntry,
    updateEntry,
    deleteEntry,
  };

  return <EntryContext.Provider value={value}>{children}</EntryContext.Provider>;
};

