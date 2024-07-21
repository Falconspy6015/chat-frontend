import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://your-backend-url.onrender.com'); // Replace with your deployed backend URL

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (username && message) {
      socket.emit('message', { username, text: message });
      setMessage('');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}</strong>: {msg.text} <em>{msg.timestamp}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

useEffect(() => {
  socket.on('message', (msg) => {
    console.log('Received message:', msg); // Add this line
    setMessages((prevMessages) => [...prevMessages, msg]);
  });

  return () => {
    socket.off('message');
  };
}, []);

export default App;
