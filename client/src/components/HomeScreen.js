import React, { useState } from 'react';
import SideBar from './SideBar';
import MessagesBox from './MessagesBox';
import useMessages from '../Hooks/useMessages'; // Adjust the path if needed
import Header from './Header';  // Import the new Header component

function HomeScreen() {
  const { people, messageMap, loading, error, refetchMessages } = useMessages();
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [sendingMessageToNewPerson, setSendingMessageToNewPerson] = useState(false); // Corrected useState usage
  const currentUser = localStorage.getItem("username");  // Replace with actual username or logic to retrieve it
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    window.location.reload();  // This will simulate the logout by reloading the page
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
    console.log('Selected person:', person);
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <Header onLogout={handleLogout} />

      {/* Main content below header */}
      <div style={styles.container}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <SideBar
            messageMap={messageMap} 
          people={people} 
            onSelectPerson={handleSelectPerson} 
            selectedPerson={selectedPerson}
          />
        </div>

        {/* Messages Box */}
        <div style={styles.messagesBox}>
            <MessagesBox 
              messages={selectedPerson && messageMap[selectedPerson] ? messageMap[selectedPerson] : []}
              currentUser={currentUser}
              selectedPerson={selectedPerson}
              refetchMessages={refetchMessages}  // Pass the refetch function
              setSelectedPerson={setSelectedPerson}
            />
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh', // Full viewport height
  },
  container: {
    top: '100px',
    display: 'flex',
    flex: 1,  // Remaining height after header
  },
  sidebar: {
    width: '30%',  // Sidebar takes 30% of the parent width
    overflowY: 'auto',  // Scrollable if content overflows
    borderRight: '1px solid #ccc',  // Optional border to visually separate
  },
  messagesBox: {
    flex: 1,  // Messages box takes the remaining 70% of the parent width
    overflowY: 'auto',  // Enable vertical scrolling
    maxHeight: 'calc(100vh - 100px)',  // Ensure it doesn't exceed the viewport height minus the header
  },
};

export default HomeScreen;
