import React from 'react';
import MessageFrom from './MessageFrom';
import MessageTo from './MessageTo';
import MessageInputBox from './MessageInputBox';
import MessagesBoxHeader from './Header';

function MessagesBox({ messages, currentUser, selectedPerson }) {
  return (
    <div 
      className="messages-box"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      
      {/* Messages list should scroll if there are too many messages */}
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px',
        }}
      >
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {messages.map((message) => (
            <li 
              key={message.id} 
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {/* Conditionally render MessageFrom or MessageTo based on the sender */}
              {message.sender.username === currentUser ? (
                <MessageTo message={message} />
              ) : (
                <MessageFrom message={message} />
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* The MessageInputBox will always stay at the bottom */}
      <div style={{ borderTop: '1px solid #ccc', padding: '10px' }}>
        <MessageInputBox />
      </div>
    </div>
  );
}

export default MessagesBox;
