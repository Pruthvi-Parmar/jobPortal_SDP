import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Eye, Users, Briefcase, FileText } from "lucide-react";
import AdminHeader from "@/components/Admin/AdminHeader";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
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

      </div>
    </>
  );
};

export default AdminDashboard;
