import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Eye } from "lucide-react";


const JobDetails = ({ job, onUpdateJob, onShowApplicants }) => {
  // console.log(job);
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState(job);
  const [appliedUsers, setAppliedUsers] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setEditedJob(job);
    setAppliedUsers([]);
  }, [job]);

  const handleEdit = () => setIsEditing(true);
  const handleUpdate = async () => {
    if (
      !editedJob.title ||
      !editedJob.location ||
      !editedJob.salary ||
      !editedJob.type
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8001/v1/jobs/update-job", {
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
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error updating job:", error);
      //alert("Something went wrong. Please try again.");
    }
    setIsEditing(false);
  };

  const fetchApplicants = async () => {
    if (!job) return;
    setLoadingApplicants(true);
    try {
      const response = await fetch(
        "http://localhost:8001/v1/application/get-job-application",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ jobId: job._id }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setAppliedUsers(result.data);
        console.log(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch applicants", error);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleAccept = async (applicationId) => {
    console.log("Accept application:", applicationId);
    let userId = applicationId;
    try {
      const response = await fetch(
        "http://localhost:8001/v1/application/changeState",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobId: job._id, // Job ID from job object
            userId: userId, // User ID from the application object
            status: "Accepted", // New status
          }),
        }
      );

      const result = await response.json();
      console.log("Application status updated:", result);
      setRefreshKey((prev) => prev + 1); // Trigger re-render
    } catch (error) {
      console.error("Error updating application status", error);
    }
  };

  const handleReject = async (applicationId) => {
    console.log("Accept application:", applicationId);
    let userId = applicationId;
    try {
      const response = await fetch(
        "http://localhost:8001/v1/application/changeState",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobId: job._id, // Job ID from job object
            userId: userId, // User ID from the application object
            status: "Rejected", // New status
          }),
        }
      );

      const result = await response.json();
      console.log("Application status updated:", result);
      setRefreshKey((prev) => prev + 1); // Trigger re-render
    } catch (error) {
      console.error("Error updating application status", error);
    }
  };
  useEffect(() => {
    fetchApplicants();
  }, [refreshKey]);


  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const handleViewProfile = async (applicant) => {
    try {
      const response = await fetch("http://localhost:8001/v1/users/viewProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          email: applicant.email,
          username: applicant.username,
        }),
      });
  
      const result = await response.json();
      console.log(result.data);
      
  
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch profile");
      }
  
      setSelectedApplicant(result.data); // Update state with applicant details
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  

  return (
    <motion.div
      className="col-span-2 bg-white shadow-lg p-6 rounded-lg"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cover Image */}
      <div className="relative w-full h-52">
        <img
          src={editedJob.coverImage}
          alt="Job Cover"
          className="w-full h-full object-cover rounded-lg shadow-md"
        />
        {/* Status Badge or Dropdown */}
        <div className="absolute top-3 right-3">
          {isEditing ? (
            <Select
              value={editedJob.status}
              onValueChange={(value) =>
                setEditedJob({ ...editedJob, status: value })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Hibernate">Hibernate</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge
              className={`px-3 py-1 text-sm ${
                editedJob.status === "Active" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {editedJob.status}
            </Badge>
          )}
        </div>
      </div>

      {/* Job Details */}
      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            {isEditing ? (
              <Input
                type="text"
                value={editedJob.title}
                onChange={(e) =>
                  setEditedJob({ ...editedJob, title: e.target.value })
                }
              />
            ) : (
              editedJob.title
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location */}
          <div>
            <label className="text-gray-600 font-medium">Location</label>
            {isEditing ? (
              <Input
                type="text"
                value={editedJob.location}
                onChange={(e) =>
                  setEditedJob({ ...editedJob, location: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-700">{editedJob.location}</p>
            )}
          </div>

          {/* Salary */}
          <div>
            <label className="text-gray-600 font-medium">Salary</label>
            {isEditing ? (
              <Input
                type="number"
                value={editedJob.salary}
                onChange={(e) =>
                  setEditedJob({ ...editedJob, salary: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-700">${editedJob.salary}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="text-gray-600 font-medium">Type</label>
            {isEditing ? (
              <Input
                type="text"
                value={editedJob.type}
                onChange={(e) =>
                  setEditedJob({ ...editedJob, type: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-700">{editedJob.type}</p>
            )}
          </div>

          {/* Overview */}
          <div className="col-span-2">
            <label className="text-gray-600 font-medium">Overview</label>
            {isEditing ? (
              <Textarea
                value={editedJob.overview}
                onChange={(e) =>
                  setEditedJob({ ...editedJob, overview: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-700">{editedJob.overview}</p>
            )}
          </div>

          {/* Responsibility */}
          <div className="col-span-2">
            <label className="text-gray-600 font-medium">Responsibility</label>
            {isEditing ? (
              <Textarea
                value={editedJob.responsiblity}
                onChange={(e) =>
                  setEditedJob({ ...editedJob, responsiblity: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-700">{editedJob.responsiblity}</p>
            )}
          </div>

          {/* Requirement */}
          <div className="col-span-2">
            <label className="text-gray-600 font-medium">Requirement</label>
            {isEditing ? (
              <Textarea
                value={editedJob.requirment}
                onChange={(e) =>
                  setEditedJob({ ...editedJob, requirment: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-700">{editedJob.requirment}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="mt-5 flex gap-3">
        {/* Edit / Save Button */}
        <Button onClick={isEditing ? handleUpdate : handleEdit}>
          {isEditing ? "Save Changes" : "Edit Job"}
        </Button>

        {/* Cancel Button (only when editing) */}
        {isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        )}

        {/* Show Applicants Button (DISABLED when editing) */}
        <Button
          variant="secondary"
          disabled={isEditing}
          onClick={() => {
            fetchApplicants();
          }}
        >
          Show Applicants
        </Button>
      </div>
      {appliedUsers.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Applicants ({appliedUsers.length})
          </h3>
          <div className="space-y-4">
            {appliedUsers.map((application) => {
              // Add null checks for applicantDetails
              console.log("application", application);
              const applicant = application?.applicantDetails || {};
              return (
                <Card key={application._id} className="relative">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        {applicant.username || "Unknown User"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {applicant.email || "No email provided"}
                      </p>
                      <Badge variant="outline" className="mt-2">
                        {application.status || "Unknown Status"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {application.status === "Pending" ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:bg-green-50"
                            onClick={() =>
                              handleAccept(application.applicantDetails._id)
                            }
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() =>
                              handleReject(application.applicantDetails._id)
                            }
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Badge
                          variant="outline"
                          className={`text-sm px-3 py-1 ${
                            application.status === "Accepted"
                              ? "bg-green-200 text-green-700"
                              : "bg-red-200 text-red-700"
                          }`}
                        >
                          {application.status}
                        </Badge>
                      )}
                    </div>

{/* get profile */}
<div>
  {/* View Profile Button */}
  <Button
    variant="outline"
    size="sm"
    className="text-blue-600 hover:bg-blue-50"
    onClick={() => handleViewProfile(application.applicantDetails)}
  >
    <Eye className="h-4 w-4 mr-2" />
    View Profile
  </Button>
</div>

{/* Profile Modal */}
<Dialog open={selectedApplicant !== null} onOpenChange={() => setSelectedApplicant(null)}>
  <DialogContent className="bg-white shadow-lg border border-gray-300 backdrop:bg-opacity-20">
    <DialogHeader>
      <DialogTitle>{selectedApplicant?.username || "Unknown User"}</DialogTitle>
      <DialogDescription className="text-gray-500">{selectedApplicant?.email}</DialogDescription>
    </DialogHeader>
    <div className="mt-4 space-y-2">
      <p><strong>Location:</strong> {selectedApplicant?.location || "Not provided"}</p>
      <p><strong>Bio:</strong> {selectedApplicant?.bio || "No bio available"}</p>
      <p><strong>Skills:</strong> {selectedApplicant?.qualifications?.map((q) => q.skills).join(", ") || "Not listed"}</p>
      <p><strong>Experience:</strong> {selectedApplicant?.experience?.map((exp) => `${exp.title} at ${exp.company}`).join(", ") || "No experience listed"}</p>
      <p><strong>Resume:</strong> 
  {selectedApplicant?.resume ? (
    <Button 
      variant="outline" 
      size="sm" 
      className="text-blue-600 hover:bg-blue-50 ml-2"
      onClick={() => window.open(selectedApplicant.resume, "_blank")}
    >
      View Resume
    </Button>
  ) : "Not Available"}
</p>

    </div>
    <DialogClose asChild>
      <Button variant="secondary" className="mt-3 w-full">Close</Button>
    </DialogClose>
  </DialogContent>
</Dialog>

{/* end : get profile */}

                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default JobDetails;
