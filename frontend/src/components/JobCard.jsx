"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Clock, DollarSign, Briefcase, CheckCircle } from "lucide-react"
import { toast } from "sonner"

const JobCard = ({
  jobId,
  title,
  location,
  salary,
  type,
  overview,
  responsibility,
  requirement,
  coverImage,
  status,
}) => {
  const [hasApplied, setHasApplied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
          console.log("No access token found")
          return
        }

        const response = await fetch("http://localhost:8001/v1/application/get-applicants-job", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch application status")
        }

        const data = await response.json()
        const appliedJobs = data.data || []
        setHasApplied(appliedJobs.some((job) => job.jobDetails._id === jobId))
      } catch (error) {
        console.error("Error checking application status:", error)
      }
    }

    checkApplicationStatus()
  }, [jobId])

  const handleApply = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        toast.error("Please login to apply for jobs")
        return
      }

      const response = await fetch("http://localhost:8001/v1/application/apply-to-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          jobId: jobId,
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

  return (
    <motion.div
      className="bg-background rounded-xl border border-border/40 overflow-hidden transition-all duration-300 h-full flex flex-col"
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      {coverImage && (
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovering ? 1.05 : 1 }}
            transition={{ duration: 0.5 }}
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=200&width=400"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute top-4 right-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                status === "Active"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {status}
            </span>
          </div>
          <div className="absolute bottom-4 left-4">
            <h3 className="text-xl font-bold text-white drop-shadow-md">{title}</h3>
          </div>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        {!coverImage && <h3 className="text-xl font-bold mb-3">{title}</h3>}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 mr-2 text-primary/70" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="w-4 h-4 mr-2 text-primary/70" />
            <span>{type}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-sm col-span-2">
            <DollarSign className="w-4 h-4 mr-2 text-primary/70" />
            <span>₹{salary.toLocaleString()} per year</span>
          </div>
        </div>

        <div className="mb-4 flex-1">
          <p className="text-muted-foreground text-sm line-clamp-2">{overview}</p>
        </div>

        <motion.div
          animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden mb-4"
        >
          <div className="space-y-4 pt-2 border-t">
            <div>
              <h4 className="font-medium text-sm mb-1">Responsibilities</h4>
              <p className="text-muted-foreground text-sm">{responsibility}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Requirements</h4>
              <p className="text-muted-foreground text-sm">{requirement}</p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-3 mt-auto">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            {isExpanded ? "Show Less" : "Learn More"}
          </button>

          <motion.button
            whileHover={{ scale: hasApplied ? 1 : 1.02 }}
            whileTap={{ scale: hasApplied ? 1 : 0.98 }}
            onClick={handleApply}
            disabled={hasApplied}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
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
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default JobCard

