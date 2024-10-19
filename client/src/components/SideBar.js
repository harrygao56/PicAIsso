import React from 'react';
import MessageSelect from './MessageSelect'; // Make sure the path is correct

function SideBar({ messageMap, people = [], onSelectPerson, selectedPerson }) {
  return (
    <div className="sidebar">
      <MessageSelect 
        key="new-user"
        personName="Message to new user"
        onSelectPerson={() => onSelectPerson(null)}
        selectedPerson={selectedPerson}
      />
      {people.map((person) => {
      const messages = messageMap[person] || [];
      const lastMessage = messages[0];
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
