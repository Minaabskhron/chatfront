import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = (token) => {
  if (!token) {
    console.error("InitializeSocket called without token!");
    return null;
  }

  if (!socket || socket.disconnected) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      auth: { token },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      reconnectionDelayMax: 10000,
      randomizationFactor: 0.5,
      transports: ["websocket"],
      withCredentials: true,
      timeout: 15000,
    });

    // Add global error handler
    socket.on("connect_error", (err) => {
      console.error("Connection Error:", err.message);
      if (err.message.includes("auth")) {
        localStorage.removeItem("token");
      }
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) throw new Error("Socket not initialized");
  return socket;
};

export const resetSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
