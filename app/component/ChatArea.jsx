"use client";

import { useEffect, useState } from "react";
import { baseUrl } from "../_utils/const.js";
import { useSession } from "next-auth/react";
import { formatDate, formatTime } from "../_utils/formatDate.js";

const ChatArea = ({ receiverId, messages, setMessages }) => {
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState("");
  const { data: session } = useSession();
  const token = session?.accessToken || "";
  const { username } = session?.user || "";

  const sendMsg = async () => {
    const res = await fetch(`${baseUrl}/api/v1/message/sendmessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({
        text: msg,
        receiverId,
      }),
    });
    const newMessage = await res.json();

    setMessages((prev) => [...prev, newMessage.theMessage]);
    setMsg("");
    // console.log(newMessage);
  };

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(`${baseUrl}/api/v1/user/getuser/${receiverId}`);
      const user = await res.json();
      setUser(user.user);
      console.log(user.user);
    };
    getUser();
  }, [receiverId]);

  return (
    <div>
      <div className="flex flex-col justify-between h-full gap-5">
        <div>
          <div className="bg-white py-2 rounded-2xl mb-2 ps-2">
            <h2>{user?.name || "messages"}</h2>
            <p className="text-xs text-gray-400">
              {user?.isOnline
                ? "Online"
                : `Last seen ${formatDate(user?.lastSeen)}`}
            </p>
          </div>
          {!receiverId ? (
            <p>there is no messages yet</p>
          ) : (
            <div className="overflow-y-auto max-h-[460px] pe-4">
              {messages?.map((message) => {
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
              })}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 w-full mb-3">
          <input
            type="text"
            name=""
            id=""
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
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
      </div>
    </div>
  );
};

export default ChatArea;
