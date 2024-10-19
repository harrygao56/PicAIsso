import React, { useState } from 'react';
import SideBar from './SideBar';
import MessagesBox from './MessagesBox';
import useMessages from '../Hooks/useMessages'; // Adjust the path if needed

function HomeScreen() {
  const { people, messageMap, loading, error } = useMessages();
  const [selectedPerson, setSelectedPerson] = useState(null);
  const currentUser = localStorage.getItem("username");  // Replace with actual username or logic to retrieve it

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
    console.log('Selected person:', person);
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <SideBar 
          people={people} 
          onSelectPerson={handleSelectPerson} 
          selectedPerson={selectedPerson}
        />
      </div>

      {/* Messages Box */}
      <div style={styles.messagesBox}>
        {selectedPerson ? (
          <MessagesBox 
            messages={messageMap[selectedPerson] || []}
            currentUser={currentUser}
            selectedPerson={selectedPerson}
          />
        ) : (
          <div>Select a person to view the conversation.</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh', // Full viewport height
  },
  sidebar: {
    width: '30%',  // Sidebar takes 30% of the parent width
    overflowY: 'auto',  // Scrollable if content overflows
    borderRight: '1px solid #ccc',  // Optional border to visually separate
  },
  messagesBox: {
    flex: 1,  // Messages box takes the remaining 70% of the parent width
  },
};

export default HomeScreen;
