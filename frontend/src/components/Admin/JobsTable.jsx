import { useEffect, useState } from "react"
import { Eye, Trash2, Search, MoreHorizontal, Download, Edit, ExternalLink } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"


export default function JobsTable() {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [creators, setCreators] = useState([])
  const [selectedCreator, setSelectedCreator] = useState("")
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  const fetchJobs = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/admin/getalljobs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      const data = await res.json()
      //console.log("RESPONSE",data.data)
      if (data.success) {
        setJobs(data.data)
        const uniqueCreators = [...new Set(data.data.map((job) => job.createdBy?._id || "N/A"))];

        setCreators(uniqueCreators)
        //console.log("CREATORS", creators)
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  
const handleDownload = (format) => {
    if (jobs.length === 0) {
      alert("No job data available to download.")
      return
    }
  
    if (format === "csv" || format === "excel") {
      const ws = XLSX.utils.json_to_sheet(jobs)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Jobs")
  
      if (format === "csv") {
        XLSX.writeFile(wb, "jobs_data.csv")
      } else {
        XLSX.writeFile(wb, "jobs_data.xlsx")
      }
    } else if (format === "pdf") {
        const doc = new jsPDF()
        doc.text("Job Data", 14, 10)
      
        const tableData = jobs.map((job) => [
          job.title,
          job.location,
          job.type,
          job.salary,
          job.createdBy?._id || "N/A",
        ])
      
        autoTable(doc, {
          head: [["Title", "Location", "Type", "Salary", "Created By"]],
          body: tableData,
        })
      
        doc.save("jobs_data.pdf")
      }
      
  }

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        const res = await fetch(`${API_URL}/admin/deletejob`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ jobId }),
        })
        const data = await res.json()
        if (data.success) {
          setJobs(jobs.filter((job) => job._id !== jobId))
        }
      } catch (error) {
        console.error("Error deleting job:", error)
      }
    }
  }

  const handleViewJob = (job) => {
    setSelectedJob(job)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedJob(null)
    setIsDialogOpen(false)
  }

 const handleFilterChange = (value) => {
  setSelectedCreator(value === "all" ? "" : value);
};


const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCreator = selectedCreator === "" || job.createdBy?._id === selectedCreator;
    return matchesSearch && matchesCreator;
  });
  

  useEffect(() => {
    fetchJobs()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Job Management</h2>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search jobs..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCreator} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by creator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Creators</SelectItem>
              {creators.map((creator, index) => (
                <SelectItem key={index} value={creator}>
                  {creator.substring(0, 8)}...
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="icon">
      <Download className="h-4 w-4" />
      <span className="sr-only">Download</span>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => handleDownload("csv")}>Download as CSV</DropdownMenuItem>
    <DropdownMenuItem onClick={() => handleDownload("excel")}>Download as Excel</DropdownMenuItem>
    <DropdownMenuItem onClick={() => handleDownload("pdf")}>Download as PDF</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

          {/* <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button> */}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Salary</TableHead>
                <TableHead className="hidden lg:table-cell">Created By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading jobs...
                  </TableCell>
                </TableRow>
              ) : filteredJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No jobs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredJobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell>
                      <div className="font-medium">{job.title}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{job.location}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {job.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{job.salary}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {job.createdBy?._id.substring(0, 8) || 'Unknown'}...
                      </span>
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
                          <DropdownMenuItem onClick={() => handleViewJob(job)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Job
                          </DropdownMenuItem> */}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(job._id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Job
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
            Showing <strong>{filteredJobs.length}</strong> of <strong>{jobs.length}</strong> jobs
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
            <DialogTitle>Job Details</DialogTitle>
            <DialogDescription>Detailed information about this job posting</DialogDescription>
          </DialogHeader>

          {selectedJob && (
            <div className="grid gap-6 py-4">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{selectedJob.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {selectedJob.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{selectedJob.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{selectedJob.salary}</div>
                    <div className="text-sm text-muted-foreground">
                      Created by: {selectedJob.createdBy?._id.substring(0, 8) || 'Unknown'}...
                    </div>
                  </div>
                </div>

                {selectedJob.coverImage && (
                  <div className="mt-2">
                    <img
                      src={selectedJob.coverImage || "/placeholder.svg"}
                      alt="Job Cover"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedJob.overview}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Responsibilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedJob.responsiblity}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedJob.requirment}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCloseDialog}>
              Close
            </Button>
            <Button>
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Website
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
