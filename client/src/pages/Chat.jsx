import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import './Chat.css';

function Chat() {
  const { matchId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [matchUser, setMatchUser] = useState(null);
  const messagesEndRef = useRef(null);
  const { user, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000); // Poll for new messages
    return () => clearInterval(interval);
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/messages/${matchId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);

        // Get match user info from first message or fetch matches
        if (!matchUser && data.length > 0) {
          const otherUserId = data[0].sender_id === user.id ? null : data[0].sender_id;
          if (otherUserId) {
            // For simplicity, we'll use the sender name from messages
            setMatchUser({ name: data.find(m => m.sender_id !== user.id)?.sender_name || 'Match' });
          }
        }

        // If still no match user, fetch from matches endpoint
        if (!matchUser) {
          const matchesResponse = await fetch('/api/matches', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (matchesResponse.ok) {
            const matches = await matchesResponse.json();
            const currentMatch = matches.find(m => m.match_id === parseInt(matchId));
            if (currentMatch) {
              setMatchUser({ name: currentMatch.name });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          matchId: parseInt(matchId),
          message: newMessage
        })
      });

      if (response.ok) {
        const message = await response.json();
        setMessages([...messages, message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-wrapper">
        <div className="chat-header">
          <button className="back-btn" onClick={() => navigate('/matches')}>
            ← Back
          </button>
          <h2>{matchUser?.name || 'Chat'}</h2>
          <button className="theme-toggle-chat" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="messages-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
            </div>
          ) : messages.length > 0 ? (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.sender_id === user.id ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    {message.sender_id !== user.id && (
                      <div className="message-sender">{message.sender_name}</div>
                    )}
                    <div className="message-text">{message.message}</div>
                    <div className="message-time">
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="empty-chat">
              <div className="empty-icon">👋</div>
              <p>Start the conversation!</p>
            </div>
          )}
        </div>

        <form className="message-input-container" onSubmit={sendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
          />
          <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
