import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MessageList() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:8000/messages', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div>
      <h2>Messages</h2>
      <Link to="/compose">Compose New Message</Link>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <strong>From: {message.sender.username}</strong>
            <p>{message.content}</p>
            <small>{new Date(message.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MessageList;