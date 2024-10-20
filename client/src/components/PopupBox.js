import React, { useState } from 'react';
import '../css/PopupBox.css';  // Import the CSS file
import { X, Check, RefreshCw } from 'lucide-react';

function PopupBox({ message, classification, loadingImageGeneration, setLoadingImageGeneration, setImageUrl, imageUrl, setShowPopup, imageLoaded, setImageLoaded, image, setImage, setPromptAnswered }) {
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [showRegenerateInput, setShowRegenerateInput] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState(message);

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
    setImageLoaded(true);
    setPromptAnswered(true);
  };

  const onRegenerateClick = () => {
    setShowRegenerateInput(!showRegenerateInput);
    setAdditionalInfo('');
  };

  const onRegenerateSubmit = async () => {
    setLoadingImageGeneration(true);
    try {
      const newMessage = updatedMessage + (additionalInfo ? ' ' + additionalInfo : '');
      setUpdatedMessage(newMessage);
      console.log("sending updated message and classification to server");
      console.log(newMessage, classification);
      const response = await fetch('http://localhost:8000/getImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          "message": newMessage,
          "classification": classification
        }),
      });

      const data = await response.json();
      setImageUrl(data.image_url);
      setLoadingImageGeneration(false);
      setImageLoaded(true);
      setShowRegenerateInput(false);
      setAdditionalInfo('');
    } catch (error) {
      console.error('Error regenerating image:', error);
      setLoadingImageGeneration(false);
    }
  };

  const styles = {
    popup: {
      padding: '5px',
      paddingTop: '15px',
      borderRadius: '20px',
      backgroundColor: 'rgb(45, 45, 45)',
      fontSize: '1rem',
      marginBottom: '-1rem'
    },
    popupText: {
      width: '25rem'
    },
    regenerateInput: {
      width: '100%',
      padding: '10px',
      marginTop: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      backgroundColor: '#fff',
      color: '#333',
      fontSize: '1rem',
    }
  }

  return (
    <div className="popupContainer" style={styles.popup}>
      {loadingImageGeneration ? (
        <div className="loadingBox">
          <div className="spinner"></div>
        </div>
      ) : imageUrl ? (
        <img src={imageUrl} alt="Generated" className="generatedImage" style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '10px' }} />
      ) : null}
      <div className="popup">
        <span className="popupText" style={styles.popupText}>
          {!imageLoaded ? 
            "We've detected that this message could benefit from an image. Would you like to generate an image?" :
            "Would you like to add this image to your message?"
          }
        </span>
        <button onClick={!imageLoaded ? onGenerate : onSetImageLoaded} className="checkmarkButton">
          <Check style={{ color: 'rgb(230, 230, 230)', marginTop: '5px' }} />
        </button>
        <button onClick={onClose} className="closeButton">
          <X style={{ color: 'rgb(230, 230, 230)', marginLeft: '-10px', marginTop: '5px'}}/>
        </button>
        <button onClick={onRegenerateClick} className="regenerateButton">
          <RefreshCw style={{ color: 'rgb(230, 230, 230)', height: '1.3rem', marginTop: '5px'}}/>
        </button>
      </div>
      {showRegenerateInput && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Add additional information to change the image"
              style={styles.regenerateInput}
            />
            <button onClick={onRegenerateSubmit} style={styles.regenerateButton}>
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PopupBox;
