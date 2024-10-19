import React from 'react';
import MessageSelect from './MessageSelect'; // Make sure the path is correct

function SideBar({ people, onSelectPerson, selectedPerson }) {
  return (
    <div className="sidebar">
      <h2 style={{height:"100px", margin:0}}>People You've Messaged With</h2>
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
