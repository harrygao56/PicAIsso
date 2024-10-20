let socket = null;
let reconnectInterval = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export const connectWebSocket = (token, onMessageReceived, onConnectionStatus) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log('WebSocket already connected');
    onConnectionStatus(true);
    return socket;
  }

  socket = new WebSocket(`ws://localhost:8000/ws/${token}`);

  socket.onopen = () => {
    console.log('WebSocket connection established');
    onConnectionStatus(true);
    clearInterval(reconnectInterval);
    reconnectAttempts = 0;
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    onMessageReceived(message);
  };

  socket.onclose = (event) => {
    console.log('WebSocket connection closed', event.reason);
    onConnectionStatus(false);
    socket = null;

    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      const timeout = Math.min(1000 * 2 ** reconnectAttempts, 30000);
      reconnectInterval = setTimeout(() => {
        console.log(`Attempting to reconnect (${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})...`);
        connectWebSocket(token, onMessageReceived, onConnectionStatus);
        reconnectAttempts++;
      }, timeout);
    } else {
      console.error('Max reconnection attempts reached. Please refresh the page.');
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return socket;
};

export const sendWebSocketMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.error('WebSocket is not connected. Message not sent:', message);
  }
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
  if (reconnectInterval) {
    clearTimeout(reconnectInterval);
  }
  reconnectAttempts = 0;
};
