"use client"

import { useState, useEffect } from "react"
import { io } from "socket.io-client"
import ChatUserList from "./ChatUserList"
import ChatOngoingList from "./ChatOngoingList"
import ChatBox from "./ChatBox"
import { MessageSquare, Users, History } from "lucide-react"

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [socket, setSocket] = useState(null)
  const [activeTab, setActiveTab] = useState("ongoing") // "ongoing" or "available"
  const [onlineUsers, setOnlineUsers] = useState([])
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL

  useEffect(() => {
    const newSocket = io("http://localhost:8001")
    // const newSocket = io(`${API_URL}`)
    setSocket(newSocket)

    newSocket.on("updateOnlineUsers", (users) => {
      setOnlineUsers(users)
    })

    newSocket.emit("getOnlineUsers")

    return () => newSocket.disconnect()
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 h-full flex flex-col border-r border-gray-200 bg-white">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
            Messages
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center ${
              activeTab === "ongoing" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("ongoing")}
          >
            <History className="mr-2 h-4 w-4" />
            Conversations
          </button>
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center ${
              activeTab === "available"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("available")}
          >
            <Users className="mr-2 h-4 w-4" />
            All Users
          </button>
        </div>

        {/* User Lists */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "ongoing" ? (
            <ChatOngoingList
              selectUser={setSelectedUser}
              socket={socket}
              onlineUsers={onlineUsers}
              selectedUser={selectedUser}
            />
          ) : (
            <ChatUserList selectUser={setSelectedUser} onlineUsers={onlineUsers} selectedUser={selectedUser} />
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <ChatBox selectedUser={selectedUser} socket={socket} onlineUsers={onlineUsers} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Your Messages</h3>
            <p className="text-gray-500 max-w-sm text-center">
              Select a conversation or start a new one with available users
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat

