"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import MonthlyStatsChart from "./charts/MonthlyStatsChart"
import TopCategoriesChart from "./charts/TopCategoriesChart"
import ApplicationStatusChart from "./charts/ApplicationStatusChart"
import SalaryByCategoryChart from "./charts/SalaryByCategoryChart"
import DownloadAllMenu from "../ui/DownloadMenu"
import { downloadAllData } from "./utils/downloadUtils"

export default function Analytics() {
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  const [isLoading, setIsLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState({
    monthlyJobs: [],
    monthlyApplications: [],
    monthlyUsers: [],
    topCategories: [],
    applicationStatus: [],
    averageSalary: [],
  })

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    setIsLoading(true)
    try {
      const endpoints = [
        "/monthly-job-postings",
        "/monthly-applications",
        "/monthly-registrations",
        "/top-categories",
        "/application-status",
        "/average-salary",
      ]

      const requests = endpoints.map((endpoint) =>
        axios.get(`${API_URL}/admin${endpoint}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }),
      )

      const [jobsRes, applicationsRes, usersRes, categoriesRes, statusRes, salaryRes] = await Promise.all(requests)

      // Transform month numbers to month names
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

      const monthlyJobs = jobsRes.data.data.map((item) => ({
        month: monthNames[item._id - 1],
        jobs: item.totalJobs,
      }))

      const monthlyApplications = applicationsRes.data.data.map((item) => ({
        month: monthNames[item._id - 1],
        applications: item.totalApplications,
      }))

      const monthlyUsers = usersRes.data.data.map((item) => ({
        month: monthNames[item._id - 1],
        users: item.totalUsers,
      }))

      setAnalyticsData({
        monthlyJobs,
        monthlyApplications,
        monthlyUsers,
        topCategories: categoriesRes.data.data,
        applicationStatus: statusRes.data.data,
        averageSalary: salaryRes.data.data,
      })
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to download all data in the specified format
  const handleDownloadAll = (format) => {
    downloadAllData(analyticsData, format)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading analytics data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <DownloadAllMenu onDownload={handleDownloadAll} />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Monthly Job Postings</CardTitle>
                <CardDescription>Number of jobs posted each month</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <MonthlyStatsChart
                  data={analyticsData.monthlyJobs}
                  dataKey="jobs"
                  stroke="#4f46e5"
                  fill="rgba(79, 70, 229, 0.2)"
                  title="Monthly Job Postings"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Monthly Applications</CardTitle>
                <CardDescription>Number of applications submitted each month</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <MonthlyStatsChart
                  data={analyticsData.monthlyApplications}
                  dataKey="applications"
                  stroke="#0ea5e9"
                  fill="rgba(14, 165, 233, 0.2)"
                  title="Monthly Applications"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Monthly Registrations</CardTitle>
                <CardDescription>Number of new users registered each month</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <MonthlyStatsChart
                  data={analyticsData.monthlyUsers}
                  dataKey="users"
                  stroke="#10b981"
                  fill="rgba(16, 185, 129, 0.2)"
                  title="Monthly Registrations"
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Top Job Categories</CardTitle>
                <CardDescription>Categories with the most applications</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <TopCategoriesChart data={analyticsData.topCategories} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Application Status Distribution</CardTitle>
                <CardDescription>Distribution of application statuses</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ApplicationStatusChart data={analyticsData.applicationStatus} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Average Salary by Category</CardTitle>
              <CardDescription>Average salary offered across different job categories</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <SalaryByCategoryChart data={analyticsData.averageSalary} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Monthly Job Postings</CardTitle>
                <CardDescription>Detailed view of jobs posted each month</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <MonthlyStatsChart
                  data={analyticsData.monthlyJobs}
                  dataKey="jobs"
                  stroke="#4f46e5"
                  fill="rgba(79, 70, 229, 0.2)"
                  showGrid={true}
                  title="Monthly Job Postings"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Average Salary by Category</CardTitle>
                <CardDescription>Detailed view of average salaries</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <SalaryByCategoryChart data={analyticsData.averageSalary} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Monthly Applications</CardTitle>
                <CardDescription>Detailed view of applications submitted each month</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <MonthlyStatsChart
                  data={analyticsData.monthlyApplications}
                  dataKey="applications"
                  stroke="#0ea5e9"
                  fill="rgba(14, 165, 233, 0.2)"
                  showGrid={true}
                  title="Monthly Applications"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Application Status Distribution</CardTitle>
                <CardDescription>Detailed view of application statuses</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ApplicationStatusChart data={analyticsData.applicationStatus} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Top Job Categories</CardTitle>
              <CardDescription>Detailed view of categories with most applications</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <TopCategoriesChart data={analyticsData.topCategories} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Monthly User Registrations</CardTitle>
              <CardDescription>Detailed view of new users registered each month</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <MonthlyStatsChart
                data={analyticsData.monthlyUsers}
                dataKey="users"
                stroke="#10b981"
                fill="rgba(16, 185, 129, 0.2)"
                showGrid={true}
                title="Monthly User Registrations"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

