import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import ChatUserList from "./ChatUserList";
import ChatOngoingList from "./ChatOngoingList";
import ChatBox from "./ChatBox";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8001"); // Connect to socket server
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (User List) */}
      <div className="w-1/3 h-full p-4 bg-gray-100 border-r overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Ongoing Chats</h2>
        <ChatOngoingList selectUser={setSelectedUser} socket={socket} />
        <h2 className="text-xl font-bold mt-6 mb-4">Available Users</h2>
        <ChatUserList selectUser={setSelectedUser} />
      </div>

      {/* ChatBox - Must Fill Remaining Space */}
      <div className="w-2/3 h-full flex">
        {selectedUser ? (
          <ChatBox selectedUser={selectedUser} socket={socket} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
