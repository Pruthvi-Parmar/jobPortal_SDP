import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import ChatUserList from "./ChatUserList";
import ChatOngoingList from "./ChatOngoingList";
import ChatBox from "./ChatBox";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8001"); // Socket server URL
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-1/3 p-4 bg-gray-100 border-r overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Ongoing Chats</h2>
        <ChatOngoingList selectUser={setSelectedUser} socket={socket} />
        <h2 className="text-xl font-bold mt-6 mb-4">Available Users</h2>
        <ChatUserList selectUser={setSelectedUser} />
      </div>

      <div className="w-2/3 p-4 flex items-center justify-center">
        {selectedUser ? (
          <ChatBox selectedUser={selectedUser} socket={socket} />
        ) : (
          <p className="text-gray-500">Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
