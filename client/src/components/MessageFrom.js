import React from 'react';
import '../css/Messages.css';

function MessageFrom({ message }) {
  return (
    <div 
      style={{ 
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: '8px',
        paddingLeft: '10px',
      }}
      className="message-container"
    >
      <div
        style={{ 
          backgroundColor: '#F0F0F0',
          padding: '8px 12px',
          borderRadius: '18px 18px 18px 0',
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
                maxHeight: '300px',
                objectFit: 'cover', 
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
          color: '#7C7C7C'
        }}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </small>
      </div>
    </div>
  );
}

export default MessageFrom;
