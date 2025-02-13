import React, { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import JobCard from "@/components/JobCard";


const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");

  const fetchJobs = async (keyword = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8001/v1/jobs/get-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword }), // Send keyword in the request body
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const result = await response.json();

      if (result.success) {
        setJobs(result.data); // Set jobs from the "data" field in the response
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

  const handleSearch = (keyword) => {
    setKeyword(keyword);
    fetchJobs(keyword);
  };
  const handleResetSearch = () => {
    setKeyword("");
    fetchJobs(); // Fetch default job list again
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Job Listings</h1>
      <div className="flex justify-center mb-8">
        <SearchBar onSearch={handleSearch} />
        {/* <button onClick={handleResetSearch} className="bg-gray-300 p-2 rounded">
          Reset Search
        </button> */}
      </div>
      {loading && <p className="text-center mt-4">Loading...</p>}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      {!loading && !error && jobs.length === 0 && (
        <p className="text-center mt-4">
          No jobs found with the given filters.
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard
            key={job._id}
            jobId={job._id}
            title={job.title}
            location={job.location}
            salary={job.salary}
            type={job.type}
            overview={job.overview}
            responsibility={job.responsiblity} // Note: Typo in backend response
            requirement={job.requirment} // Note: Typo in backend response
            coverImage={job.coverImage}
            status={job.status}
          />
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
