import { useState, useEffect } from 'react';
import axios from 'axios';

// Custom Hook
const useMessages = () => {
  const [people, setPeople] = useState([]);
  const [messageMap, setMessageMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Token not found');
        }

        // Fetch the messages from the API with Bearer token authorization
        const response = await axios.get('http://localhost:8000/messages', {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token from local storage
          }
        });

        const messages = response.data;

        // Use a Map to track people you've messaged with
        const messageMap = new Map();
        const currentUser = localStorage.getItem('username');

        messages.forEach((message) => {
          const { sender, recipient } = message;
          console.log(recipient);

          // Determine the "other person" based on whether the current user is the sender or the recipient
          const otherPerson = sender.username === currentUser ? recipient : sender;

          // Initialize the list for the other person if not present
          if (!messageMap.has(otherPerson.username)) {
            messageMap.set(otherPerson.username, []);
          }

          // Add the message to the list for the other person
          messageMap.get(otherPerson.username).push(message);
        });
        console.log(messageMap);

        // Sort people by the timestamp of their most recent message
        const sortedPeople = [...messageMap.entries()]
          .sort((a, b) => {
            const latestMessageA = a[1].reduce((latest, message) => {
              return new Date(message.timestamp) > new Date(latest.timestamp) ? message : latest;
            }, a[1][0]);

            const latestMessageB = b[1].reduce((latest, message) => {
              return new Date(message.timestamp) > new Date(latest.timestamp) ? message : latest;
            }, b[1][0]);

            return new Date(latestMessageB.timestamp) - new Date(latestMessageA.timestamp);
          })
          .map(entry => entry[0]);  // Extract just the usernames after sorting
        console.log(sortedPeople);
        // Convert the Map to an object to use in state
        setPeople(sortedPeople);
        setMessageMap(Object.fromEntries(messageMap));  // Convert Map to a plain object
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch messages');
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const refetchMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Fetch messages again
      const response = await axios.get('http://localhost:8000/messages', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const messages = response.data;

        // Use a Map to track people you've messaged with
        const messageMap = new Map();
        const currentUser = localStorage.getItem('username');

        messages.forEach((message) => {
          const { sender, recipient } = message;
          console.log(recipient);

          // Determine the "other person" based on whether the current user is the sender or the recipient
          const otherPerson = sender.username === currentUser ? recipient : sender;

          // Initialize the list for the other person if not present
          if (!messageMap.has(otherPerson.username)) {
            messageMap.set(otherPerson.username, []);
          }

          // Add the message to the list for the other person
          messageMap.get(otherPerson.username).push(message);
        });
        console.log(messageMap);

        // Sort people by the timestamp of their most recent message
        const sortedPeople = [...messageMap.entries()]
          .sort((a, b) => {
            const latestMessageA = a[1].reduce((latest, message) => {
              return new Date(message.timestamp) > new Date(latest.timestamp) ? message : latest;
            }, a[1][0]);

            const latestMessageB = b[1].reduce((latest, message) => {
              return new Date(message.timestamp) > new Date(latest.timestamp) ? message : latest;
            }, b[1][0]);

            return new Date(latestMessageB.timestamp) - new Date(latestMessageA.timestamp);
          })
          .map(entry => entry[0]);  // Extract just the usernames after sorting
        console.log(sortedPeople);
        // Convert the Map to an object to use in state
        setPeople(sortedPeople);
        setMessageMap(Object.fromEntries(messageMap));  // Convert Map to a plain object
        setLoading(false);
    } catch (error) {
      setError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  return { people, messageMap, loading, error, refetchMessages, setMessageMap };
};

export default useMessages;
