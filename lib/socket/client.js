import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = (token) => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      auth: {
        token: token,
      },
      autoConnect: false,
      reconnectionAttempts: 3,
      reconnectionDelay: 5000,
      transports: ["websocket"],
    });
  }
  return socket;
};

export const getSocket = () => socket;
