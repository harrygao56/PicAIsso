import React, { useState, useRef, useEffect } from 'react';
import PopupBox from './PopupBox';  // Import the PopupBox
import axios from 'axios';
import { Send } from 'lucide-react';


function MessageInputBox({ currentUser, messageRecipient, refetchMessages, setSelectedPerson, sendMessage }) {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [classificationLoading, setClassificationLoading] = useState(false);
  const [classification, setClassification] = useState("");
  const [loadingImageGeneration, setLoadingImageGeneration] = useState(false);
  const [loadingMessageSend, setLoadingMessageSend] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [promptAnswered, setPromptAnswered] = useState(false);

  // Handle input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);  // Set the image URL here
        setShowPopup(true);  // Show the popup when image is selected
      };
      reader.readAsDataURL(file);
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
        console.log(data.classification);
        if (data.classification === "none"){
          const messageData = {
            content: message.trim(),
            recipient_username: messageRecipient,
            image_url: imageUrl || null,
          };

          // Send the message via WebSocket
          await sendMessage(messageData);
          
          // Clear the message and imageUrl after sending
          setImage(null);
          setMessage('');
          setImageUrl(null);
          setPromptAnswered(false);
        }else{
          setShowPopup(true);
        }
    } catch (error) {
        console.error('Error fetching classification:', error);
    } finally {
      setClassificationLoading(false);
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() || imageUrl) {
      setLoadingMessageSend(true);
      
      try {
        if (!promptAnswered) {
          await fetchClassification();
        } else {
          const messageData = {
            content: message.trim(),
            recipient_username: messageRecipient,
            image_url: imageUrl || null,
          };

          await sendMessage(messageData);
          
          setImage(null);
          setMessage('');
          setImageUrl(null);
          setPromptAnswered(false);
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setLoadingMessageSend(false);
      }
    }
  };

  // Handle popup close
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div style={styles.container}>
      {showPopup && (
        <PopupBox 
          message={message}
          classification={classification}
          onClose={handleClosePopup}
          loadingImageGeneration={loadingImageGeneration}
          setLoadingImageGeneration={setLoadingImageGeneration}
          setImageUrl={setImageUrl}
          imageUrl={imageUrl}
          setShowPopup={setShowPopup}
          imageLoaded={imageLoaded}
          setImageLoaded={setImageLoaded}
          image={image}
          setImage={setImage}
          setPromptAnswered={setPromptAnswered}
        />
      )}

      {image && (
        <div style={styles.imagePreview}>
          <img src={image} alt="Attachment preview" style={styles.image} />
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>

        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={handleMessageChange}
          style={styles.input}
        />

        <button type="submit" style={styles.sendButton}>
        <Send style={{ color: 'rgb(230, 230, 230)', marginTop: '5px', marginRight: '5px'}}/>
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
    backgroundColor: 'transparent',
    padding: '10px',
  },
  imagePreview: {
    display: 'flex',
    marginBottom: '10px',
    textAlign: 'center',
    justifyContent: 'center'
  },
  image: {
    maxWidth: '94%',
    border: '15px solid rgb(45, 45, 45)',
    borderRadius: '20px'
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgb(45, 45, 45)',
    borderRadius: '50px',
    padding: '10px',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: '#fff',
    padding: '5px',
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
