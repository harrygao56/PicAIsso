import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { connectWebSocket, sendWebSocketMessage, closeWebSocket } from '../utils/websocket';

// Custom Hook
const useMessages = () => {
  const [people, setPeople] = useState([]);
  const [messageMap, setMessageMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/messages', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const messages = response.data;

      const messageMap = new Map();
      const currentUser = localStorage.getItem('username');

      messages.forEach((message) => {
        const { sender, recipient } = message;
        const otherPerson = sender.username === currentUser ? recipient : sender;

        if (!messageMap.has(otherPerson.username)) {
          messageMap.set(otherPerson.username, []);
        }
        messageMap.get(otherPerson.username).push(message);
      });

      const sortedPeople = [...messageMap.entries()]
        .sort((a, b) => {
          const latestMessageA = a[1][a[1].length - 1];
          const latestMessageB = b[1][b[1].length - 1];
          return new Date(latestMessageB.timestamp) - new Date(latestMessageA.timestamp);
        })
        .map(entry => entry[0]);

      setPeople(sortedPeople);
      setMessageMap(Object.fromEntries(messageMap));
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch messages');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found');
      return;
    }

    const handleMessageReceived = (message) => {
      console.log('Received message:', message);
      setMessageMap(prevMap => {
        const newMap = { ...prevMap };
        const otherUser = message.sender.username === localStorage.getItem('username') ? message.recipient.username : message.sender.username;
        if (!newMap[otherUser]) {
          newMap[otherUser] = [];
        }
        newMap[otherUser].push({
          ...message,
          sender: {
            username: message.sender.username,
            // Include other sender properties as needed
          },
          recipient: {
            username: message.recipient.username,
            // Include other recipient properties as needed
          }
        });
        return newMap;
      });

      setPeople(prevPeople => {
        const otherUser = message.sender.username === localStorage.getItem('username') ? message.recipient.username : message.sender.username;
        if (!prevPeople.includes(otherUser)) {
          return [otherUser, ...prevPeople];
        }
        return prevPeople;
      });
    };

    const handleConnectionStatus = (status) => {
      setIsConnected(status);
    };

    const socket = connectWebSocket(token, handleMessageReceived, handleConnectionStatus);

    return () => {
      closeWebSocket();
    };
  }, [fetchMessages]);

  const sendMessage = useCallback(async (recipient, content) => {
    if (isConnected) {
      sendWebSocketMessage({ recipient, content });
    } else {
      console.warn('WebSocket is not connected. Falling back to HTTP request.');
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:8000/messages', 
          { recipient_username: recipient, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Optionally, you can update the local state here to show the sent message immediately
        setMessageMap(prevMap => {
          const newMap = { ...prevMap };
          if (!newMap[recipient]) {
            newMap[recipient] = [];
          }
          newMap[recipient].push({
            sender: { username: localStorage.getItem('username') },
            recipient: { username: recipient },
            content,
            timestamp: new Date().toISOString()
          });
          return newMap;
        });
      } catch (error) {
        console.error('Failed to send message:', error);
        setError('Failed to send message. Please try again.');
      }
    }
  }, [isConnected]);

  return { people, messageMap, loading, error, sendMessage, refetchMessages: fetchMessages, isConnected };
};

export default useMessages;
