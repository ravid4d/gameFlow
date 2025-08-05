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
