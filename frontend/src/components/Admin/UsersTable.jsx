import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, Eye } from "lucide-react";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8001/v1/admin/getalluser", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await fetch("http://localhost:8001/v1/admin/deleteuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ userId }),
        });
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setIsDialogOpen(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-white rounded-md shadow-md mx-auto max-w-4xl">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center border-b-2 border-gray-300 pb-2">
        User Management
      </h2>
      <Table className="w-full border-collapse">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="py-2 text-left">Username</TableHead>
            <TableHead className="py-2 text-left">Email</TableHead>
            <TableHead className="py-2 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user._id}
              className="hover:bg-gray-50 border-b transition duration-300"
            >
              <TableCell className="py-3 px-4">{user.username}</TableCell>
              <TableCell className="py-3 px-4">{user.email}</TableCell>
              <TableCell className="py-3 px-4 text-center flex justify-center gap-3">
                <Button
                  variant="ghost"
                  className="text-blue-500 hover:bg-blue-100 p-2 rounded-full"
                  onClick={() => handleViewUser(user)}
                >
                  <Eye size={18} />
                </Button>

                <Button
                  variant="ghost"
                  className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                  onClick={() => deleteUser(user._id)}
                >
                  <Trash2 size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for User Details */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto break-words">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Detailed information of the selected user.
          </DialogDescription>
          <div className="space-y-2 mt-4">
            {selectedUser?.username && (
              <p>
                <span className="font-semibold">Username:</span>{" "}
                {selectedUser.username}
              </p>
            )}
            {selectedUser?.email && (
              <p>
                <span className="font-semibold">Email:</span> {selectedUser.email}
              </p>
            )}
            {selectedUser?.bio && (
              <p>
                <span className="font-semibold">Bio:</span> {selectedUser.bio}
              </p>
            )}
            {selectedUser?.location && (
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {selectedUser.location}
              </p>
            )}
            {selectedUser?.resume && (
              <p>
                <span className="font-semibold">Resume:</span>{" "}
                <a
                  href={selectedUser.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Resume
                </a>
              </p>
            )}
            {selectedUser?.coverimage && (
              <p>
                <span className="font-semibold">Cover Image:</span>{" "}
                <img
                  src={selectedUser.coverimage}
                  alt="Cover"
                  className="mt-2 rounded-md w-full max-h-52 object-cover"
                />
              </p>
            )}
            {selectedUser?.qualifications?.length > 0 && (
              <div>
                <span className="font-semibold">Qualifications:</span>
                {selectedUser.qualifications.map((qual, index) => (
                  <div key={index} className="ml-4">
                    <p>Education: {qual.education}</p>
                    <p>Skills: {qual.skills}</p>
                  </div>
                ))}
              </div>
            )}
            {selectedUser?.experience?.length > 0 && (
              <div>
                <span className="font-semibold">Experience:</span>
                {selectedUser.experience.map((exp, index) => (
                  <div key={index} className="ml-4">
                    <p>Title: {exp.title}</p>
                    <p>Company: {exp.company}</p>
                    <p>Description: {exp.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleCloseDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersTable;
