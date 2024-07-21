import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('https://chat-backend-7qsx.onrender.com');

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);

  useEffect(() => {
    socket.on('message', ({ username, text, timestamp }) => {
      setMessages((prevMessages) => [...prevMessages, { username, text, timestamp }]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (username.trim() && message.trim()) {
      socket.emit('message', { username, text: message });
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      setUsernameSubmitted(true);
    }
  };

  return (
    <div className="App">
      <h1>Chat App</h1>
      {!usernameSubmitted ? (
        <div className="username-container">
          <input
            type="text"
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
            className="username-input"
          />
          <button onClick={handleUsernameSubmit} className="submit-username-button">
            Start Chat
          </button>
        </div>
      ) : (
        <div className="chat-container">
          <div className="messages">
            {messages.map((msg, index) => (
              <p key={index} className="message">
                <strong>{msg.username}:</strong> {msg.text} <span className="timestamp">[{msg.timestamp}]</span>
              </p>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="message-input"
            />
            <button onClick={sendMessage} className="send-button">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
