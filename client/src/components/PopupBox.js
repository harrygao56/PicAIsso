import React from 'react';
import '../css/PopupBox.css';  // Import the CSS file
import { useState } from 'react';

function PopupBox({ message,classification, onClose, loadingImageGeneration, setLoadingImageGeneration, setImageUrl, imageUrl }) {
  
  const onGenerate = async () => {
    setLoadingImageGeneration(true);
    try {
        const response = await fetch('http://localhost:8000/getImage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "message": message, "classification": classification }),
        });

        const data = await response.json();
        setImageUrl(data.image_url);
        setLoadingImageGeneration(false);
    } catch (error) {
        console.error('Error fetching classification:', error);
        setLoadingImageGeneration(false);
    }
  };

  return (
    <div className="popupContainer">
        {loadingImageGeneration ? (
          <div className="loadingBox">
            <div className="spinner"></div> {/* Apply the class instead of inline styles */}
          </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt="Generated" className="generatedImage" style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
        ) : null}
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
