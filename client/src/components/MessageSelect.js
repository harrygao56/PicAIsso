import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageCirclePlus } from 'lucide-react'; // Import the icon

function MessageSelect({ personName, lastMessage, lastMessageTimestamp, onSelectPerson, selectedPerson }) {
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const isSelected = selectedPerson === personName;

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (personName.startsWith("Message to") || personName.includes(" ")) {
        setProfilePhotoUrl(null);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get(`http://localhost:8000/users/${personName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        });
        
        if (response.data && response.data.profile_picture_url) {
          setProfilePhotoUrl(response.data.profile_picture_url);
        } else {
          setProfilePhotoUrl(null);
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
        setProfilePhotoUrl(null);
      }
    };

    fetchProfilePhoto();
  }, [personName]);

  const truncateMessage = (message, maxLength = 30) => {
    if (message.length <= maxLength) return message;
    return message.substr(0, maxLength) + '...';
  };

  const renderProfileIcon = () => {
    return (
      <div style={styles.profileIconContainer}>
        {profilePhotoUrl ? (
          <img src={profilePhotoUrl} alt={personName} style={styles.profileImage} />
        ) : (
          <span role="img" aria-label="Profile" style={styles.defaultIcon}>👤</span>
        )}
      </div>
    );
  };

  return (
    <div 
      style={{
        padding: '10px',
        paddingLeft: '20px',
        backgroundColor: isSelected ? '#e6e6e6' : 'transparent',
        cursor: 'pointer',
        borderBottom: '1px solid #ccc',
        height: '60px',
        display: 'flex',
        alignItems: 'center'
      }}
      onClick={() => onSelectPerson(personName)}
    >
      {personName === "Message to new user" ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <MessageCirclePlus style={{ marginRight: '8px', alignSelf: 'center', height: '2rem', width: '2rem'}} />
        <strong><span>New conversation</span></strong>
    </div>
     
    
      ) : (
        <>
          {renderProfileIcon()}
          <div style={{ marginLeft: '10px', flex: 1 }}>
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
        </>
      )}
    </div>
  );
}

const styles = {
  profileIconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '50%', 
    overflow: 'hidden', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc', 
    flexShrink: 0, // Prevent the container from shrinking
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', 
    minWidth: '40px', // Ensure the image maintains a minimum width
  },
  defaultIcon: {
    fontSize: '24px',
    color: '#fff',
  },
  messageplus: {

  }
};

export default MessageSelect;
