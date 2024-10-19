import React from 'react';

function MessageSelect({ personName, lastMessage, onSelectPerson, selectedPerson }) {
  const isSelected = selectedPerson === personName;

  const truncateMessage = (message, maxLength = 30) => {
    if (message.length <= maxLength) return message;
    return message.substr(0, maxLength) + '...';
  };

  return (
    <div 
      style={{
        padding: '10px',
        backgroundColor: isSelected ? '#e6e6e6' : 'transparent',
        cursor: 'pointer',
        borderBottom: '1px solid #ccc',
        height: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
      onClick={() => onSelectPerson(personName)}
    >
      <div style={{ 
        fontWeight: 'bold',
        marginBottom: '5px'
      }}>
        {personName}
      </div>
      <div style={{ 
        fontSize: '0.9em', 
        color: '#666', 
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        height: '1.2em'
      }}>
        {lastMessage ? truncateMessage(lastMessage.content) : '\u00A0'}
      </div>
    </div>
  );
}

export default MessageSelect;
