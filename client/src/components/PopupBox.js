import React from 'react';
import '../css/PopupBox.css';  // Import the CSS file
import { X } from 'lucide-react';
import { Check } from 'lucide-react';

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
            <div className="spinner"></div> {/* Apply the class instead of inline styles */}
          </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt="Generated" className="generatedImage" style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
        ) : null}
        <div className="popup">
          <span className="popupText" style={styles.popupText}>
            We've detected that this message could benefit from an image. Would you like to generate an image?
          </span>
          
          <button onClick={onGenerate} className="checkmarkButton">
          <Check style={{ color: 'rgb(230, 230, 230)' }} /> {/* Use the Check icon */}
        </button>

        <button onClick={onClose} className="closeButton">
          <X style={{ color: 'rgb(230, 230, 230)' }}/> {/* Use the X icon */}
        </button>
        </div>
    </div>
  );
}

export default PopupBox;
