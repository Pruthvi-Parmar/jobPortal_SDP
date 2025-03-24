"use client"

import { useEffect, useState } from "react"
import { Eye, Trash2, Search, MoreHorizontal, Download, CheckCircle, XCircle, Clock } from "lucide-react"
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function JobApplicationsTable() {
  // This is a mock component since we don't have the actual API endpoint
  // In a real implementation, you would fetch the job applications data

  const [applications, setApplications] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for job applications
  const mockApplications = [
    {
      _id: "app1",
      jobId: {
        _id: "job1",
        title: "Frontend Developer",
        company: "TechCorp",
      },
      userId: {
        _id: "user1",
        username: "John Doe",
        email: "john@example.com",
        coverimage: "/placeholder.svg?height=40&width=40",
      },
      status: "pending",
      appliedAt: "2023-05-15T10:30:00Z",
      resume: "https://example.com/resume1.pdf",
      coverLetter: "I am excited to apply for this position...",
    },
    {
      _id: "app2",
      jobId: {
        _id: "job2",
        title: "UX Designer",
        company: "DesignHub",
      },
      userId: {
        _id: "user2",
        username: "Jane Smith",
        email: "jane@example.com",
        coverimage: "/placeholder.svg?height=40&width=40",
      },
      status: "accepted",
      appliedAt: "2023-05-10T14:20:00Z",
      resume: "https://example.com/resume2.pdf",
      coverLetter: "With my 5 years of experience in UX design...",
    },
    {
      _id: "app3",
      jobId: {
        _id: "job3",
        title: "Backend Developer",
        company: "ServerSolutions",
      },
      userId: {
        _id: "user3",
        username: "Mike Johnson",
        email: "mike@example.com",
        coverimage: "/placeholder.svg?height=40&width=40",
      },
      status: "rejected",
      appliedAt: "2023-05-08T09:15:00Z",
      resume: "https://example.com/resume3.pdf",
      coverLetter: "I believe my skills in Node.js and MongoDB...",
    },
    {
      _id: "app4",
      jobId: {
        _id: "job4",
        title: "Product Manager",
        company: "ProductPro",
      },
      userId: {
        _id: "user4",
        username: "Sarah Williams",
        email: "sarah@example.com",
        coverimage: "/placeholder.svg?height=40&width=40",
      },
      status: "pending",
      appliedAt: "2023-05-12T11:45:00Z",
      resume: "https://example.com/resume4.pdf",
      coverLetter: "As a product manager with experience in...",
    },
    {
      _id: "app5",
      jobId: {
        _id: "job5",
        title: "DevOps Engineer",
        company: "CloudTech",
      },
      userId: {
        _id: "user5",
        username: "Alex Brown",
        email: "alex@example.com",
        coverimage: "/placeholder.svg?height=40&width=40",
      },
      status: "accepted",
      appliedAt: "2023-05-05T16:30:00Z",
      resume: "https://example.com/resume5.pdf",
      coverLetter: "I have extensive experience with AWS and Docker...",
    },
  ]

  const fetchApplications = async () => {
    setIsLoading(true)
    // In a real implementation, you would fetch from your API
    // For now, we'll use the mock data
    setTimeout(() => {
      setApplications(mockApplications)
      setIsLoading(false)
    }, 1000)
  }

  const handleViewApplication = (application) => {
    setSelectedApplication(application)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedApplication(null)
    setIsDialogOpen(false)
  }

  const handleStatusChange = async (applicationId, newStatus) => {
    // In a real implementation, you would update the status via API
    setApplications(applications.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app)))
  }

  const handleDeleteApplication = (applicationId) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      setApplications(applications.filter((app) => app._id !== applicationId))
    }
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.jobId.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.userId.username.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter ? app.status === statusFilter : true

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Job Applications</h2>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search applications..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead className="hidden md:table-cell">Job Position</TableHead>
                    <TableHead className="hidden md:table-cell">Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading applications...
                      </TableCell>
                    </TableRow>
                  ) : filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No applications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((application) => (
                      <TableRow key={application._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={application.userId.coverimage} alt={application.userId.username} />
                              <AvatarFallback>{application.userId.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{application.userId.username}</div>
                              <div className="text-sm text-muted-foreground hidden md:block">
                                {application.userId.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="font-medium">{application.jobId.title}</div>
                          <div className="text-sm text-muted-foreground">{application.jobId.company}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{formatDate(application.appliedAt)}</TableCell>
                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewApplication(application)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleStatusChange(application._id, "pending")}>
                                <Clock className="mr-2 h-4 w-4" />
                                Mark as Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(application._id, "accepted")}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Accept Application
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(application._id, "rejected")}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject Application
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteApplication(application._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Application
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
                Showing <strong>{filteredApplications.length}</strong> of <strong>{applications.length}</strong>{" "}
                applications
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
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium">Recent Applications</h3>
                <p className="text-muted-foreground mt-2">View applications received in the last 7 days</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium">Pending Applications</h3>
                <p className="text-muted-foreground mt-2">Applications that require your review</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>Review the application for {selectedApplication?.jobId.title}</DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="grid gap-6 py-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={selectedApplication.userId.coverimage}
                      alt={selectedApplication.userId.username}
                    />
                    <AvatarFallback>{selectedApplication.userId.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-medium">{selectedApplication.userId.username}</h3>
                    <p className="text-sm text-muted-foreground">{selectedApplication.userId.email}</p>
                  </div>
                  {selectedApplication.resume && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedApplication.resume} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download Resume
                      </a>
                    </Button>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Job Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Position</h4>
                          <p className="text-base font-medium">{selectedApplication.jobId.title}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Company</h4>
                          <p className="text-base">{selectedApplication.jobId.company}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Applied On</h4>
                          <p className="text-base">{formatDate(selectedApplication.appliedAt)}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                          {getStatusBadge(selectedApplication.status)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Cover Letter</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{selectedApplication.coverLetter}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Application Status</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedApplication.status === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(selectedApplication._id, "pending")}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Pending
                  </Button>
                  <Button
                    variant={selectedApplication.status === "accepted" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(selectedApplication._id, "accepted")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                  <Button
                    variant={selectedApplication.status === "rejected" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(selectedApplication._id, "rejected")}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
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
