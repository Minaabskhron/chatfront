"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { baseUrl } from "../_utils/const.js";
import Searchglasses from "../_svg/Searchglasses.jsx";
import Conversation from "./Conversation.jsx";

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
        const res = await fetch(`${baseUrl}/api/v1/conversation`, {
          headers: {
            token,
          },
        });
        const data = await res.json();

        setConversations(data.processedConversations);
      } catch (error) {
        console.log(error);
      }
    };
    if (status === "authenticated") fetchConversation();
  }, [token, status, router, messages]);

  return (
    <div>
      <div className="mb-10">
        <h2 className="font-bold text-lg mb-1">{name}</h2>
        <h3>@{username}</h3>
      </div>
      <div className="relative">
        <input
          type="text"
          name=""
          id=""
          className=" rounded-2xl ps-8 py-1 mb-10 bg-gray-200 focus:outline-none"
          placeholder="Search..."
        />
        <Searchglasses classes={"absolute top-[5px] left-2"} />
      </div>

      {conversations.length === 0 ? (
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
