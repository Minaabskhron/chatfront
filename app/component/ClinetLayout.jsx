"use client";
import { SessionProvider } from "next-auth/react";
import { ChatProvider } from "../_context/ChatContext";

const ClientLayout = ({ children }) => {
  return (
    <SessionProvider>
      <ChatProvider>{children}</ChatProvider>
    </SessionProvider>
  );
};

export default ClientLayout;
