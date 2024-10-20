import React, { useState, useEffect, useRef } from 'react';
import MessageFrom from './MessageFrom';
import MessageTo from './MessageTo';
import MessageInputBox from './MessageInputBox';
import MessagesBoxHeader from './Header';

function MessagesBox({ messages, currentUser, selectedPerson, refetchMessages, setSelectedPerson, messageMap, setMessageMap }) {
  const [messageRecipient, setMessageRecipient] = useState(selectedPerson);
  const messageInputBoxRef = useRef(null);
  const [messageInputBoxHeight, setMessageInputBoxHeight] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setMessageRecipient(selectedPerson);
  }, [selectedPerson]);

  useEffect(() => {
    if (messageInputBoxRef.current) {
      setMessageInputBoxHeight(messageInputBoxRef.current.offsetHeight);
    }
  }, [messageInputBoxRef.current]);

  useEffect(() => {
    const clientId = localStorage.getItem('client_id');   
    const ws = new WebSocket(`ws://localhost:8000/ws/${clientId}`);
    setSocket(ws);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("received message from server", message);
      const sender = message.sender_username;
      // Append the new message to the messageMap for the sender
      setMessageMap((prevMessageMap) => {
        const updatedSenderMessages = [...(prevMessageMap[sender] || []), message];
        return {
          ...prevMessageMap,
          [sender]: updatedSenderMessages,
        };
      });
      // Trigger a re-fetch of messages to ensure parent component is updated
      refetchMessages();
    };

    return () => {
      ws.close();
    };
  }, [currentUser.id]);

  const sendMessage = (messageData) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("sending message to server");
      socket.send(JSON.stringify(messageData));
    }
  };

  return (
    <div className="messages-box" style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
      {/* Messages list should scroll if there are too many messages */}
      {messages.length === 0 && (
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            onChange={(e) => setMessageRecipient(e.target.value)}
            placeholder="Enter recipient's username"
            style={{
              width: '98%',
              padding: '8px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '10px'
            }}
          />
        </div>
      )}
      
      <div 
        ref={(el) => {
          if (el) {
            el.scrollTop = el.scrollHeight;
          }
        }}
        style={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: `calc(100vh - 75px - ${messageInputBoxHeight}px)`, // Use the calculated height
        }}
      >
        {messages.slice().reverse().map((message) => (
          <div 
            key={message.id} 
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {/* Conditionally render MessageFrom or MessageTo based on the sender */}
            {message.sender.username === currentUser ? (
              <MessageTo message={message} />
            ) : (
              <MessageFrom message={message} />
            )}
          </div>
        ))}
      </div>

      {/* The MessageInputBox will always stay at the bottom */}
      <div 
        ref={messageInputBoxRef} 
        style={{ 
          position: 'fixed', // Set position to fixed
          display: 'block',
          bottom: 0, // Align to the bottom of the screen
          left: '65%', // Center horizontally
          transform: 'translateX(-50%)', // Adjust for centering
          width: "70%",
          backgroundColor: 'transparent', // Ensure background is set to avoid transparency issues
          zIndex: 1000 // Ensure it appears above other elements,
        }}
      >
        <MessageInputBox 
          currentUser={currentUser}
          messageRecipient={messageRecipient}
          refetchMessages={refetchMessages}
          setSelectedPerson={setSelectedPerson}
          sendMessage={sendMessage} // Pass the sendMessage function
        />
      </div>
    </div>
  );
}

export default MessagesBox;
