"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { Search, UserCircle, MessageSquare } from "lucide-react"

const ChatOngoingList = ({ selectUser, socket, onlineUsers, selectedUser }) => {
  const [chats, setChats] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const user = useSelector((state) => state.auth.userData)
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  useEffect(() => {
    if (!user) return

    const fetchOngoingChats = async () => {
      try {
        setIsLoading(true)
        const res = await axios.post(
          `${API_URL}/chat/ongoing-chats`,
          { userId: user._id },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          },
        )

        setChats(res.data)
      } catch (error) {
        console.error("Error fetching ongoing chats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOngoingChats()

    if (socket) {
      socket.on("receiveMessage", () => {
        fetchOngoingChats() // Refresh chat list when a new message arrives
      })

      socket.on("chatInitiated", () => {
        fetchOngoingChats() // Refresh when a new chat is initiated
      })
    }

    return () => {
      if (socket) {
        socket.off("receiveMessage")
        socket.off("chatInitiated")
      }
    }
  }, [user, socket])

  const filteredChats = chats.filter(
    (chat) =>
      chat.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.username?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-center">
              {searchTerm ? "No conversations match your search" : "No conversations yet. Start chatting with someone!"}
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredChats.map((chat) => {
              const isOnline = onlineUsers.includes(chat._id)
              const isSelected = selectedUser && selectedUser._id === chat._id

              return (
                <li
                  key={chat._id}
                  onClick={() => selectUser(chat)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected ? "bg-blue-100 border-blue-300" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="relative mr-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserCircle className="w-8 h-8 text-blue-600" />
                      </div>
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{chat.fullname || chat.username}</p>
                      <p className="text-sm text-gray-500 truncate">@{chat.username}</p>
                    </div>
                    {isOnline && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Online
                      </span>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ChatOngoingList

