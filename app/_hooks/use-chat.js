"use client";
import { useEffect } from "react";
import { useSocket } from "@/lib/socket/context";

export const useChat = (receiverId, setMessages) => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !receiverId) return;

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket, isConnected, receiverId, setMessages]);
};
