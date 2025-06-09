"use client";
import { useEffect, useState } from "react";
import { formatDate } from "../_utils/formatDate.js";
import SentSvg from "../_svg/SentSvg.jsx";
import DeliveredSvg from "../_svg/DeliveredSvg.jsx";
import { useChat } from "../_context/ChatContext.jsx";
import ReadSvg from "../_svg/ReadSvg.jsx";

const Conversation = ({ conversation }) => {
  const { setReceiverId, receiverId, setConversationId, currentUserId } =
    useChat();
  const [displayTime, setDisplayTime] = useState(
    formatDate(conversation?.lastMessage?.createdAt)
  );
  useEffect(() => {
    setDisplayTime(formatDate(conversation?.lastMessage?.createdAt));
  }, [conversation?.lastMessage?.createdAt]);

  return (
    <div
      className={`border-y-1 border-y-gray-200 p-2 rounded-xl ${
        receiverId === conversation.receiver._id && "bg-gray-200"
      }`}
    >
      <div
        onClick={() => {
          setReceiverId(conversation.receiver._id);
          setConversationId(conversation._id);
        }}
        className="cursor-pointer"
      >
        <div className="flex justify-between">
          <h3> {conversation.receiver.name}</h3>
          <p className="text-gray-400">{displayTime}</p>
        </div>
        <div className="flex items-center gap-1">
          {conversation.lastMessage.sender._id === currentUserId && (
            <>
              <span>
                {conversation.lastMessage.status === "sent" && <SentSvg />}
              </span>
              <span>
                {conversation.lastMessage.status === "delivered" && (
                  <DeliveredSvg />
                )}
              </span>
              <span>
                {conversation.lastMessage.status === "seen" && <ReadSvg />}
              </span>
            </>
          )}
          <p>{conversation?.lastMessage?.text.slice(0, 30) || ""}</p>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
