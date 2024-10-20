import React, { useEffect, useRef } from 'react';
import MessageInputBox from './MessageInputBox';

function MessagesBox({ messages, currentUser, selectedPerson, sendMessage }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{message.sender.username === currentUser ? 'You' : message.sender.username}:</strong> {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInputBox 
        currentUser={currentUser}
        messageRecipient={selectedPerson}
        sendMessage={sendMessage}
      />
    </div>
  );
}

export default MessagesBox;
