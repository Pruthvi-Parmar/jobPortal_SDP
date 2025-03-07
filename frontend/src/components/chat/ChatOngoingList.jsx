import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { toast } from "sonner";

const socket = io("http://localhost:8001"); // Connect to Socket.IO server

const OngoingChats = () => {
  const [chats, setChats] = useState([]);
  const user = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (!user) return;

    const fetchOngoingChats = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8001/v1/chat/ongoing-chats",
          { userId: user._id },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          }
        );

        setChats(res.data);
      } catch (error) {
        console.error("Error fetching ongoing chats:", error);
        toast.error("Failed to load ongoing chats.");
      }
    };

    fetchOngoingChats();

    socket.on("newChat", ({ chatWith }) => {
      fetchOngoingChats(); // Refresh chat list when a new chat starts
    });

    return () => {
      socket.off("newChat");
    };
  }, [user]);

  return (
    <div className="p-4 bg-white shadow-lg rounded-md w-full h-auto flex flex-col">
      <h2 className="text-lg font-bold mb-4">Ongoing Chats</h2>

      {/* Ensure scrollability */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300">
        {chats.length > 0 ? (
          <ul>
            {chats.map((chat) => (
              <li key={chat._id} className="py-2 border-b">
                <p className="text-gray-800 font-semibold">{chat.fullname}</p>
                <p className="text-gray-600 text-sm">{chat.email}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No ongoing chats yet.</p>
        )}
      </div>
    </div>
  );
};

export default OngoingChats;
