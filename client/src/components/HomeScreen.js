import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useMessages from '../Hooks/useMessages'; // Adjust path as needed
import SideBar from './SideBar';
import MessagesBox from './MessagesBox';

function HomeScreen() {
  const { people, messageMap, loading, error } = useMessages();
  const [selectedPerson, setSelectedPerson] = useState(null);
  const currentUser = localStorage.getItem('username');  // Replace with actual username or authentication logic

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
  };

  return (
    <div 
      className="message-container" 
      style={{
        display: 'flex',
        height: '100vh',  // Full viewport height
      }}
    >
      {/* Sidebar with list of people */}
      <SideBar 
        people={people} 
        onSelectPerson={handleSelectPerson} 
        selectedPerson={selectedPerson}
        style={{
          width: '30%',  // 30% width
          height: '100%',  // Full height
          overflowY: 'auto',  // Scrollable if content overflows
          borderRight: '1px solid #ccc',  // Optional border to visually separate sidebar
        }}
      />

      {/* Main message area */}
      <div 
        style={{
          flex: 1,
          width: '70%',  // 70% width
          padding: '20px',
          height: '100%',  // Full height
          display: 'flex',
          flexDirection: 'column',  // Arrange the content in a column layout
        }}
      >

        {/* Show conversation if a person is selected */}
        {selectedPerson ? (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <MessagesBox 
              messages={messageMap[selectedPerson] || []}
              currentUser={currentUser}
            />
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Select a person to view the conversation.
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
