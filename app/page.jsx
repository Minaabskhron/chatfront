"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SideBar from "./component/SideBar";
import ChatArea from "./component/ChatArea";
import { getSocket } from "./_utils/socket";
import BackButton from "./_svg/BackButton";

const page = () => {
  const [messages, setMessages] = useState([]);
  // const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [typingUsers, setTypingUsers] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  // 1. init socket once
  const socket = getSocket();
  const currentUserId = session?.user?._id;

  useEffect(() => {
    // 2. whenever we have a userId, join that room
    if (socket && currentUserId) {
      socket.emit("join", currentUserId);
    }
    // if you're chatting with someone, join their room too
  }, [socket, currentUserId, receiverId]);

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
      } catch (error) {
        console.log(error);
      }
    };
    if (receiverId) fetchMsg();
  }, [token, status, receiverId]);

  // useEffect(() => {
  //   const getAllUsers = async () => {
  //     try {
  //       const res = await fetch(
  //         `${process.env.NEXT_PUBLIC_BASEURL}/api/v1/user/getAllUsers`,
  //         {
  //           headers: {
  //             token,
  //           },
  //         }
  //       );
  //       const data = await res.json();
  //       setUsers(data.users);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getAllUsers();
  // }, [token, status]);

  useEffect(() => {
    // Typing
    socket.on("typing", ({ senderId }) => {
      setTypingUsers((t) => ({ ...t, [senderId]: true }));
    });
    socket.on("stop-typing", ({ senderId }) => {
      setTypingUsers((t) => ({ ...t, [senderId]: false }));
    });

    // Clean up
    return () => {
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [socket]);

  return (
    <>
      <div className="h-[calc(100dvh-52px)] px-10 py-5 bg-blue-400">
        <div className="sm:grid sm:grid-cols-[300px_1fr] h-full sm:gap-5">
          <div
            className={
              receiverId
                ? `bg-white p-4 mb-3 rounded-2xl hidden sm:block h-full`
                : `bg-white p-4 mb-3 rounded-2xl block h-full`
            }
          >
            <SideBar setReceiverId={setReceiverId} messages={messages} />
          </div>

          <div className={receiverId ? "block h-full" : "hidden sm:block"}>
            <ChatArea
              receiverId={receiverId}
              messages={messages}
              token={token}
              setMessages={setMessages}
              socket={socket}
              setReceiverId={setReceiverId}
              isTyping={Boolean(typingUsers[receiverId])}
            />
          </div>

          {/* <div>
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
          </div> */}
        </div>
      </div>
    </>
  );
};

export default page;
