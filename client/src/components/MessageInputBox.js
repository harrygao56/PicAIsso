import React, { useState } from 'react';

function MessageInputBox({ currentUser, messageRecipient, sendMessage }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(messageRecipient, message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', padding: '10px' }}>
      <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Type a message..."
        style={{ flexGrow: 1, marginRight: '10px', padding: '5px' }}
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default MessageInputBox;
