import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Eye, Users, Briefcase, FileText } from "lucide-react";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
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

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8001/v1/admin/getalluser", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
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

  // Delete User
  const deleteUser = async (userId) => {
    try {
      await fetch("http://localhost:8001/v1/admin/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ userId }),
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Delete Job
  const deleteJob = async (jobId) => {
    try {
      await fetch("http://localhost:8001/v1/admin/delete-job", {
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

      {/* Users Table */}
      <h2 className="text-2xl font-semibold mt-6">Users</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => deleteUser(user._id)}>
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Jobs Table */}
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
    </div>
  );
};

export default AdminDashboard;
