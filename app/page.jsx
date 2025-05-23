"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SideBar from "./component/SideBar";
import ChatArea from "./component/ChatArea";
import { useSocket } from "@/lib/socket/context.js";

const page = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const { socket } = useSocket();

  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.accessToken;

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

        if (socket && receiverId) {
          socket.emit("join-conversations", [receiverId]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (receiverId) fetchMsg();
  }, [token, status, receiverId, socket]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/api/v1/user/getAllUsers`,
          {
            headers: {
              token,
            },
          }
        );
        const data = await res.json();
        setUsers(data.users);
      } catch (error) {
        console.log(error);
      }
    };
    getAllUsers();
  }, [token, status]);

  return (
    <>
      <div className=" h-screen p-10 bg-blue-400">
        <div className="grid grid-cols-[300px_1fr_200px] mt-10 h-full gap-5">
          <SideBar setReceiverId={setReceiverId} messages={messages} />
          <ChatArea
            receiverId={receiverId}
            messages={messages}
            token={token}
            setMessages={setMessages}
          />
          <div>
            <h2>users</h2>
            <div>
              {users?.length === 0 ? (
                <p>there is no users</p>
              ) : (
                <div>
                  {users?.map((user) => (
                    <div key={user._id}>
                      <p
                        onClick={() => {
                          setReceiverId(user._id);
                        }}
                        className="cursor-pointer"
                      >
                        {user.username}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
