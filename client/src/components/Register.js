import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';  // Import the new Header component
import { ImageUp } from 'lucide-react';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }

    try {
      const response = await axios.post('http://localhost:8000/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        history('/login');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.detail || error.message);
      setErrorMessage(error.response?.data?.detail || 'Registration failed. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  // Inline CSS styles
  const styles = {
    container: {
      maxWidth: '400px',
      margin: '0 auto',
      marginTop: '10px',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
      textAlign: 'center'
    },
    heading: {
      marginBottom: '20px',
      color: '#333'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    input: {
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '1rem'
    },
    button: {
      padding: '10px',
      backgroundColor: 'rgb(45, 45, 45)',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1rem'
    },
    error: {
      color: 'red',
      marginTop: '10px'
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '8.5px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '1rem',
      backgroundColor: 'white'
    },
    fileupload: {
      display: 'none', // Hide the default file input
    },
    icon: {
      marginRight: '8px', // Space between icon and text
      width: '24px', // Adjust size as needed
      height: '24px', // Adjust size as needed
    },
  };

  return (
    <div>
      {/* Header */}
      <Header/>
      <div style={styles.container}>
      <h2 style={styles.heading}>Register</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <label style={styles.label}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={styles.fileupload}
        />
        <ImageUp style={styles.icon} />
        <span style={styles.text}>Upload Profile Picture</span>
      </label>
        <button type="submit" style={styles.button}>Register</button>
      </form>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
    </div>
    </div>
    
  );
}

export default Register;
