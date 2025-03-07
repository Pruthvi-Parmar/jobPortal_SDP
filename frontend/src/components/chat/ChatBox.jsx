import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { UserCircle } from "lucide-react";

const ChatBox = ({ selectedUser, socket }) => {
  const user = useSelector((state) => state.auth.userData);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.get(
          `http://localhost:8001/v1/chat/${selectedUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, [selectedUser]);

  useEffect(() => {
    if (socket) {
      socket.emit("registerUser", { userId: user._id });

      socket.on("receiveMessage", (newMessage) => {
        if (
          (newMessage.senderId === user._id && newMessage.receiverId === selectedUser._id) ||
          (newMessage.senderId === selectedUser._id && newMessage.receiverId === user._id)
        ) {
          setMessages((prev) => [...prev, newMessage]);
        }
      });
    }
    return () => {
      if (socket) socket.off("receiveMessage");
    };
  }, [selectedUser, socket, user._id]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(
        `http://localhost:8001/v1/chat`,
        { receiverId: selectedUser._id, message, userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([...messages, data]);
      if (socket) socket.emit("sendMessage", data);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 bg-blue-600 text-white shadow-md">
        {/* User Icon */}
        <UserCircle className="w-8 h-8 text-white" />

        {/* Username */}
        <h2 className="font-semibold text-lg">{selectedUser.username}</h2>
      </div>

      {/* Chat Messages (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg, index) => (
          <div
            key={msg._id || `msg-${index}`}
            className={`p-2 w-fit max-w-xs rounded-lg ${msg.senderId === selectedUser._id ? "bg-blue-100 self-start" : "bg-gray-200 self-end"
              }`}
          >
            {msg.message}
          </div>
        ))}
      </div>

      {/* Chat Input (Fixed at Bottom) */}
      <div className="sticky bottom-0 bg-white border-t p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border rounded-md focus:outline-none"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
