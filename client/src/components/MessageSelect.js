import React from 'react';

function MessageSelect({ personName, lastMessage, lastMessageTimestamp, onSelectPerson, selectedPerson }) {
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
        height: '2.4em',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <span>{lastMessage ? truncateMessage(lastMessage.content) : '\u00A0'}</span>
        </div>
        <div style={{ marginLeft: '10px', textAlign: 'right' }}>
          <span style={{ fontSize: '0.8em', color: '#999' }}>
            {lastMessageTimestamp ? new Date(lastMessageTimestamp).toLocaleString() : '\u00A0'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MessageSelect;
