import React from 'react';

function MessageSelect({ personName, onSelectPerson, selectedPerson }) {
  return (
    <div
      onClick={() => onSelectPerson(personName)}
      style={{ 
        fontWeight: personName === selectedPerson ? 'bold' : 'normal',
        cursor: 'pointer',
        width: '100%',  // Takes full width of the parent flexbox container
        height: '100px',  // Fixed height of 200px
        display: 'flex',
        alignItems: 'center',  // Vertically center the text
        justifyContent: 'center',  // Horizontally center the text
        backgroundColor: personName === selectedPerson ? '#e0e0e0' : '#f9f9f9', // Optional background change on selection
        border: '1px solid #ccc',  // Optional border for visual separation
        boxSizing: 'border-box'  // Ensure padding and border are included in the width/height
      }}
    >
      {personName}
    </div>
  );
}

export default MessageSelect;
