import React, { useState, useEffect } from "react";
import JobList from "@/components/JobList";
import JobDetails from "@/components/JobDetails";
import { useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";

const MyPostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const user = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8001/v1/jobs/get-posted-job", {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        const result = await response.json();
        if (result.success) setJobs(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);



  
  return user ? (
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-1 bg-gray-50 p-5 rounded-lg shadow-md overflow-y-auto max-h-[80vh]">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Posted Jobs</h2>
        {loading ? (
          <Skeleton className="h-32 w-full rounded-md" />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : jobs.length > 0 ? (
          jobs.map((job) => <JobList key={job._id} job={job} onSelectJob={setSelectedJob} />)
        ) : (
          <p className="text-gray-500">No jobs posted yet.</p>
        )}
      </div>
      {selectedJob && (
        <JobDetails
          job={selectedJob}
          // onUpdateJob={handleUpdateJob}
          // applicants={appliedUsers}
          // loadingApplicants={loadingApplicants}
          // fetchApplicants={fetchApplicants}
        />
      )}
    </div>
  ) : (
    <p className="text-center">Please Login First!</p>
  );
};

export default MyPostedJobs;
