import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { Search, UserCircle } from "lucide-react"

const ChatUserList = ({ selectUser, onlineUsers, selectedUser }) => {
  const user = useSelector((state) => state.auth.userData)
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("accessToken")
        const { data } = await axios.post(
          `${API_URL}/chat/users`,
          { userId: user._id },
          { headers: { Authorization: `Bearer ${token}` } },
        )
        setUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [user._id])

  const filteredUsers = users.filter(
    (user) =>
      user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()),
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
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "No users match your search" : "No users available"}
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredUsers.map((chatUser) => {
              const isOnline = onlineUsers.includes(chatUser._id)
              const isSelected = selectedUser && selectedUser._id === chatUser._id

              return (
                <li
                  key={chatUser._id}
                  onClick={() => selectUser(chatUser)}
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
                      <p className="font-medium text-gray-900 truncate">{chatUser.fullname || chatUser.username}</p>
                      <p className="text-sm text-gray-500 truncate">@{chatUser.username}</p>
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

export default ChatUserList

