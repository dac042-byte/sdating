import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import './Auth.css';

function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    country: '',
    university: '',
    userType: 'technical',
    bio: '',
    skills: '',
    ideaDescription: '',
    equityOffer: '',
    timeline: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          country: formData.country,
          university: formData.university,
          userType: formData.userType,
          bio: formData.bio,
          skills: formData.skills,
          ideaDescription: formData.ideaDescription,
          equityOffer: formData.equityOffer,
          timeline: formData.timeline
        })
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        navigate('/main');
      } else {
        setError(data.error || 'Sign up failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <button className="theme-toggle-auth" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="auth-card signup-card">
        <div className="auth-header">
          <h1 className="auth-logo">Coupling</h1>
          <p className="auth-subtitle">Join the community of builders</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@university.edu"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              name="country"
              type="text"
              value={formData.country}
              onChange={handleChange}
              placeholder="United States"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="university">University</label>
            <input
              id="university"
              name="university"
              type="text"
              value={formData.university}
              onChange={handleChange}
              placeholder="Massachusetts Institute of Technology"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="userType">I am a...</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="technical">Technical Person (Engineer/Developer)</option>
              <option value="non-technical">Non-Technical Person (Idea Maker)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows="3"
            />
          </div>

          {formData.userType === 'technical' && (
            <div className="form-group">
              <label htmlFor="skills">Skills</label>
              <input
                id="skills"
                name="skills"
                type="text"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, Python, etc."
              />
            </div>
          )}

          {formData.userType === 'non-technical' && (
            <>
              <div className="form-group">
                <label htmlFor="ideaDescription">Project Idea</label>
                <textarea
                  id="ideaDescription"
                  name="ideaDescription"
                  value={formData.ideaDescription}
                  onChange={handleChange}
                  placeholder="Describe your project idea..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="equityOffer">Equity Offer / Payment</label>
                <input
                  id="equityOffer"
                  name="equityOffer"
                  type="text"
                  value={formData.equityOffer}
                  onChange={handleChange}
                  placeholder="e.g., 20% equity, $500, or Free (resume building)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="timeline">Project Timeline</label>
                <input
                  id="timeline"
                  name="timeline"
                  type="text"
                  value={formData.timeline}
                  onChange={handleChange}
                  placeholder="e.g., 3 months, 6 weeks"
                />
              </div>
            </>
          )}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/signin">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
