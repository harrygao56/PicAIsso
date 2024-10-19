import React from 'react';
import MessageSelect from './MessageSelect'; // Make sure the path is correct

function SideBar({ people, onSelectPerson, selectedPerson }) {
  return (
    <div className="sidebar">
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
