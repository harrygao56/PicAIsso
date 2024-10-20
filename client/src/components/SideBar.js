import React from 'react';
import MessageSelect from './MessageSelect'; // Make sure the path is correct

function SideBar({ messagesMap, peopleList, onSelectPerson, selectedPerson }) {
  
  return (
    <div className="sidebar">
      <MessageSelect 
        key="new-user"
        personName="Message to new user"
        onSelectPerson={() => onSelectPerson(null)}
        selectedPerson={selectedPerson}
      />
      {peopleList.map((person) => {
        return (
          <MessageSelect 
            key={person} 
            personName={person}
            lastMessage={messagesMap.get(person) ? messagesMap.get(person)[0] : null}
            lastMessageTimestamp={messagesMap.get(person) && messagesMap.get(person)[0] ? messagesMap.get(person)[0].timestamp : null}
            onSelectPerson={onSelectPerson}
            selectedPerson={selectedPerson}
          />
        );
      })}
    </div>
  );
}

export default SideBar;
