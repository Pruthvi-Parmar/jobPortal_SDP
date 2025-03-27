"use client"

import { useState, useEffect } from "react"
import Sidebar from "../components/Admin/Sidebar"
import AdminHeader from "../components/Admin/AdminHeader"
import Overview from "../components/Admin/Overview"
import UsersTable from "../components/Admin/UsersTable"
import JobsTable from "../components/Admin/JobsTable"
import JobApplicationsTable from "../components/Admin/JobApplicationsTable"
import Approval from "@/components/Admin/Approval"
import Complaint from "@/components/Admin/Complaints"
import Analytics from "@/components/Admin/Analytics"

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState("overview")
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  // Fetch Dashboard Data from API
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/admin/dashboard`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      const data = await res.json()
      if (data.success) {
        setDashboardData(data.data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {currentView === "overview" && <Overview dashboardData={dashboardData} isLoading={isLoading} />}
          {currentView === "analytics" && <Analytics />}
          {currentView === "users" && <UsersTable />}
          {currentView === "jobs" && <JobsTable />}
          {currentView === "approval" && <Approval />}
          {currentView === "complaints" && <Complaint />}
          {currentView === "applications" && <JobApplicationsTable />}
        </main>
      </div>
    </div>
  )
}

