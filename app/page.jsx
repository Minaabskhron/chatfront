"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SideBar from "./component/SideBar";
import ChatArea from "./component/ChatArea";
import { useSocket } from "@/lib/socket/context.js";

const page = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const { socket, isConnected } = useSocket();

  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  const fetchMsg = useCallback(async () => {
    try {
      if (!receiverId && status === "unauthenticated") return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/api/v1/message/getConversation/${receiverId}`,
        {
          headers: {
            token,
          },
        }
      );
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.log(error);
    }
  }, [receiverId, token, status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }
    if (isConnected && receiverId) {
      // Join conversation room
      socket.emit("join-conversations", [receiverId], (response) => {
        if (response.status === "success") {
          fetchMsg();
        }
      });
    }
    return () => {
      if (isConnected && receiverId) {
        socket.emit("leave-conversations", [receiverId]);
      }
    };
  }, [receiverId, isConnected, socket, fetchMessages, status, router]);

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
        setUsers(data.users || []);
      } catch (error) {
        console.log(error);
      }
    };
    if (status === "authenticated") getAllUsers();
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
