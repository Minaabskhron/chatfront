"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Conversation from "./Conversation.jsx";
import UserSearch from "./userSearch.jsx";

const SideBar = ({ setReceiverId, messages }) => {
  const [conversations, setConversations] = useState([]);
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.accessToken || "";
  const { username, name } = session?.user || "";

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

  return (
    <div className="">
      <div className="mb-10">
        <h2 className="font-bold text-lg mb-1">{name}</h2>
        <h3>@{username}</h3>
      </div>
      <UserSearch setReceiverId={setReceiverId} token={token} />
      {conversations?.length === 0 ? (
        <p>there is no conversations yet</p>
      ) : (
        <div>
          {conversations?.map((conversation) => (
            <div key={conversation._id}>
              <Conversation
                setReceiverId={setReceiverId}
                conversation={conversation}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SideBar;
