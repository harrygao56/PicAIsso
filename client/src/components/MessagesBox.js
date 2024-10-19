import React from 'react';

function MessagesBox({ messages, currentUser }) {
  return (
    <div className="messages-box">
      <h4>Conversation History</h4>
      <ul>
        {messages.map((message) => (
          <li 
            key={message.id} 
            style={{ 
              display: 'flex', 
              justifyContent: message.sender.username === currentUser ? 'flex-end' : 'flex-start' 
            }}
          >
            <div 
              style={{ 
                backgroundColor: message.sender.username === currentUser ? '#e1ffc7' : '#f1f1f1', 
                padding: '10px',
                borderRadius: '10px',
                maxWidth: '60%',
                margin: '5px'
              }}
            >
              <strong>{message.sender.username}:</strong>
              <p>{message.content}</p>
              <small>{new Date(message.timestamp).toLocaleString()}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MessagesBox;
