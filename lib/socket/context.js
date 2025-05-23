import { createContext, useContext } from "react";

export const SocketContext = createContext({
  socket: null,
  isConnected: false,
  isError: false,
  error: null,
  resetSocket: () => {},
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
