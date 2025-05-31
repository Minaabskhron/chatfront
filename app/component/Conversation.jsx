import { useEffect, useState } from "react";
import { formatDate } from "../_utils/formatDate.js";

const Conversation = ({ conversation, setReceiverId }) => {
  const [displayTime, setDisplayTime] = useState(
    formatDate(conversation?.lastMessage?.createdAt)
  );
  useEffect(() => {
    setDisplayTime(formatDate(conversation?.lastMessage?.createdAt));
  }, [conversation?.lastMessage?.createdAt]);

  return (
    <div className="border-y-1 border-y-gray-200">
      <div
        onClick={() => {
          setReceiverId(conversation.receiver._id);
        }}
        className="cursor-pointer"
      >
        <div className="flex justify-between">
          <h3> {conversation.receiver.name}</h3>
          <p className="text-gray-400">{displayTime}</p>
        </div>
        <p>{conversation?.lastMessage?.text.slice(0, 30) || ""}</p>
      </div>
    </div>
  );
};

export default Conversation;
