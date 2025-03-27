import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Search, Filter, RefreshCw, Briefcase, Clock, CheckCircle, XCircle, AlertCircle, ChevronDown, Calendar, MapPin, Building } from 'lucide-react';

// Assuming you have these components from shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MyJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const user = useSelector(state => state.auth.userData);
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      document.cookie = `accessToken=${localStorage.getItem('accessToken')}; path=/;`;
      const response = await fetch(`${API_URL}/application/get-applicants-job`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        withCredentials: true,
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const result = await response.json();

      if (result.success) {
        //console.log(result.data);
        setJobs(result.data);
        setFilteredJobs(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch jobs");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === "") {
      filterJobsByStatus(statusFilter, jobs);
    } else {
      const filtered = jobs.filter(job => 
        job.jobDetails.title.toLowerCase().includes(term.toLowerCase()) ||
        job.jobDetails.location.toLowerCase().includes(term.toLowerCase()) ||
        job.jobDetails.overview.toLowerCase().includes(term.toLowerCase())
      );
      filterJobsByStatus(statusFilter, filtered);
    }
  };

  const filterJobsByStatus = (status, jobsArray = jobs) => {
    setStatusFilter(status);
    
    if (status === "all") {
      setFilteredJobs(jobsArray);
    } else {
      const filtered = jobsArray.filter(job => job.status.toLowerCase() === status.toLowerCase());
      setFilteredJobs(filtered);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Stats calculation
  const getStats = () => {
    if (!jobs.length) return { total: 0, pending: 0, accepted: 0, rejected: 0 };
    
    return {
      total: jobs.length,
      pending: jobs.filter(job => job.status.toLowerCase() === "pending").length,
      accepted: jobs.filter(job => job.status.toLowerCase() === "accepted").length,
      rejected: jobs.filter(job => job.status.toLowerCase() === "rejected").length
    };
  };

  const stats = getStats();

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: <Clock className="w-3 h-3 mr-1" /> },
      accepted: { color: "bg-green-100 text-green-800 border-green-200", icon: <CheckCircle className="w-3 h-3 mr-1" /> },
      rejected: { color: "bg-red-100 text-red-800 border-red-200", icon: <XCircle className="w-3 h-3 mr-1" /> },
      default: { color: "bg-gray-100 text-gray-800 border-gray-200", icon: <AlertCircle className="w-3 h-3 mr-1" /> }
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.default;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} border`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Job card component
  const JobCard = ({ job }) => {
    return (
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-200 hover:border-primary/20">
        <CardHeader className="p-4 pb-0 flex flex-row justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{job.jobDetails.title}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              <span>{job.jobDetails.location}</span>
            </div>
          </div>
          <StatusBadge status={job.status} />
        </CardHeader>
        
        <CardContent className="p-4">
          <p className="text-sm text-gray-600 line-clamp-2 h-10">
            {job.jobDetails.overview}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-gray-100">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            <span>Applied on {new Date().toLocaleDateString()}</span>
          </div>
          <Button variant="outline" size="sm" className="text-xs h-8">
            View Details
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Skeleton loader for jobs
  const JobCardSkeleton = () => (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/3 mt-2" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6 mt-2" />
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between items-center">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </Card>
  );

  if (user == null) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Applications</h1>
            <p className="text-gray-500 mb-6">Track and manage your job applications in one place</p>
            <Button className="bg-primary hover:bg-primary/90">Login to View Your Applications</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-500 mt-1">Track and manage your job applications</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4 md:mt-0"
            onClick={handleRefresh}
            disabled={loading || refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Applications</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                </div>
                <div className="bg-primary/10 p-2 rounded-full">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.pending}</h3>
                </div>
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Accepted</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.accepted}</h3>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Rejected</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.rejected}</h3>
                </div>
                <div className="bg-red-100 p-2 rounded-full">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by job title, location..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => filterJobsByStatus(value)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <JobCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No applications found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "You haven't applied to any jobs yet"}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setFilteredJobs(jobs);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && filteredJobs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
            
            {/* Results count */}
            <div className="mt-6 text-sm text-gray-500 text-center">
              Showing {filteredJobs.length} of {jobs.length} applications
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyJobsPage;
