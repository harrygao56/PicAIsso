import React from 'react';
import MessageSelect from './MessageSelect'; // Make sure the path is correct

function SideBar({ messageMap, people, onSelectPerson, selectedPerson }) {
  return (
    <div className="sidebar">
      <h2 style={{height:"100px", margin:0}}>People You've Messaged With</h2>
    {people.map((person) => {
      const messages = messageMap[person] || [];
      const lastMessage = messages[messages.length - 1];
      return (
        <MessageSelect 
        key={person} 
        personName={person}
        lastMessage={lastMessage}
        onSelectPerson={onSelectPerson}
        selectedPerson={selectedPerson}
        />
      );
    })}
    </div>
  );
}

export default SideBar;
