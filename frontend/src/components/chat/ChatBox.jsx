import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const ChatBox = ({ selectedUser }) => {
    const user = useSelector((state) => state.auth.userData);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const socket = io("http://localhost:8001"); // Socket server URL

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.get(`http://localhost:8001/v1/chat/${selectedUser._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(data);
        
        setMessages(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, [selectedUser]);

  useEffect(() => {
    socket.emit("registerUser", { userId: selectedUser._id });

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => socket.disconnect();
  }, [selectedUser]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(
        `http://localhost:8001/v1/chat`,
        { receiverId: selectedUser._id, message,userId : user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(data);
      

      setMessages([...messages, data]);
      socket.emit("sendMessage", data);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md flex flex-col">
      <h2 className="text-lg font-semibold">{selectedUser.fullname}</h2>
      <div className="flex-1 overflow-y-auto bg-gray-50 p-2">
      {messages.map((msg, index) => (
  <div key={msg._id || `msg-${index}`} className={`p-2 my-1 rounded-md ${msg.senderId === selectedUser._id ? "bg-blue-100" : "bg-gray-200"}`}>
    {msg.message}
  </div>
))}

      </div>
      <div className="mt-2 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded-md"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-md">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
