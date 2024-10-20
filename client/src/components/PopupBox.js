import React from 'react';
import '../css/PopupBox.css';  // Import the CSS file
import { useState } from 'react';

function PopupBox({ message,classification, loadingImageGeneration, setLoadingImageGeneration, setImageUrl, imageUrl, setShowPopup, imageLoaded, setImageLoaded, image, setImage, setPromptAnswered }) {
  const onClose = () => {
    setImageUrl(null);
    setLoadingImageGeneration(false);
    setShowPopup(false);
    setImageLoaded(false);
    setPromptAnswered(true);
  };
  const onGenerate = async () => {
    setLoadingImageGeneration(true);
    try {
      console.log("sending message and classification to server");
      console.log(message, classification);
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
        setImageLoaded(true);
    } catch (error) {
        console.error('Error fetching classification:', error);
        setLoadingImageGeneration(false);
    }
  };

  const onSetImageLoaded = () => {
    setImage(imageUrl);
    setShowPopup(false);
    setImageLoaded(true); // Corrected line
    setPromptAnswered(true);
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
      <>
        {!imageLoaded ? 
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
          : 
          <div className="popup">
            <span className="popupText">
              Would you like to add this image to your message?
            </span>
            <button onClick={onSetImageLoaded} className="checkmarkButton">
              ✔️
            </button>
            <button onClick={onClose} className="closeButton">
              ✖️
            </button>
          </div>
        }
      </>
    </div>
  );
}

export default PopupBox;
