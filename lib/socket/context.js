import { createContext, useContext } from "react";

export const SocketContext = createContext({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);
