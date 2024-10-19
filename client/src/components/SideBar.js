import React from 'react';
import MessageSelect from './MessageSelect'; // Make sure the path is correct

function SideBar({ people = [], onSelectPerson, selectedPerson }) {
  return (
    <div className="sidebar">
      <MessageSelect 
        key="new-user"
        personName="Message to new user"
        onSelectPerson={() => onSelectPerson(null)}
        selectedPerson={selectedPerson}
      />
      {people.map((person) => (
        <MessageSelect 
          key={person} 
          personName={person}
          onSelectPerson={onSelectPerson}
          selectedPerson={selectedPerson}
        />
      ))}
    </div>
  );
}

export default SideBar;
