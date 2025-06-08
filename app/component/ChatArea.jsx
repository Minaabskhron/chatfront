"use client";

import React, { useMemo, useRef } from "react";
import { formatDate, formatTime } from "../_utils/formatDate.js";
import MessageBubble from "./MessageBubble.jsx";
import debounce from "lodash.debounce";
import BackButton from "../_svg/BackButton.jsx";
import TypingSvg from "../_svg/TypingSvg.jsx";
import { useChat } from "../_context/ChatContext.jsx";

const ChatArea = React.memo(function ChatArea() {
  const {
    isTyping,
    messages,
    receiverId,
    socket,
    setReceiverId,
    username,
    user,
    sendMsg,
    messagesEndRef,
    currentUserId,
    msg,
    setMsg,
  } = useChat();

  const typingTimerRef = useRef(null);

  const renderedMessages = useMemo(() => {
    if (!receiverId) return null;

    return messages.map((message) => {
      const isSender = message?.sender?.username === username;

      const time = formatTime(message.createdAt);
      return (
        <MessageBubble
          time={time}
          isSender={isSender}
          text={message.text}
          key={message._id}
          status={message.status}
        />
      );
    });
  }, [messages, username, receiverId]);

  const emitTyping = useRef(
    debounce((senderId, receiverId) => {
      socket.emit("typing", { senderId, receiverId });
    }, 300)
  ).current;

  return (
    <div className={receiverId ? "block h-full" : "hidden sm:block"}>
      <div className="flex flex-col justify-between gap-5 h-full">
        <div>
          <div className="bg-white py-2 rounded-2xl mb-2 px-2">
            <div className="flex gap-2  items-center">
              <div
                className="sm:hidden"
                onClick={() => {
                  setReceiverId(null);
                }}
              >
                <BackButton />
              </div>
              <div>
                {receiverId && (
                  <div className="flex gap-2">
                    <span className="bg-black text-white py-2 px-3 cursor-pointer sm ms-1 rounded-full">
                      {user?.name[0].toUpperCase()}
                    </span>

                    <div>
                      <h2>{user?.name || "messages"}</h2>
                      <p className="text-xs text-gray-400">
                        {receiverId
                          ? user?.isOnline
                            ? "Online"
                            : `Last seen ${formatDate(user?.lastSeen)}`
                          : ""}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {messages?.length === 0 ? (
            <p>there is no messages yet</p>
          ) : (
            <div
              className="overflow-y-auto pe-2 max-h-[calc(100vh-180px)]"
              key={receiverId}
            >
              {renderedMessages}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <div>
          <div className="h-[20px]">
            {isTyping && (
              <div className="mb-3">
                <TypingSvg />
              </div>
            )}
          </div>
          {receiverId ? (
            <div className="flex items-center gap-1 w-full mb-3 sticky bottom-0">
              <input
                type="text"
                value={msg}
                onChange={(e) => {
                  setMsg(e.target.value);

                  if (socket && currentUserId && receiverId) {
                    emitTyping(currentUserId, receiverId);
                    clearTimeout(typingTimerRef.current);
                    typingTimerRef.current = setTimeout(() => {
                      socket.emit("stop-typing", {
                        senderId: currentUserId,
                        receiverId,
                      });
                    }, 1000);
                  }
                }}
                onBlur={() => {
                  if (socket && currentUserId && receiverId) {
                    socket.emit("stop-typing", {
                      senderId: currentUserId,
                      receiverId,
                    });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMsg();
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
    </div>
  );
});

export default ChatArea;
