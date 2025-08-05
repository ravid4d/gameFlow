import chatSocket from './chatsocket.js';
// import gameSocket from './gameSocket.js';

const registerSockets = (io) => {
  chatSocket(io);
//   gameSocket(io);
};

export default registerSockets;