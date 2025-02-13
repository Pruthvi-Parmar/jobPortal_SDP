import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { toast } from 'sonner';
const JobCard = ({jobId, title, location, salary, type, overview, responsibility, requirement, coverImage, status }) => {
  const handleClick = async () => {
    console.log(jobId);
    try {
      
      
      const response = await fetch("http://localhost:8001/v1/application/apply-to-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, 
        },
        body: JSON.stringify({ jobId: jobId }), 
        credentials: "include",
      });
  
      if (!response.ok) {
        toast.error("Error while applying");
        throw new Error("Failed to apply for job");
        
      }
      console.log(response);
      

      toast.success("applied Succesfull");
  
      
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };
  return (
    <Card className="hover:shadow-lg transition-shadow">
      {coverImage && (
        <img
          src={coverImage}
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {location} • {type}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-4">{overview}</p>
        <div className="space-y-2">
          <p className="text-sm font-semibold">Responsibilities:</p>
          <p className="text-sm text-gray-600">{responsibility}</p>
        </div>
        <div className="space-y-2 mt-4">
          <p className="text-sm font-semibold">Requirements:</p>
          <p className="text-sm text-gray-600">{requirement}</p>
          <Button className="text-center" onClick={handleClick}>Apply</Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge variant={status === "Active" ? "default" : "secondary"}>
          {status}
        </Badge>
        <p className="text-lg font-bold">${salary.toLocaleString()}</p>
      </CardFooter>
    </Card>
  );
};

export default JobCard;