import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Main from './pages/Main';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import './App.css';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with API
      fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setUser(data);
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, theme, toggleTheme }}>
      <Router>
        <Routes>
          <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/main" />} />
          <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/main" />} />
          <Route path="/main" element={user ? <Main /> : <Navigate to="/signin" />} />
          <Route path="/matches" element={user ? <Matches /> : <Navigate to="/signin" />} />
          <Route path="/chat/:matchId" element={user ? <Chat /> : <Navigate to="/signin" />} />
          <Route path="/" element={<Navigate to={user ? "/main" : "/signin"} />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
