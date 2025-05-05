import React from "react"
import { Bell, Search, Menu, X, LayoutDashboard, Users, Briefcase, FileText, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "@/store/authSlice"
import axios from "axios"
import { toast } from "sonner"

export default function AdminHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const user = useSelector((state) => state.auth.userData)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/admin/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        },
      )

      if (res.data.success) {
        localStorage.setItem("accessToken", null)
        localStorage.setItem("refreshToken", null)
        dispatch(logout())
        navigate("/")
        toast.success(res.data.message)
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout")
    }
  }

  return (
    <header className="bg-white border-b">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
          <h1 className="ml-2 text-xl font-bold text-gray-900 md:hidden">
            Job<span className="text-primary">Connect</span>
          </h1>
        </div>

        <div className="hidden md:flex md:flex-1 md:items-center md:justify-start">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="pl-8 w-full bg-gray-50 border-gray-200" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.coverimage} alt={user?.username} />
                  <AvatarFallback>{user?.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
              {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t p-2">
          <nav className="grid gap-1">
            <Button variant="ghost" className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
              <Briefcase className="mr-2 h-4 w-4" />
              Jobs
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
              <FileText className="mr-2 h-4 w-4" />
              Applications
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
