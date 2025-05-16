"use client";
import { useState, useEffect } from "react";
import { baseUrl } from "./_utils/const";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SideBar from "./component/SideBar";

const page = () => {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState("");

  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  const fetchMsg = async () => {
    try {
      if (status === "unauthenticated") {
        router.push("/signin");
        return;
      }
      const res = await fetch(
        `${baseUrl}/api/v1/message/getConversation/${receiverId}`,
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

  useEffect(() => {
    const fetchMsg = async () => {
      try {
        if (status === "unauthenticated") {
          router.push("/signin");
          return;
        }
        const res = await fetch(
          `${baseUrl}/api/v1/message/getConversation/${receiverId}`,
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
  }, [token, status, messages]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/v1/user/getAllUsers`, {
          headers: {
            token,
          },
        });
        const data = await res.json();
        setUsers(data.users);
      } catch (error) {
        console.log(error);
      }
    };
    getAllUsers();
  }, [token, status]);

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
    <>
      <div className=" h-screen relative">
        <div className="flex gap-5">
          <SideBar setReceiverId={setReceiverId} />
          <div>
            <h2>chats</h2>
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
            <div className="flex items-center gap-1 absolute bottom-0">
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
