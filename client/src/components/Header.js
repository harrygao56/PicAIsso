import React, { useState } from 'react';

function Header({ onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    onLogout();
    setShowDropdown(false); // Close the dropdown after logging out
  };
  return (
    <div style={styles.header}>
      {/* Title centered in the header */}
      <h2 style={styles.text}>PicAIsso</h2>

      {/* Profile Icon */}
      <div style={styles.profileContainer}>
        <div style={styles.profileIcon} onClick={toggleDropdown}>
          {/* You can replace this with an actual profile image or icon */}
          <span role="img" aria-label="Profile">👤</span>
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div style={styles.dropdownMenu}>
            <button style={styles.dropdownItem} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: {
    height: '75px',
    width: '100%',
    backgroundColor: '#1c1c1c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',  // Center elements horizontally
    borderBottom: '1px solid #ccc',
    position: 'relative',
  },
  text: {
    color: '#fff',
    margin: 0,
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',  // Ensure the text is centered in the header
    fontSize: '24px',
  },
  profileContainer: {
    position: 'absolute',
    right: '20px',  // Align the profile icon to the right
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
};

export default Header;
