import React from 'react';
import '../css/Messages.css';

function MessageTo({ message }) {
  return (
    <div 
      style={{ 
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '8px',
        paddingRight: '10px',
      }}
      className="message-container"
    >
      <div
        style={{ 
          backgroundColor: '#DCF8C6', 
          padding: '8px 12px',
          borderRadius: '18px 18px 0 18px',
          maxWidth: '70%',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          position: 'relative',
        }}
      >
        <p style={{ 
          fontSize: '1em', 
          margin: '0 0 4px 0',
          lineHeight: '1.3',
          color: '#303030',
          wordWrap: 'break-word',
        }}>
          {message.content}
        </p>
        {message.image_url && (
          <div style={{ marginTop: '8px' }}>
            <img 
              src={message.image_url} 
              alt="Message attachment" 
              style={{ 
                width: '100%',
                objectFit: 'contain',
                maxHeight: '600px',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} 
            />
          </div>
        )}
        <small style={{ 
          display: 'block', 
          marginTop: '4px', 
          fontSize: '0.75em',
          color: '#7C7C7C',
          textAlign: 'right' 
        }}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </small>
      </div>
    </div>
  );
}

export default MessageTo;
