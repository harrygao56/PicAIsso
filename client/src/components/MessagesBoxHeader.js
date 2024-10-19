import React from 'react';

function MessagesBoxHeader({ selectedPerson }) {
  return (
    <div style={styles.header}>
      <h2 style={styles.text}>Messages with {selectedPerson}</h2>
    </div>
  );
}

const styles = {
  header: {
    height: '100px',
    width: '100%',
    backgroundColor: '#1c1c1c', // Optional: Adjust the background color as desired
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid #ccc',  // Optional border for separation
  },
  text: {
    color: '#fff',  // White text color
    margin: 0,
  },
};

export default MessagesBoxHeader;
