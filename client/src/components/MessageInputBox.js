import React, { useState } from 'react';
import PopupBox from './PopupBox';  // Import the PopupBox
import axios from 'axios';


function MessageInputBox({ currentUser, messageRecipient, refetchMessages, setSelectedPerson }) {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [classificationLoading, setClassificationLoading] = useState(false);
  const [classification, setClassification] = useState("");
  const [loadingImageGeneration, setLoadingImageGeneration] = useState(false);
  const [loadingMessageSend, setLoadingMessageSend] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);


  // Handle input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));  // Display image preview
      setShowPopup(true);  // Show the popup when image is selected
    }
  };
  const fetchClassification = async () => {
    setClassificationLoading(true);
    console.log(message);
    try {
        const response = await fetch('http://localhost:8000/classify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();
        setClassification(data.classification);
        if (data.classification === "none"){
          setLoadingImageGeneration(false);
        }else{
          setShowPopup(true);
        }
    } catch (error) {
        console.error('Error fetching classification:', error);
        setClassificationLoading(false);
    } 
};

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || image) {
      console.log('Message:', message);
      console.log('Image:', image);
      // Add further handling logic for sending the message
    }
    // Send the message to the server

  
    const sendMessage = async () => {
      try {
        fetchClassification();

      } catch (error) {
        console.error('Failed to get classification:', error);
      } finally {
      }
    };
    sendMessage();
    setImage(null);  // Remove image preview
    setShowPopup(false);  // Close the popup on submit
  };

  // Handle popup close
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div style={styles.container}>
      {/* PopupBox appears when showPopup is true */}
      {showPopup && (
        <PopupBox 
          message="Image uploaded successfully!" 
          classification={classification}
          onClose={handleClosePopup}
          loadingImageGeneration={loadingImageGeneration}
          setLoadingImageGeneration={setLoadingImageGeneration}
          setImageUrl={setImageUrl}
          imageUrl={imageUrl}
          setShowPopup={setShowPopup}
        />
      )}

      {image && (
        <div style={styles.imagePreview}>
          <img src={image} alt="Attachment preview" style={styles.image} />
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <label htmlFor="image-upload" style={styles.attachButton}>
          📎
          <input 
            type="file" 
            id="image-upload" 
            accept="image/*" 
            onChange={handleImageChange} 
            style={{ display: 'none' }} 
          />
        </label>

        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={handleMessageChange}
          style={styles.input}
        />

        <button type="submit" style={styles.sendButton}>
          ⬆️
        </button>
      </form>
    </div>
  );
}

// Inline styles for the component
const styles = {
  container: {
    position: 'relative',  // Relative positioning for popup to be placed above
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
    borderRadius: '20px',
    backgroundColor: '#2d2d2d',
    padding: '10px',
  },
  imagePreview: {
    marginBottom: '10px',
    textAlign: 'center',
  },
  image: {
    maxWidth: '100%',
    borderRadius: '10px',
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    borderRadius: '50px',
    padding: '10px',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: '#fff',
    padding: '10px',
    fontSize: '16px',
  },
  attachButton: {
    fontSize: '24px',
    cursor: 'pointer',
    color: '#fff',
    marginRight: '10px',
  },
  sendButton: {
    fontSize: '24px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    padding: '0 10px',
  },
};

export default MessageInputBox;
