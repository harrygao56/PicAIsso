import React, { useState } from 'react';
import MessagesBox from './MessagesBox';
import SideBar from './SideBar';
import useMessages from '../Hooks/useMessages';

function Messages() {
  const { people, messageMap, loading, error, sendMessage, isConnected } = useMessages();
  const [selectedPerson, setSelectedPerson] = useState(null);
  const currentUser = localStorage.getItem("username");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '30%', borderRight: '1px solid #ccc' }}>
        <SideBar
          messageMap={messageMap}
          people={people}
          onSelectPerson={setSelectedPerson}
          selectedPerson={selectedPerson}
        />
      </div>
      <div style={{ width: '70%' }}>
        <h2>Messages</h2>
        <div>Connection status: {isConnected ? 'Connected' : 'Disconnected'}</div>
        {selectedPerson ? (
          <MessagesBox
            messages={messageMap[selectedPerson] || []}
            currentUser={currentUser}
            selectedPerson={selectedPerson}
            sendMessage={sendMessage}
          />
        ) : (
          <div>Select a person to start messaging</div>
        )}
      </div>
    </div>
  );
}

export default Messages;
