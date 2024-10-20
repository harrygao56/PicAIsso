import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Header({ currentUser, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get(`http://localhost:8000/users/${currentUser}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        });
        setProfilePhotoUrl(response.data.profile_picture_url);
      } catch (error) {
        console.error('Error fetching profile picture:', error);
        setProfilePhotoUrl(null);
      }
    };

    if (currentUser) {
      fetchProfilePhoto();
    }
  }, [currentUser]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    onLogout();
    setShowDropdown(false); // Close the dropdown after logging out
  };

  const renderProfileIcon = () => {
    return (
      <div style={styles.profileIconContainer}>
        {profilePhotoUrl ? (
          <img src={profilePhotoUrl} alt="Profile" style={styles.profileImage} />
        ) : (
          <span role="img" aria-label="Profile" style={styles.defaultIcon}>👤</span>
        )}
      </div>
    );
  };

  return (
    <div style={styles.header}>
      <h2 style={styles.picasso}>pic.ai.sso</h2>

      {currentUser && (
        <div style={styles.profileContainer}>
          <div onClick={toggleDropdown}>
            {renderProfileIcon()}
          </div>

          {showDropdown && (
            <div style={styles.dropdownMenu}>
              <button style={styles.dropdownItem} onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  header: {
    height: '75px',
    width: '100%',
    backgroundColor: 'rgb(40, 40, 40)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid #ccc',
    position: 'relative',
  },
  text: {
    color: '#fff',
    margin: 0,
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '24px',
  },
  profileContainer: {
    position: 'absolute',
    right: '20px',
    cursor: 'pointer',
  },
  profileIcon: {
    fontSize: '24px',
    cursor: 'pointer',
    color: '#fff',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',  // Align the dropdown below the profile icon
    right: 0,
    backgroundColor: '#333',
    borderRadius: '8px',
    padding: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  dropdownItem: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    padding: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    textAlign: 'left',
    width: '100%',
  },
  profileIconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '50%', 
    overflow: 'hidden', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc', 
    cursor: 'pointer',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', 
  },
  defaultIcon: {
    fontSize: '24px',
    color: '#fff',
  },
  picasso: {
    fontFamily: 'Lucida Handwriting, cursive',
    fontSize: '2rem',
    letterSpacing: '0.1rem',
    color: '#fff'
  }
};

export default Header;
