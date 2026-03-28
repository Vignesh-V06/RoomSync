import { io } from 'socket.io-client';

// Change URL if backend is hosted elsewhere
const SOCKET_URL = 'http://localhost:5000';

let socket = null;

export const initSocket = (userId) => {
  if (!socket) {
    socket = io(SOCKET_URL);
    if (userId) {
      socket.emit('join_user', userId);
    }
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
