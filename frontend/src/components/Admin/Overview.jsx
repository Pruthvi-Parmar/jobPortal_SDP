import { Users, Briefcase, FileText, TrendingUp, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

export default function Overview({ dashboardData, isLoading = false }) {
  // Sample data for charts
  const applicationData = [
    { month: "Jan", applications: 65 },
    { month: "Feb", applications: 59 },
    { month: "Mar", applications: 80 },
    { month: "Apr", applications: 81 },
    { month: "May", applications: 56 },
    { month: "Jun", applications: 55 },
    { month: "Jul", applications: 40 },
  ]

  // Job category data (was missing in the original code)
  const jobCategoryData = [
    { category: "Engineering", count: 45 },
    { category: "Marketing", count: 30 },
    { category: "Design", count: 25 },
    { category: "Finance", count: 20 },
    { category: "HR", count: 15 },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={dashboardData?.totalUsers || 0}
          description="Active users on platform"
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Jobs"
          value={dashboardData?.totalJobs || 0}
          description="Jobs posted"
          icon={<Briefcase className="h-5 w-5 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Applications"
          value={dashboardData?.totalApplications || 0}
          description="Total applications received"
          icon={<FileText className="h-5 w-5 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Active Jobs"
          value={dashboardData?.activeJobs || 0}
          description="Currently active jobs"
          icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Application Trends</CardTitle>
            <CardDescription>Monthly job applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  applications: {
                    label: "Applications",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <LineChart data={applicationData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="var(--color-applications)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Categories</CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  count: {
                    label: "Jobs",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <BarChart data={jobCategoryData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ActivityItem
              title="New User Registration"
              description="John Doe joined the platform"
              time="2 hours ago"
              icon={<Users className="h-4 w-4" />}
            />
            <ActivityItem
              title="New Job Posted"
              description="Senior Developer position at TechCorp"
              time="5 hours ago"
              icon={<Briefcase className="h-4 w-4" />}
            />
            <ActivityItem
              title="Application Submitted"
              description="Sarah applied for Marketing Manager"
              time="1 day ago"
              icon={<FileText className="h-4 w-4" />}
            />
            <ActivityItem
              title="Interview Scheduled"
              description="Interview for UX Designer position"
              time="2 days ago"
              icon={<Calendar className="h-4 w-4" />}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ title, value, description, icon, isLoading }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{value}</div>}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function ActivityItem({ title, description, time, icon }) {
  return (
    <div className="flex items-center">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">{icon}</div>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="ml-auto text-sm text-muted-foreground">{time}</div>
    </div>
  )
}
