import React from 'react';

function MessageTo({ message }) {
  return (
    <div 
      style={{ 
        backgroundColor: '#e1ffc7', 
        padding: '10px', 
        borderRadius: '10px', 
        maxWidth: '60%', 
        margin: '5px', 
        alignSelf: 'flex-end'  // Align the message to the right
      }}
    >
      <strong>{message.sender.username}:</strong>
      <p>{message.content}</p>
      {message.image_url && (
        <img src={message.image_url} alt="Message attachment" style={{ maxWidth: '100%', marginTop: '10px' }} />
      )}
      <small>{new Date(message.timestamp).toLocaleString()}</small>
    </div>
  );
}

export default MessageTo;
