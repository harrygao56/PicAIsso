import React from 'react';
import '../css/PopupBox.css';  // Import the CSS file

function PopupBox({ message, onClose, onGenerate, loadingImageGeneration }) {
  return (
    <div className="popupContainer">
        {loadingImageGeneration && (
          <div className="loadingBox">
            <div className="spinner"></div> {/* Apply the class instead of inline styles */}
          </div>
        )}
        
        <div className="popup">
          <span className="popupText">
            We've detected that this message could benefit from an Image. Would you like to generate an image?
          </span>
          
          <button onClick={onGenerate} className="checkmarkButton">
            ✔️
          </button>

          <button onClick={onClose} className="closeButton">
            ✖️
          </button>
        </div>
    </div>
  );
}

export default PopupBox;
