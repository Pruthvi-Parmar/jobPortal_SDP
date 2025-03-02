import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const ChatOngoingList = ({ selectUser, socket }) => {
  const user = useSelector((state) => state.auth.userData);
  const [ongoingChats, setOngoingChats] = useState([]);

  const fetchOngoingChats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(`http://localhost:8001/v1/chat/ongoing-chats`, 
      { userId: user._id },{
        headers: { Authorization: `Bearer ${token}` },
      });
      setOngoingChats(data);
    } catch (error) {
      console.error("Error fetching ongoing chats:", error);
    }
  };

  useEffect(() => {
    fetchOngoingChats();

    if (socket) {
      // When a new chat is initiated, refresh the ongoing chats list.
      socket.on("chatInitiated", () => {
        fetchOngoingChats();
      });
    }

    return () => {
      if (socket) {
        socket.off("chatInitiated");
      }
    };
  }, [socket]);

  return (
    <div>
      {ongoingChats.length === 0 ? (
        <p className="text-gray-500">No ongoing chats</p>
      ) : (
        <ul className="space-y-2">
          {ongoingChats.map((chatUser) => (
            <li
              key={chatUser._id}
              onClick={() => selectUser(chatUser)}
              className="p-2 bg-white rounded-lg shadow-md cursor-pointer hover:bg-blue-100"
            >
              <p className="font-medium">{chatUser.fullname}</p>
              <p className="text-sm text-gray-500">@{chatUser.username}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatOngoingList;
