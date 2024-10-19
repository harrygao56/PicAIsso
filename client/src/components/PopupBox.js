import React from 'react';

function PopupBox({ message, onClose, onGenerate }) {
    
  return (
    <div style={styles.popupContainer}>
      <div style={styles.popup}>
        <span style={styles.popupText}>We've detected that this message could benefit from an Image. Would you like to generate an image?</span>
        
        {/* Checkmark button */}
        <button onClick={onGenerate} style={styles.checkmarkButton}>
          ✔️
        </button>

        {/* Close button */}
        <button onClick={onClose} style={styles.closeButton}>
          ✖️
        </button>
      </div>
    </div>
  );
}

const styles = {
  popupContainer: {
    position: 'absolute',
    bottom: '100px',  // Adjust to appear right above the MessageInputBox
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,  // Ensure the popup appears on top
  },
  popup: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '600px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
  },
  popupText: {
    marginRight: '10px',
  },
  checkmarkButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#00ff00',  // Green checkmark color
    fontSize: '18px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer',
  },
};

export default PopupBox;
