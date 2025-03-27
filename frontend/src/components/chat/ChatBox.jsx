"use client"

import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { Send, UserCircle, Phone, Video, MoreVertical, Clock } from "lucide-react"

const ChatBox = ({ selectedUser, socket, onlineUsers }) => {
  const user = useSelector((state) => state.auth.userData)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const messageInputRef = useRef(null)

  const isOnline = onlineUsers.includes(selectedUser._id)
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("accessToken")
        const { data } = await axios.get(`${API_URL}/chat/${selectedUser._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        // Ensure we have unique messages by ID
        const uniqueMessages = Array.from(new Map(data.map((item) => [item._id, item])).values())
        setMessages(uniqueMessages)
      } catch (error) {
        console.error("Error fetching chat history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChatHistory()

    if (messageInputRef.current) {
      messageInputRef.current.focus()
    }
  }, [selectedUser])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (socket) {
      socket.emit("registerUser", { userId: user._id })

      // Handle receiving messages
      const handleReceiveMessage = (newMessage) => {
        if (
          (newMessage.senderId === user._id && newMessage.receiverId === selectedUser._id) ||
          (newMessage.senderId === selectedUser._id && newMessage.receiverId === user._id)
        ) {
          // Check if message already exists in our state to prevent duplication
          setMessages((prevMessages) => {
            const messageExists = prevMessages.some((msg) => msg._id === newMessage._id)
            if (messageExists) return prevMessages
            return [...prevMessages, newMessage]
          })
        }
      }

      socket.on("receiveMessage", handleReceiveMessage)

      return () => {
        socket.off("receiveMessage", handleReceiveMessage)
      }
    }
  }, [selectedUser, socket, user._id])

  const sendMessage = async (e) => {
    e?.preventDefault()

    if (!message.trim()) return

    try {
      const token = localStorage.getItem("accessToken")
      const { data } = await axios.post(
        `${API_URL}/chat`,
        { receiverId: selectedUser._id, message: message.trim(), userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      // Only update local state, let the socket handle broadcasting
      // This prevents duplication
      setMessages((prev) => [...prev, data])

      // Emit via socket
      if (socket) {
        socket.emit("sendMessage", {
          senderId: user._id,
          receiverId: selectedUser._id,
          message: message.trim(),
          _id: data._id,
          createdAt: data.createdAt,
        })
      }

      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const groupMessagesByDate = () => {
    const groups = {}

    messages.forEach((msg) => {
      const date = new Date(msg.createdAt).toLocaleDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(msg)
    })

    return groups
  }

  const messageGroups = groupMessagesByDate()

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-blue-600" />
            </div>
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">{selectedUser.fullname || selectedUser.username}</h2>
            <p className="text-xs text-gray-500">{isOnline ? "Online" : "Offline"}</p>
          </div>
        </div>

        {/* <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div> */}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          Object.keys(messageGroups).map((date) => (
            <div key={date} className="mb-6">
              <div className="flex justify-center mb-4">
                <div className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              {messageGroups[date].map((msg, index) => {
                const isSender = msg.senderId === user._id
                const time = new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })

                return (
                  <div
                    key={msg._id || `msg-${date}-${index}`}
                    className={`flex mb-4 ${isSender ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%]`}>
                      <div
                        className={`p-3 rounded-lg ${
                          isSender
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                        }`}
                      >
                        {msg.message}
                      </div>
                      <div className={`text-xs mt-1 text-gray-500 ${isSender ? "text-right" : "text-left"}`}>
                        {time}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <input
            ref={messageInputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className={`p-3 rounded-full ${
              message.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            } transition-colors`}
            disabled={!message.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatBox

