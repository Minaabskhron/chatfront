"use client";
import { SocketProvider } from "@/providers/socketProviders.js";
import { SessionProvider, useSession } from "next-auth/react";

const ClientLayout = ({ children }) => {
  return (
    <SessionProvider>
      <SocketProviderWrapper>{children}</SocketProviderWrapper>
    </SessionProvider>
  );
};

// Separate component that uses the session
const SocketProviderWrapper = ({ children }) => {
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  return <SocketProvider token={token}>{children}</SocketProvider>;
};

export default ClientLayout;
