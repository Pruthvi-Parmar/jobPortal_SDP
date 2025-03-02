import { useState } from "react";
import ChatUserList from "./ChatUserList";
import ChatBox from "./ChatBox";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-screen">
      {/* Sidebar with user list */}
      <div className="w-1/3 p-4 bg-gray-100 border-r">
        <ChatUserList selectUser={setSelectedUser} />
      </div>

      {/* Chatbox for selected user */}
      <div className="w-2/3 p-4 flex items-center justify-center">
        {selectedUser ? (
          <ChatBox selectedUser={selectedUser} />
        ) : (
          <p className="text-gray-500">Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
