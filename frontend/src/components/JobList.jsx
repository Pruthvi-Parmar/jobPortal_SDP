"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, DollarSign, Briefcase, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const JobList = ({ job, onSelectJob, isSelected }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  // Get random number of applicants for demo purposes
  const applicantsCount = Math.floor(Math.random() * 20)

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected ? "border-primary ring-1 ring-primary" : "",
      )}
      onClick={() => onSelectJob(job)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium line-clamp-1">{job.title}</h3>
          <Badge
            variant={job.status === "Active" ? "success" : "secondary"}
            className={cn(
              "ml-2 px-2 py-0 text-xs",
              job.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800",
            )}
          >
            {job.status}
          </Badge>
        </div>

        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            <span className="line-clamp-1">{job.location}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-3.5 w-3.5 mr-1.5" />
            <span>${job.salary}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="h-3.5 w-3.5 mr-1.5" />
            <span>{job.type}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 pt-3 border-t text-xs text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            <span>Posted {formatDate(job.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-1.5" />
            <span>{applicantsCount} applicants</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default JobList

