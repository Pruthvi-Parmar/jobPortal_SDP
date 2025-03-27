"use client"

import { Skeleton } from "@/components/ui/skeleton"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import {
  Check,
  X,
  Eye,
  Edit,
  Save,
  Users,
  MapPin,
  DollarSign,
  Briefcase,
  FileText,
  ExternalLink,
  Clock,
  Calendar,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const JobDetails = ({ job, className }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedJob, setEditedJob] = useState(job)
  const [appliedUsers, setAppliedUsers] = useState([])
  const [loadingApplicants, setLoadingApplicants] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [activeTab, setActiveTab] = useState("details")
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL

  useEffect(() => {
    setEditedJob(job)
    setAppliedUsers([])
  }, [job])

  const handleEdit = () => setIsEditing(true)

  const handleUpdate = async () => {
    if (!editedJob.title || !editedJob.location || !editedJob.salary || !editedJob.type) {
      alert("Please fill in all required fields.")
      return
    }

    try {
      const response = await fetch(`${API_URL}/jobs/update-job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editedJob._id,
          title: editedJob.title,
          location: editedJob.location,
          salary: editedJob.salary,
          type: editedJob.type,
          overview: editedJob.overview,
          responsibility: editedJob.responsibility,
          requirment: editedJob.requirment,
          status: editedJob.status,
        }),
      })

      const result = await response.json()
      //console.log(result)
    } catch (error) {
      console.error("Error updating job:", error)
    }
    setIsEditing(false)
  }

  const fetchApplicants = async () => {
    if (!job) return
    setLoadingApplicants(true)
    try {
      const response = await fetch(`${API_URL}/application/get-job-application`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ jobId: job._id }),
      })
      const result = await response.json()
      if (result.success) {
        setAppliedUsers(result.data)
        //console.log(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch applicants", error)
    } finally {
      setLoadingApplicants(false)
    }
  }

  const handleAccept = async (applicationId) => {
    //console.log("Accept application:", applicationId)
    const userId = applicationId
    try {
      const response = await fetch(`${API_URL}/application/changeState`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: job._id,
          userId: userId,
          status: "Accepted",
        }),
      })

      const result = await response.json()
      //console.log("Application status updated:", result)
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error("Error updating application status", error)
    }
  }

  const handleReject = async (applicationId) => {
    //console.log("Reject application:", applicationId)
    const userId = applicationId
    try {
      const response = await fetch(`${API_URL}/application/changeState`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: job._id,
          userId: userId,
          status: "Rejected",
        }),
      })

      const result = await response.json()
      //console.log("Application status updated:", result)
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error("Error updating application status", error)
    }
  }

  useEffect(() => {
    if (activeTab === "applicants") {
      fetchApplicants()
    }
  }, [refreshKey, activeTab])

  const handleViewProfile = async (applicant) => {
    try {
      const response = await fetch(`${API_URL}/users/viewProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          email: applicant.email,
          username: applicant.username,
        }),
      })

      const result = await response.json()
      //console.log(result.data)

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch profile")
      }

      setSelectedApplicant(result.data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <motion.div
      className={cn("bg-white rounded-lg", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight">{editedJob.title}</h2>
                <Badge
                  variant={editedJob.status === "Active" ? "success" : "secondary"}
                  className={cn(
                    "ml-2",
                    editedJob.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800",
                  )}
                >
                  {editedJob.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{editedJob.location}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>${editedJob.salary}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  <span>{editedJob.type}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Posted {formatDate(editedJob.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex mt-4 sm:mt-0">
              {isEditing ? (
                <>
                  <Button onClick={handleUpdate} className="mr-2">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Job
                </Button>
              )}
            </div>
          </div>

          <TabsList className="w-full justify-start px-6 pt-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="applicants" onClick={fetchApplicants}>
              Applicants
              {appliedUsers.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {appliedUsers.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="p-6 pt-4">
            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Title</label>
                    <Input
                      type="text"
                      value={editedJob.title}
                      onChange={(e) => setEditedJob({ ...editedJob, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={editedJob.status}
                      onValueChange={(value) => setEditedJob({ ...editedJob, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Hibernate">Hibernate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      type="text"
                      value={editedJob.location}
                      onChange={(e) => setEditedJob({ ...editedJob, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Salary</label>
                    <Input
                      type="number"
                      value={editedJob.salary}
                      onChange={(e) => setEditedJob({ ...editedJob, salary: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Type</label>
                    <Input
                      type="text"
                      value={editedJob.type}
                      onChange={(e) => setEditedJob({ ...editedJob, type: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Overview</label>
                  <Textarea
                    rows={4}
                    value={editedJob.overview}
                    onChange={(e) => setEditedJob({ ...editedJob, overview: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Responsibilities</label>
                  <Textarea
                    rows={4}
                    value={editedJob.responsiblity}
                    onChange={(e) => setEditedJob({ ...editedJob, responsiblity: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Requirements</label>
                  <Textarea
                    rows={4}
                    value={editedJob.requirment}
                    onChange={(e) => setEditedJob({ ...editedJob, requirment: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Overview</h3>
                  <div className="prose max-w-none text-muted-foreground">
                    <p>{editedJob.overview || "No overview provided."}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Responsibilities</h3>
                  <div className="prose max-w-none text-muted-foreground">
                    <p>{editedJob.responsiblity || "No responsibilities provided."}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                  <div className="prose max-w-none text-muted-foreground">
                    <p>{editedJob.requirment || "No requirements provided."}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="applicants" className="p-6 pt-4">
            {loadingApplicants ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : appliedUsers.length > 0 ? (
              <div className="space-y-4">
                {appliedUsers.map((application) => {
                  const applicant = application?.applicantDetails || {}
                  return (
                    <Card key={application._id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border">
                              <AvatarFallback>{getInitials(applicant.username)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{applicant.username || "Unknown User"}</h4>
                              <p className="text-sm text-muted-foreground">{applicant.email || "No email provided"}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    application.status === "Accepted"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : application.status === "Rejected"
                                        ? "bg-red-50 text-red-700 border-red-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200",
                                  )}
                                >
                                  {application.status || "Unknown Status"}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Applied {formatDate(application.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 sm:justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                              onClick={() => handleViewProfile(application.applicantDetails)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </Button>

                            {application.status === "Pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600 hover:bg-green-50 hover:text-green-700"
                                  onClick={() => handleAccept(application.applicantDetails._id)}
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Accept
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleReject(application.applicantDetails._id)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Applicants Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  There are no applicants for this job posting yet. Check back later or consider promoting your job
                  listing.
                </p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>

      {/* Profile Modal */}
      <Dialog open={selectedApplicant !== null} onOpenChange={() => setSelectedApplicant(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Applicant Profile</DialogTitle>
            <DialogDescription>Review the applicant's qualifications and experience</DialogDescription>
          </DialogHeader>

          {selectedApplicant && (
            <div className="mt-4 space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Avatar className="h-20 w-20 border">
                  <AvatarFallback className="text-xl">{getInitials(selectedApplicant.username)}</AvatarFallback>
                </Avatar>

                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-bold">{selectedApplicant.username || "Unknown User"}</h3>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    <span>{selectedApplicant.location || "Location not specified"}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <FileText className="h-4 w-4 mr-1.5" />
                    <span>{selectedApplicant.email}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Bio</h4>
                <p className="text-muted-foreground">{selectedApplicant.bio || "No bio available"}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApplicant.qualifications?.map((q, i) =>
                    q.skills
                      ? q.skills.split(",").map((skill, j) => (
                          <Badge key={`${i}-${j}`} variant="secondary" className="px-2 py-1">
                            {skill.trim()}
                          </Badge>
                        ))
                      : null,
                  ) || <p className="text-muted-foreground">No skills listed</p>}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Experience</h4>
                {selectedApplicant.experience?.length > 0 ? (
                  <div className="space-y-3">
                    {selectedApplicant.experience.map((exp, i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <h5 className="font-medium">{exp.title}</h5>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {exp.startDate && exp.endDate
                              ? `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`
                              : "Dates not specified"}
                          </p>
                          {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No experience listed</p>
                )}
              </div>

              {selectedApplicant.resume && (
                <div>
                  <h4 className="font-semibold mb-2">Resume</h4>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(selectedApplicant.resume, "_blank")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Resume
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default JobDetails

