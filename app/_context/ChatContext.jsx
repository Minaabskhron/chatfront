"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getSocket } from "../_utils/socket";

//1-asm alcontext capital
const ChatContext = createContext();

//2-asm alprovider capital
const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  // const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [typingUsers, setTypingUsers] = useState({});
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.accessToken;
  const { username, name, _id: currentUserId } = session?.user || "";
  const isTyping = useMemo(
    () => Boolean(typingUsers[receiverId]),
    [typingUsers, receiverId]
  );
  const [conversations, setConversations] = useState([]);
  const [user, setUser] = useState("");
  const [msg, setMsg] = useState("");

  const messagesEndRef = useRef(null);

  // 1. init socket once
  const socket = getSocket();

  useEffect(() => {
    if (!socket || !currentUserId) return;
    // 2. whenever we have a userId, join that room

    socket.emit("join", currentUserId);
    return () => {
      socket.emit("leave", currentUserId); // Only if you support leave logic
    };
    // if you're chatting with someone, join their room too
  }, [socket, currentUserId]);

  useEffect(() => {
    const fetchMsg = async () => {
      try {
        if (status === "unauthenticated") {
          router.push("/signin");
          return;
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/api/v1/message/getConversation/${receiverId}`,
          {
            headers: {
              token,
            },
          }
        );
        const data = await res.json();
        setMessages(data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    if (receiverId) fetchMsg();
  }, [token, status, receiverId]);

  useEffect(() => {
    // Typing
    socket.on("typing", ({ senderId }) => {
      setTypingUsers((t) => ({ ...t, [senderId]: true }));
    });
    socket.on("stop-typing", ({ senderId }) => {
      setTypingUsers((t) => ({ ...t, [senderId]: false }));
    });

    // Clean up
    return () => {
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("new-message", ({ populatedMessage }) => {
      setMessages((prev) => [...prev, populatedMessage]);
    });
    socket.on("message-error", (errMsg) => {
      console.error("Socket error:", errMsg);
    });
    return () => {
      socket.off("new-message");
      socket.off("message-error");
    };
  }, [socket, setMessages]);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        if (status === "unauthenticated") {
          router.push("/signin");
          return;
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/api/v1/conversation`,
          {
            headers: {
              token,
            },
          }
        );
        const data = await res.json();

        setConversations(data.processedConversations);
      } catch (error) {
        console.log(error);
      }
    };
    if (status === "authenticated") fetchConversation();
  }, [token, status, router, messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      // Scroll so that the dummy <div ref={messagesEndRef} /> is visible
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMsg = async () => {
    try {
      if (!msg.trim() || !receiverId) return;

      socket.emit("send-message", {
        senderId: session.user._id,
        receiverId,
        text: msg,
      });

      socket.emit("stop-typing", {
        senderId: session.user._id,
        receiverId,
      });
      setMsg("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (!receiverId) {
      setUser(null);
      return;
    }

    let canceled = false;

    const getUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/api/v1/user/getuser/${receiverId}`
        );
        const data = await res.json();
        if (!canceled) {
          setUser(data.user || null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        if (!canceled) {
          setUser(null);
        }
      }
    };
    getUser();
  }, [receiverId]);

  useEffect(() => {
    if (!socket || !receiverId) return;

    const handleUserOnline = ({ userId }) => {
      if (userId === receiverId) {
        // Mark them online in the UI
        setUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            isOnline: true,
            lastSeen: null, // clear lastSeen when they’re live
          };
        });
      }
    };

    const handleUserOffline = ({ userId, lastSeen }) => {
      if (userId === receiverId) {
        // Mark them offline and set the lastSeen timestamp
        setUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            isOnline: false,
            lastSeen, // the ISO string from server
          };
        });
      }
    };

    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserOffline);

    return () => {
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);
    };
  }, [socket, receiverId]);

  //hna allogic
  return (
    //hna alvalues aly 3aizen ntl3ha
    <ChatContext.Provider
      value={{
        socket,
        receiverId,
        messages,
        isTyping,
        setReceiverId,
        token,
        name,
        username,
        conversations,
        user,
        sendMsg,
        messagesEndRef,
        currentUserId,
        msg,
        setMsg,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

//3- asm alfunction aly htgeb mnha alvalues
const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined)
    throw new Error("context used outside of the provider");
  return context;
};

//bn7ot alprovider w alfunction bta3t alvalues
export { ChatProvider, useChat };
