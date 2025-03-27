import { useState } from "react"
import { useLocation } from "react-router-dom"
import { MapPin, Clock, Briefcase, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"

const JobPage = () => {
  const location = useLocation()
  const { job } = location.state || {}
  const [hasApplied, setHasApplied] = useState(false)
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  const handleApply = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        toast.error("Please login to apply for jobs")
        return
      }

      const response = await fetch(`${API_URL}/application/apply-to-job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          jobId: job._id,
        }),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.message || "Error while applying")
        throw new Error("Failed to apply for job")
      }

      const result = await response.json()
      if (result.success) {
        toast.success("Successfully applied for the position!")
        setHasApplied(true)
      } else {
        throw new Error(result.message || "Failed to apply for job")
      }
    } catch (error) {
      console.error("Error applying for job:", error)
      toast.error("Failed to apply for the position. Please try again.")
    }
  }

  if (!job) {
    return <div>Job details not found.</div>
  }

  return (
    
    <Card className="max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>{job.location}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 mr-2 text-primary/70" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="w-4 h-4 mr-2 text-primary/70" />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-sm col-span-2">
            <span>₹{job.salary.toLocaleString()} per year</span>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-1">Overview</h4>
          <p className="text-muted-foreground text-sm">{job.overview}</p>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-1">Responsibilities</h4>
          <p className="text-muted-foreground text-sm">{job.responsiblity}</p>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-1">Requirements</h4>
          <p className="text-muted-foreground text-sm">{job.requirment}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleApply}
          disabled={hasApplied}
          className={`w-full ${
            hasApplied ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            {hasApplied ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Application Submitted
              </>
            ) : (
              <>
                <Briefcase className="w-5 h-5" />
                Apply Now
              </>
            )}
          </span>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default JobPage