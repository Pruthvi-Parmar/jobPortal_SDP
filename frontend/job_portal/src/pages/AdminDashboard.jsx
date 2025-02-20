import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Eye, Users, Briefcase, FileText } from "lucide-react";
import AdminHeader from "@/components/Admin/AdminHeader";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchJobs();
    fetchApplications();
  }, []);

  // Fetch Dashboard Data (Total Counts)
  const fetchDashboardData = async () => {
    try {
      const res = await fetch("http://localhost:8001/v1/admin/dashboard", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await res.json();
      if (data.success) setDashboardData(data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:8001/v1/admin/getalljobs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await res.json();
      if (data.success) setJobs(data.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Fetch Applications
  const fetchApplications = async () => {
    try {
      console.log(localStorage.getItem("accessToken"));

      const res = await fetch("http://localhost:8001/v1/admin/getAllApplications", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await res.json();
      if (data.success) setApplications(data.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };


  // Delete Job
  const deleteJob = async (jobId) => {
    try {
      await fetch("http://localhost:8001/v1/admin/deletejob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ jobId }),
      });
      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex items-center gap-3">
              <Users size={28} />
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{dashboardData?.totalUsers || 0}</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center gap-3">
              <Briefcase size={28} />
              <CardTitle>Total Jobs</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{dashboardData?.totalJobs || 0}</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center gap-3">
              <FileText size={28} />
              <CardTitle>Total Applications</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{dashboardData?.totalApplications || 0}</CardContent>
          </Card>
        </div>

        
        {/* Jobs Table */}
        {console.log(jobs)}
        <h2 className="text-2xl font-semibold mt-6">Jobs</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => deleteJob(job._id)}>
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <h2 className="text-2xl font-semibold mt-6">Job Applications</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant Name</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => {
              // Find the user and job details based on stored IDs
              const user = users.find((u) => u._id === app.userId);
              const job = jobs.find((j) => j._id === app.jobId);

              return (
                <TableRow key={app._id}>
                  <TableCell>{user ? user.username : "Unknown User"}</TableCell>
                  <TableCell>{job ? job.title : "Unknown Job"}</TableCell>
                  <TableCell>{user ? user.email : "No Email"}</TableCell>
                  <TableCell>{app.status}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

      </div>
    </>
  );
};

export default AdminDashboard;
