import React, { useState, useEffect } from "react";
import MyJobsCard from "@/components/MyJobsCard";
import { useSelector } from "react-redux";

const MyPostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.userData);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8001/v1/jobs/get-posted-job", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
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

  useEffect(() => {
    fetchJobs();
  }, []);

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">My Jobs</h1>
        <p className="text-center mt-4">Please Login First!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">My Jobs</h1>
      {loading && <p className="text-center mt-4">Loading...</p>}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <MyJobsCard key={job._id} jobDetails={job} />
        ))}
      </div>
    </div>
  );
};

export default MyPostedJobs;
