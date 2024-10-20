import React, { useState } from 'react';
import '../css/PopupBox.css';  // Import the CSS file
import { X, Check, RefreshCw, Pencil} from 'lucide-react';

function PopupBox({ message, classification, loadingImageGeneration, setLoadingImageGeneration, setImageUrl, imageUrl, setShowPopup, imageLoaded, setImageLoaded, image, setImage, setPromptAnswered }) {
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [showRegenerateInput, setShowRegenerateInput] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState(message);
  const [imageGenerated, setImageGenerated] = useState(false);

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
      setImageGenerated(true); // Set this new state when image is generated
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
    setShowRegenerateInput(false);  // Hide the input immediately
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
      setAdditionalInfo('');
    } catch (error) {
      console.error('Error regenerating image:', error);
      setLoadingImageGeneration(false);
      setShowRegenerateInput(true);  // Show the input again if there's an error
    }
  };

  const styles = {
    popup: {
      padding: '5px',
      borderRadius: '20px',
      backgroundColor: 'rgb(45, 45, 45)',
      fontSize: '1rem',
      marginBottom: '-1rem'
    },
    popupText: {
      width: '25rem'
    },
    regenerateInput: {
      width: '22rem',
      padding: '12px',
      marginTop: '10px',
      marginBottom: '15px',
      borderRadius: '20px',
      border: 'none',
      backgroundColor: 'rgb(250, 250, 250)',
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
        <img src={imageUrl} alt="Generated" className="generatedImage" style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '10px', marginTop: '20px' }} />
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
        {imageGenerated && (
          <button onClick={onRegenerateClick} className="regenerateButton">
            <Pencil style={{ color: 'rgb(230, 230, 230)', height: '1.2rem', marginTop: '5px'}}/>
          </button>
        )}
      </div>
      {showRegenerateInput && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onRegenerateSubmit();
                }
              }}
              placeholder="Add additional details..."
              style={styles.regenerateInput}
            />
            <RefreshCw 
              onClick={onRegenerateSubmit}
              style={{ color: 'rgb(230, 230, 230)', height: '1.5rem', width: '1.5rem', marginLeft: '1.5rem' }}
            />

          </div>
        </div>
      )}
    </div>
  );
}

export default PopupBox;
