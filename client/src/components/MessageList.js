import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useMessages from '../Hooks/useMessages'; // Adjust path as needed
import SideBar from './SideBar';
import MessagesBox from './MessagesBox';

function MessageList() {
  const { people, messageMap, loading, error } = useMessages();
  const [selectedPerson, setSelectedPerson] = useState(null);
  const currentUser = 'your-username';  // Replace with your actual username or authentication logic

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
  };

  return (
    <div className="message-container" style={{ display: 'flex' }}>
      {/* Sidebar with list of people */}
      <SideBar 
        people={people} 
        onSelectPerson={handleSelectPerson} 
        selectedPerson={selectedPerson}
      />

      {/* Main message area */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h2>Messages</h2>
        <Link to="/compose">Compose New Message</Link>

        {/* Show conversation if a person is selected */}
        {selectedPerson ? (
          <MessagesBox 
            messages={messageMap[selectedPerson] || []}
            currentUser={currentUser}
          />
        ) : (
          <div>Select a person to view the conversation.</div>
        )}
      </div>
    </div>
  );
}

export default MessageList;
