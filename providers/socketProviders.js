// components/socket-provider.jsx
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { SocketProvider } from "@/lib/socket/provider";

export function SocketProviderWrapper({ children }) {
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return (
    <SocketProvider token={session?.accessToken}>{children}</SocketProvider>
  );
}
