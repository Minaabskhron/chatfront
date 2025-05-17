"use client";

import { useState } from "react";
import { baseUrl } from "../_utils/const.js";

const ChatArea = ({ receiverId, messages, token, setMessages }) => {
  const [msg, setMsg] = useState("");

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

  return (
    <div>
      <div>
        <h2>Messages</h2>
        {!receiverId ? (
          <p>there is no messages yet</p>
        ) : (
          <div>
            {messages?.map((message) => (
              <div key={message?._id} className="flex gap-5">
                <p>{message?.text}</p>
                <p>{message?.sender.username}</p>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1 bottom-0 absolute mb-10">
          <input
            type="text"
            name=""
            id=""
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="border rounded-2xl ps-2 py-0.5"
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
