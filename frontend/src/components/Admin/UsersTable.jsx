import { useEffect, useState } from "react"
import { Eye, Trash2, Search, MoreHorizontal, Download, Filter } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

export default function UsersTable() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true)

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:8001/v1/admin/getalluser", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      const data = await res.json()
      if (data.success) {
        setUsers(data.data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = (type) => {
    if (filteredUsers.length === 0) {
      alert("No data to download!");
      return;
    }

    const data = filteredUsers.map((user) => ({
      Username: user.username,
      Email: user.email,
      Location: user.location || "Not specified",
      Role: user.role,
      Status: "Active",
    }));

    if (type === "csv") {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Users");
      const csv = XLSX.write(wb, { bookType: "csv", type: "string" });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "users.csv");
    }

    if (type === "excel") {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Users");
      XLSX.writeFile(wb, "users.xlsx");
    }

    if (type === "pdf") {
      const doc = new jsPDF();
      doc.text("User List", 14, 10);
      autoTable(doc, {
        head: [["Username", "Email", "Location", "Role", "Status"]],
        body: data.map((user) => Object.values(user)),
      });
      doc.save("users.pdf");
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await fetch("http://localhost:8001/v1/admin/deleteuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ userId }),
        })
        const data = await res.json()
        if (data.success) {
          setUsers(users.filter((user) => user._id !== userId))
        }
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedUser(null)
    setIsDialogOpen(false)
  }



  const filteredUsers = users.filter((user) => {
    // Role-based filtering
    const roleMatch = selectedRole === "all" || user.role === selectedRole;

    // Search-based filtering (checks username, email, and location)
    const searchMatch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.location && user.location.toLowerCase().includes(searchQuery.toLowerCase()));

    return roleMatch && searchMatch;
  });


  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            {/* Search Input with Icon */}
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Role Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSelectedRole("all")}>
                All Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedRole("jobseeker")}>
                Job Seekers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedRole("recruiter")}>
                Employers
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Download As</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDownload("csv", filteredUsers)}>
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload("excel", filteredUsers)}>
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload("pdf", filteredUsers)}>
                PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.coverimage} alt={user.username} />
                          <AvatarFallback>{user.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-muted-foreground hidden md:block">
                            {user.qualifications?.[0]?.education || "No education listed"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.location || "Not specified"}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewUser(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Resume
                          </DropdownMenuItem> */}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => deleteUser(user._id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>Detailed information about {selectedUser?.username}</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="grid gap-6 py-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={selectedUser.coverimage} alt={selectedUser.username} />
                    <AvatarFallback>{selectedUser.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {selectedUser.resume && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedUser.resume} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download Resume
                      </a>
                    </Button>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Username</h3>
                      <p className="text-base">{selectedUser.username}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                      <p className="text-base">{selectedUser.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                      <p className="text-base">{selectedUser.location || "Not specified"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    </div>
                  </div>

                  {selectedUser.bio && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                      <p className="text-base">{selectedUser.bio}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedUser.qualifications?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Qualifications</h3>
                  <div className="space-y-4">
                    {selectedUser.qualifications.map((qual, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Education</h4>
                              <p className="text-base">{qual.education}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Skills</h4>
                              <p className="text-base">{qual.skills}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.experience?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Experience</h3>
                  <div className="space-y-4">
                    {selectedUser.experience.map((exp, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="grid gap-2">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{exp.title}</h4>
                              <p className="text-sm text-muted-foreground">{exp.company}</p>
                            </div>
                            <p className="text-sm">{exp.desc}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
