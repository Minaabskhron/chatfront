"use client";

import { useEffect, useState, useContext } from "react";
import { SocketContext } from "../lib/socket/context";
import { initializeSocket } from "../lib/socket/client";

export const SocketProvider = ({ children, token }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const socketClient = initializeSocket(token);
    setSocket(socketClient);

    const onConnect = () => {
      setIsConnected(true);
      console.log("Socket connected");
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    };

    const onConnectError = (err) => {
      console.error("Connection error:", err.message);
    };

    socketClient.on("connect", onConnect);
    socketClient.on("disconnect", onDisconnect);
    socketClient.on("connect_error", onConnectError);

    socketClient.connect();

    return () => {
      socketClient.off("connect", onConnect);
      socketClient.off("disconnect", onDisconnect);
      socketClient.off("connect_error", onConnectError);
      socketClient.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
