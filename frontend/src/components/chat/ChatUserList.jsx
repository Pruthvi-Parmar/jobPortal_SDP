import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const ChatUserList = ({ selectUser }) => {
  const user = useSelector((state) => state.auth.userData);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.post(
          `http://localhost:8001/v1/chat/users`,
          { userId: user._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [user._id]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      {users.length === 0 ? (
        <p className="text-gray-500">No users available</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user._id}
              onClick={() => selectUser(user)}
              className="p-2 bg-white rounded-lg shadow-md cursor-pointer hover:bg-blue-100"
            >
              <p className="font-medium">{user.fullname}</p>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatUserList;
