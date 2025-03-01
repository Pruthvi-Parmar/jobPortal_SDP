import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const JobApplicationTable = () => {
  const [applications, setApplications] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState("");
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      const res = await fetch(
        "http://localhost:8001/v1/admin/getallapplications",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);

        // Extract unique applicants and job titles
        const uniqueApplicants = [
          ...new Set(
            data.data.map((app) => app.applicant?.username || "N/A")
          ),
        ];
        const uniqueJobTitles = [
          ...new Set(data.data.map((app) => app.job?.title || "N/A")),
        ];
        setApplicants(uniqueApplicants);
        setJobTitles(uniqueJobTitles);
      } else {
        setError("Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError("An error occurred while fetching applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Filtering logic
  const filteredApplications = applications.filter((app) => {
    return (
      (selectedApplicant
        ? app.applicant?.username === selectedApplicant
        : true) &&
      (selectedJobTitle ? app.job?.title === selectedJobTitle : true)
    );
  });

  return (
    <div className="p-6 bg-white rounded-md shadow-md mx-auto max-w-4xl overflow-x-auto">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center border-b-2 border-gray-300 pb-2">
        Job Applications
      </h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="py-2 text-left">
                <div className="flex items-center space-x-2">
                  <span>Applicant Username</span>
                  <select
                    value={selectedApplicant}
                    onChange={(e) => setSelectedApplicant(e.target.value)}
                    className="border p-1 rounded text-xs"
                  >
                    <option value="">All</option>
                    {applicants.map((applicant, index) => (
                      <option key={index} value={applicant}>
                        {applicant}
                      </option>
                    ))}
                  </select>
                </div>
              </TableHead>
              <TableHead className="py-2 text-left">Email</TableHead>
              <TableHead className="py-2 text-left">
                <div className="flex items-center space-x-2">
                  <span>Job Title</span>
                  <select
                    value={selectedJobTitle}
                    onChange={(e) => setSelectedJobTitle(e.target.value)}
                    className="border p-1 rounded text-xs"
                  >
                    <option value="">All</option>
                    {jobTitles.map((title, index) => (
                      <option key={index} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                </div>
              </TableHead>
              <TableHead className="py-2 text-left">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <TableRow
                  key={app._id}
                  className="hover:bg-gray-50 border-b transition duration-300"
                >
                  <TableCell className="py-3 px-4">
                    {app.applicant?.username || "N/A"}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    {app.applicant?.email || "N/A"}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    {app.job?.title || "N/A"}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    {app.status || "N/A"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-4 text-gray-500"
                >
                  No applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default JobApplicationTable;
