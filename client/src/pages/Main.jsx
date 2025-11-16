import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import './Main.css';

function Main() {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/discover', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction) => {
    if (currentIndex >= users.length) return;

    const swipedUser = users[currentIndex];
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/swipe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          swipedUserId: swipedUser.id,
          direction
        })
      });

      const data = await response.json();

      if (data.isMatch) {
        setShowMatchPopup(true);
        setTimeout(() => setShowMatchPopup(false), 3000);
      }

      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error('Error swiping:', error);
    }
  };

  const currentUser = users[currentIndex];

  return (
    <div className="main-container">
      <div className="container">
        <div className="header">
          <h1 className="logo">Coupling</h1>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="nav-buttons">
          <button className="nav-btn active">Discover</button>
          <button className="nav-btn" onClick={() => navigate('/matches')}>Matches</button>
        </div>

        <div className="swipe-area">
          {loading ? (
            <div className="card loading-card">
              <div className="spinner"></div>
            </div>
          ) : currentUser ? (
            <div className="card">
              <div className="card-image">
                <div className="avatar">{currentUser.name.charAt(0).toUpperCase()}</div>
              </div>

              <div className="card-content">
                <div className="card-header">
                  <h2>{currentUser.name}</h2>
                  <span className={`badge ${currentUser.user_type}`}>
                    {currentUser.user_type === 'technical' ? '🔧 Technical' : '💡 Idea Maker'}
                  </span>
                </div>

                <div className="card-info">
                  <p className="info-item">🌍 {currentUser.country}</p>
                  <p className="info-item">🎓 {currentUser.university}</p>
                </div>

                {currentUser.bio && (
                  <div className="card-section">
                    <h3>Bio</h3>
                    <p>{currentUser.bio}</p>
                  </div>
                )}

                {currentUser.user_type === 'technical' && currentUser.skills && (
                  <div className="card-section">
                    <h3>Skills</h3>
                    <div className="skills">
                      {currentUser.skills.split(',').map((skill, i) => (
                        <span key={i} className="skill-tag">{skill.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}

                {currentUser.user_type === 'non-technical' && (
                  <>
                    {currentUser.idea_description && (
                      <div className="card-section">
                        <h3>Project Idea</h3>
                        <p>{currentUser.idea_description}</p>
                      </div>
                    )}

                    {currentUser.equity_offer && (
                      <div className="card-section">
                        <h3>Offering</h3>
                        <p className="highlight">{currentUser.equity_offer}</p>
                      </div>
                    )}

                    {currentUser.timeline && (
                      <div className="card-section">
                        <h3>Timeline</h3>
                        <p>{currentUser.timeline}</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="card-actions">
                <button className="action-btn reject" onClick={() => handleSwipe('left')}>
                  ✕
                </button>
                <button className="action-btn like" onClick={() => handleSwipe('right')}>
                  ♥
                </button>
              </div>
            </div>
          ) : (
            <div className="card empty-card">
              <div className="empty-state">
                <div className="empty-icon">😔</div>
                <h2>No more users</h2>
                <p>Check back later for new matches!</p>
                <button className="btn" onClick={loadUsers}>Refresh</button>
              </div>
            </div>
          )}
        </div>

        <div className="footer-actions">
          <button className="btn-secondary" onClick={logout}>Logout</button>
        </div>
      </div>

      {showMatchPopup && (
        <div className="match-popup">
          <div className="match-popup-content">
            <h2>It's a Match! 🎉</h2>
            <p>You and {currentUser?.name} liked each other!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
