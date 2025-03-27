import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const MyPostedJobsTestt = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedUsers, setAppliedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.userData);
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  // Fetch user's posted jobs
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/jobs/get-posted-job`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const result = await response.json();
      if (result.success) {
        setJobs(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch jobs");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch applicants for the selected job
  const fetchApplicants = async (jobId) => {
    if (!jobId) return;

    setLoadingApplicants(true);
    setAppliedUsers([]);

    try {
      const response = await fetch(`${API_URL}/application/get-job-application`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ jobId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applicants");
      }

      const result = await response.json();
      if (result.success) {
        setAppliedUsers(result.data.map((app) => app.applicantDetails));
      } else {
        throw new Error(result.message || "Failed to fetch applicants");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingApplicants(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle job selection
  const handleJobClick = (job) => {
    setSelectedJob(job);
    fetchApplicants(job._id);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold text-center">My Jobs</h1>
        <p className="text-center mt-4 text-gray-500">Please Login First!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Job List */}
      <motion.div
        className="col-span-1 bg-gray-50 p-5 rounded-lg shadow-md overflow-y-auto max-h-[80vh]"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Posted Jobs</h2>
        {loading ? (
          <Skeleton className="h-32 w-full rounded-md" />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <Card
              key={job._id}
              className="mb-3 cursor-pointer hover:shadow-lg transition"
              onClick={() => handleJobClick(job)}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <p className="text-gray-600 text-sm">{job.location}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No jobs posted yet.</p>
        )}
      </motion.div>

      {/* Right Column: Expanded Job Details */}
      <motion.div
        className="col-span-2 bg-white shadow-lg p-6 rounded-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: selectedJob ? 1 : 0, x: selectedJob ? 0 : 20 }}
        transition={{ duration: 0.3 }}
      >
        {selectedJob ? (
          <>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-2xl">{selectedJob.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{selectedJob.description}</p>
                <p className="mt-2"><strong>Location:</strong> {selectedJob.location}</p>
                <p className="mt-2"><strong>Salary:</strong> {selectedJob.salary}</p>
              </CardContent>
            </Card>

            {/* Applied Users */}
            <h3 className="text-xl font-semibold mt-6">Applicants</h3>
            {loadingApplicants ? (
              <Skeleton className="h-20 w-full rounded-md mt-2" />
            ) : appliedUsers.length > 0 ? (
              <div className="space-y-3 mt-4">
                {appliedUsers.map((user, index) => (
                  <Card key={index} className="p-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium">{user.username}</h4>
                      <p className="text-gray-500">{user.email}</p>
                    </div>
                    <Button variant="outline">View Profile</Button>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-4">No applicants yet.</p>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500">Click on a job to see details</p>
        )}
      </motion.div>
    </div>
  );
};

export default MyPostedJobsTestt;
