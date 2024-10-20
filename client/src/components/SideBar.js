import React from 'react';
import MessageSelect from './MessageSelect'; // Make sure the path is correct
import { MessageCirclePlus } from 'lucide-react';
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
        console.log("messages", messages);
        const lastMessage = messages[0];
        return (
          <MessageSelect 
            key={person} 
            personName={person}
            lastMessage={lastMessage}
            lastMessageTimestamp={lastMessage ? lastMessage.timestamp : null}
            onSelectPerson={onSelectPerson}
            selectedPerson={selectedPerson}
          />
        );
      })}
    </div>
  );
}

export default SideBar;
