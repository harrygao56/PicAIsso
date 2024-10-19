import React from 'react';

function MessageFrom({ message }) {
  return (
    <div 
      style={{ 
        backgroundColor: '#f1f1f1', 
        padding: '10px', 
        borderRadius: '10px', 
        maxWidth: '60%', 
        margin: '5px', 
        alignSelf: 'flex-start'  // Align the message to the left
      }}
    >
      <strong>{message.sender.username}:</strong>
      <p>{message.content}</p>
      <small>{new Date(message.timestamp).toLocaleString()}</small>
    </div>
  );
}

export default MessageFrom;
