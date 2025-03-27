"use client"

import { LayoutDashboard, Users, UserCheck, Briefcase, FileText, Inbox, LogOut, BarChart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "@/store/authSlice"
import axios from "axios"
import { toast } from "sonner"

export default function Sidebar({ currentView, setCurrentView }) {
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
    <div className="hidden md:flex md:w-64 md:flex-col h-screen bg-white border-r">
      <div className="flex flex-col flex-1">
        <div className="flex items-center h-16 px-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">
            Job<span className="text-primary">Connect</span>
          </h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <SidebarItem
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            active={currentView === "overview"}
            onClick={() => setCurrentView("overview")}
          />
          <SidebarItem
            icon={<BarChart className="h-5 w-5" />}
            label="Analytics"
            active={currentView === "analytics"}
            onClick={() => setCurrentView("analytics")}
          />
          <SidebarItem
            icon={<Users className="h-5 w-5" />}
            label="Users"
            active={currentView === "users"}
            onClick={() => setCurrentView("users")}
          />
          <SidebarItem
            icon={<UserCheck className="h-5 w-5" />}
            label="Approve Recruiters"
            active={currentView === "approval"}
            onClick={() => setCurrentView("approval")}
          />
          <SidebarItem
            icon={<Briefcase className="h-5 w-5" />}
            label="Jobs"
            active={currentView === "jobs"}
            onClick={() => setCurrentView("jobs")}
          />
          <SidebarItem
            icon={<FileText className="h-5 w-5" />}
            label="Applications"
            active={currentView === "applications"}
            onClick={() => setCurrentView("applications")}
          />
          <SidebarItem
            icon={<Inbox className="h-5 w-5" />}
            label="Complaints"
            active={currentView === "complaints"}
            onClick={() => setCurrentView("complaints")}
          />
          <div className="pt-4 mt-4 border-t">
            <SidebarItem icon={<LogOut className="h-5 w-5" />} label="Logout" onClick={handleLogout} />
          </div>
        </nav>
      </div>
    </div>
  )
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-gray-100",
      )}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  )
}

