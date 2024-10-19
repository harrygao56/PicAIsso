import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MessageCompose() {
  const [recipientUsername, setRecipientUsername] = useState('');
  const [content, setContent] = useState('');
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/messages', {
        recipient_username: recipientUsername,
        content,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      history('/messages');
    } catch (error) {
      console.error('Failed to send message:', error);
      // You might want to set an error state here to display to the user
    }
  };

  return (
    <div>
      <h2>Compose Message</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Recipient Username"
          value={recipientUsername}
          onChange={(e) => setRecipientUsername(e.target.value)}
        />
        <textarea
          placeholder="Message Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default MessageCompose;