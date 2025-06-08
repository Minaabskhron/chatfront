"use client";

import Conversation from "./Conversation.jsx";
import UserSearch from "./userSearch.jsx";
import { useChat } from "../_context/ChatContext.jsx";
import SignUpSignIn from "./SignUpSignIn.jsx";

const SideBar = () => {
  const { setReceiverId, receiverId, token, name, username, conversations } =
    useChat();

  const sidebarClass = `bg-white p-4 rounded-2xl h-full ${
    receiverId ? "hidden sm:block" : "block"
  }`;

  return (
    <div className={sidebarClass}>
      <div className="flex gap-3">
        <SignUpSignIn />
        <div>
          <h2 className="font-bold text-lg mb-1">{name}</h2>
          <h3>@{username}</h3>
        </div>
      </div>
      <UserSearch setReceiverId={setReceiverId} token={token} />
      {conversations?.length === 0 ? (
        <p>there is no conversations yet</p>
      ) : (
        <div>
          {conversations?.map((conversation) => (
            <Conversation
              setReceiverId={setReceiverId}
              conversation={conversation}
              key={conversation._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SideBar;
