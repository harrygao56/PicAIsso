import React from 'react';
import MessageSelect from './MessageSelect'; // Make sure the path is correct

function SideBar({ people, onSelectPerson, selectedPerson }) {
  return (
    <div className="sidebar">
      <h3>People You've Messaged With</h3>
      <ul>
        {people.map((person) => (
          <MessageSelect 
            key={person} 
            personName={person}
            onSelectPerson={onSelectPerson}
            selectedPerson={selectedPerson}
          />
        ))}
      </ul>
    </div>
  );
}

export default SideBar;
