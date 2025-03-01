import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { toast } from 'sonner';

const JobCard = ({ jobId, title, location, salary, type, overview, responsibility, requirement, coverImage, status }) => {
  const [hasApplied, setHasApplied] = useState(false);

  // Function to check if the user has applied for the job
  // This function is getting called on each card render optimise it by storing the applied jobs before rendering card 
  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const response = await fetch("http://localhost:8001/v1/application/get-applicants-job", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch application status");
        }

        const data = await response.json();
        // console.log(data);
        const appliedJobs = data.data || [];

        // Check if the user has applied to this job
        setHasApplied(appliedJobs.some((job) => job.jobDetails._id === jobId));
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    };

    checkApplicationStatus();
  }, [jobId]);

  const handleClick = async () => {
    try {
      const response = await fetch("http://localhost:8001/v1/application/apply-to-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ jobId }),
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Error while applying");
        throw new Error("Failed to apply for job");
      }

      toast.success("Applied Successfully");
      setHasApplied(true); // Update state after successful application
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      {coverImage && (
        <img src={coverImage} alt={title} className="w-full h-48 object-cover rounded-t-lg" />
      )}
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {location} • {type}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-4 break-words">{overview}</p>
        <div className="space-y-2">
          <p className="text-sm font-semibold">Responsibilities:</p>
          <p className="text-sm text-gray-600 break-words">{responsibility}</p>
        </div>
        <div className="space-y-2 mt-4">
          <p className="text-sm font-semibold">Requirements:</p>
          <p className="text-sm text-gray-600 break-words">{requirement}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge variant={status === "Active" ? "default" : "secondary"}>
          {status}
        </Badge>
        <p className="text-lg font-bold">${salary.toLocaleString()}</p>
      </CardFooter>
      <div className="p-4">
        <Button 
          className="w-full" 
          onClick={handleClick} 
          disabled={hasApplied}
        >
          {hasApplied ? "Applied" : "Apply"}
        </Button>
      </div>
    </Card>
  );
};

export default JobCard;
