"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { formatDate, formatTime } from "../_utils/formatDate.js";
import TypingSvg from "../_svg/TypingSvg.jsx";

const ChatArea = ({ receiverId, messages, setMessages, socket, isTyping }) => {
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState("");
  const { data: session } = useSession();
  const { username } = session?.user || "";
  let typingTimer;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      // Scroll so that the dummy <div ref={messagesEndRef} /> is visible
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

    const getUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/api/v1/user/getuser/${receiverId}`
        );
        const user = await res.json();
        setUser(user.user);
      } catch (error) {
        console.error("Error fetching user:", err);
        setUser(null);
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

  return (
    <div className="flex flex-col justify-between gap-5 h-full">
      <div>
        <div className="bg-white py-2 rounded-2xl mb-2 px-2">
          <h2>{user?.name || "messages"}</h2>
          <p className="text-xs text-gray-400">
            {receiverId
              ? user?.isOnline
                ? "Online"
                : `Last seen ${formatDate(user?.lastSeen)}`
              : ""}
          </p>
        </div>
        {messages.length === 0 ? (
          <p>there is no messages yet</p>
        ) : (
          <div className="overflow-y-auto pe-2 max-h-[calc(100vh-225px)]">
            {receiverId
              ? messages?.map((message) => {
                  const isSender = message?.sender?.username === username;

                  const time = formatTime(message.createdAt);

                  return (
                    <div
                      key={message?._id}
                      className={`flex ${
                        isSender ? "justify-end" : "justify-start"
                      } mb-2`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-xs break-words ${
                          isSender
                            ? "bg-emerald-400 rounded-br-none"
                            : "bg-white  rounded-bl-none"
                        }`}
                      >
                        <p>{message?.text}</p>
                        <span className="text-xs text-gray-700 block mt-1 text-right">
                          {time}
                        </span>
                      </div>
                    </div>
                  );
                })
              : ""}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div>
        <div>
          {isTyping ? (
            <div className="mb-3">
              <TypingSvg />
            </div>
          ) : (
            ""
          )}
        </div>
        {receiverId ? (
          <div className="flex items-center gap-1 w-full mb-3 sticky bottom-0">
            <input
              type="text"
              name=""
              id=""
              value={msg}
              onChange={(e) => {
                setMsg(e.target.value);

                if (socket && session?.user?._id && receiverId) {
                  socket.emit("typing", {
                    senderId: session.user._id,
                    receiverId,
                  });
                  clearTimeout(typingTimer);
                  typingTimer = setTimeout(() => {
                    socket.emit("stop-typing", {
                      senderId: session.user._id,
                      receiverId,
                    });
                  }, 1000);
                }
              }}
              onBlur={() => {
                if (socket && session?.user?._id && receiverId) {
                  socket.emit("stop-typing", {
                    senderId: session.user._id,
                    receiverId,
                  });
                }
              }}
              className="border bg-white rounded-2xl ps-2 py-1 w-full"
              placeholder="type your message"
            />
            <button
              className="cursor-pointer bg-gray-400 rounded-full px-1 py-1"
              onClick={sendMsg}
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </div>
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ChatArea;
