import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import './Matches.css';

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/matches', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="matches-container">
      <div className="container">
        <div className="header">
          <h1 className="logo">Coupling</h1>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="nav-buttons">
          <button className="nav-btn" onClick={() => navigate('/main')}>Discover</button>
          <button className="nav-btn active">Matches</button>
        </div>

        <div className="matches-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
            </div>
          ) : matches.length > 0 ? (
            <div className="matches-list">
              {matches.map((match) => (
                <div
                  key={match.match_id}
                  className="match-card"
                  onClick={() => navigate(`/chat/${match.match_id}`)}
                >
                  <div className="match-avatar">
                    {match.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="match-info">
                    <h3>{match.name}</h3>
                    <p className="match-university">{match.university}</p>
                    <span className={`match-badge ${match.user_type}`}>
                      {match.user_type === 'technical' ? '🔧 Technical' : '💡 Idea Maker'}
                    </span>
                  </div>
                  <div className="match-arrow">→</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h2>No matches yet</h2>
              <p>Start swiping to find your project partner!</p>
              <button className="btn" onClick={() => navigate('/main')}>
                Start Swiping
              </button>
            </div>
          )}
        </div>

        <div className="footer-actions">
          <button className="btn-secondary" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Matches;
