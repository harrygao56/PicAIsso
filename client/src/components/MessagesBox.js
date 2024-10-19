import React from 'react';
import MessageFrom from './MessageFrom';
import MessageTo from './MessageTo';
import MessageInputBox from './MessageInputBox';
import MessagesBoxHeader from './Header';
import { useState } from 'react';

function MessagesBox({ messages, currentUser, selectedPerson, refetchMessages, setSelectedPerson }) {
  const [messageRecipient, setMessageRecipient] = useState(selectedPerson);
  console.log(messageRecipient);
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
      {messages.length === 0 && (
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            value={messageRecipient}
            onChange={(e) => setMessageRecipient(e.target.value)}
            placeholder="Enter recipient's username"
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
      )}
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
        <MessageInputBox 
          currentUser={currentUser}
          messageRecipient={messageRecipient}
          refetchMessages={refetchMessages}
          setSelectedPerson={setSelectedPerson}
        />
      </div>
    </div>
  );
}

export default MessagesBox;
