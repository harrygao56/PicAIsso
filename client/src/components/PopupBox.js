import React from 'react';
import '../css/PopupBox.css';  // Import the CSS file
import { X } from 'lucide-react';
import { Check } from 'lucide-react';

function PopupBox({ message, classification, loadingImageGeneration, setLoadingImageGeneration, setImageUrl, imageUrl, setShowPopup, imageLoaded, setImageLoaded, image, setImage, setPromptAnswered }) {
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

  const styles = {
    popup: {
      padding: '5px',
      borderRadius: '20px',
      backgroundColor: 'rgb(45, 45, 45)',
      fontSize: '1rem'
    },
    popupText: {
      width: '25rem'
    }
  }

  return (
    <div className="popupContainer" style={styles.popup}>
      {loadingImageGeneration ? (
        <div className="loadingBox">
          <div className="spinner"></div> {/* Ensure this div is closed */}
        </div>
      ) : imageUrl ? (
        <img src={imageUrl} alt="Generated" className="generatedImage" style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
      ) : null}
      <div className="popup">
        <span className="popupText" style={styles.popupText}>
          {!imageLoaded ? 
            "We've detected that this message could benefit from an image. Would you like to generate an image?" :
            "Would you like to add this image to your message?"
          }
        </span>
        <button onClick={!imageLoaded ? onGenerate : onSetImageLoaded} className="checkmarkButton">
          <Check style={{ color: 'rgb(230, 230, 230)' }} /> {/* Ensure this button is closed */}
        </button>
        <button onClick={onClose} className="closeButton">
          <X style={{ color: 'rgb(230, 230, 230)' }}/> {/* Ensure this button is closed */}
        </button>
      </div>
    </div>
  );
}

export default PopupBox;
