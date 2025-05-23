"use client";
import { SocketProvider } from "@/providers/socketProviders";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const ClientLayout = ({ children }) => {
  return (
    <SessionProvider>
      <SocketProviderWrapper>{children}</SocketProviderWrapper>
    </SessionProvider>
  );
};

const SocketProviderWrapper = ({ children }) => {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || status === "loading") return null;

  return (
    <SocketProvider token={session?.accessToken || ""}>
      <div className="flex-1 w-full">{children}</div>
    </SocketProvider>
  );
};

export default ClientLayout;
