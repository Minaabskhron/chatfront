"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { SocketContext } from "../lib/socket/context";
import { initializeSocket, resetSocket } from "../lib/socket/client";

export const SocketProvider = ({ children, token }) => {
  const [connectionState, setConnectionState] = useState("disconnected");
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  const updateState = useCallback((state, error = null) => {
    setConnectionState(state);
    setError(error);
  }, []);

  const handleConnect = useCallback(() => {
    updateState("connected");
    console.log("Socket connected");
  }, [updateState]);

  const handleDisconnect = useCallback(
    (reason) => {
      updateState("disconnected");
      console.log("Socket disconnected:", reason);
    },
    [updateState]
  );

  const handleConnectError = useCallback(
    (err) => {
      updateState("error", err.message);
      console.error("Connection error:", err.message);

      if (err.message.includes("auth")) {
        resetSocket();
        socketRef.current = null;
      }
    },
    [updateState]
  );

  const handleReconnectAttempt = useCallback(
    (attempt) => {
      updateState("reconnecting");
      console.log(`Reconnection attempt #${attempt}`);
    },
    [updateState]
  );

  useEffect(() => {
    if (!token) {
      resetSocket();
      socketRef.current = null;
      return;
    }

    let socketClient;
    try {
      socketClient = initializeSocket(token);
      socketRef.current = socketClient;

      socketClient
        .on("connect", handleConnect)
        .on("disconnect", handleDisconnect)
        .on("connect_error", handleConnectError)
        .on("reconnect_attempt", handleReconnectAttempt);

      if (!socketClient.connected) {
        updateState("connecting");
        socketClient.connect();
      }
    } catch (err) {
      console.error("Socket initialization failed:", err);
      updateState("error", err.message);
    }

    return () => {
      if (socketClient) {
        socketClient
          .off("connect", handleConnect)
          .off("disconnect", handleDisconnect)
          .off("connect_error", handleConnectError)
          .off("reconnect_attempt", handleReconnectAttempt);

        if (socketClient.connected) {
          socketClient.disconnect();
        }
      }
    };
  }, [
    token,
    handleConnect,
    handleDisconnect,
    handleConnectError,
    handleReconnectAttempt,
    updateState,
  ]);

  const value = {
    socket: socketRef.current,
    connectionState, // 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error'
    error,
    resetSocket: useCallback(() => {
      resetSocket();
      socketRef.current = null;
      updateState("disconnected");
    }, [updateState]),
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
