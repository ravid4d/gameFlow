// utils/socketEmitter.js

let ioInstance = null;

export const setSocketInstance = (io) => {
  ioInstance = io;
};

export const createGameList = (event, data) => {
  if (ioInstance) {
    ioInstance.emit(event, data);
  } else {
    console.error('Socket instance is not set');
  }
}

export const updateGameList = (event, data) => {
  if (ioInstance) {
    ioInstance.emit(event, data);
  } else {
    console.error('Socket instance is not set');
  }
}

export const joinGameList = (event, data) => {
  if (ioInstance) {
    ioInstance.emit(event, data); // Emit to all connected clients
  } else {
    console.error('Socket instance is not set');
  }
}
