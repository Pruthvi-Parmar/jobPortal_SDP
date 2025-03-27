"use client";
import { useState, useEffect } from "react";
import JobList from "@/components/JobList";
import JobDetails from "@/components/JobDetails";
import { useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
 

const MyPostedJobs = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const user = useSelector((state) => state.auth.userData);
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/jobs/get-posted-job`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const result = await response.json();
        if (result.success) {
          setJobs(result.data);
          setFilteredJobs(result.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [searchTerm, jobs]);

  const activeJobs = filteredJobs.filter((job) => job.status === "Active");
  const hibernatedJobs = filteredJobs.filter(
    (job) => job.status === "Hibernate"
  );

  return user ? (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Job Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your posted jobs and applicants
            </p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search jobs..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => navigate("/postjob")}>
              <Briefcase className="mr-2 h-4 w-4" />
              New Job
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold flex items-center justify-between">
                Posted Jobs
                <Badge variant="outline" className="ml-2">
                  {jobs.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full rounded-md" />
                  <Skeleton className="h-20 w-full rounded-md" />
                  <Skeleton className="h-20 w-full rounded-md" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center p-6 text-red-500 bg-red-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p>No Jobs Found</p>
                </div>
              ) : (
                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="active">
                      Active
                      <Badge variant="secondary" className="ml-2">
                        {activeJobs.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="hibernated">
                      Hibernated
                      <Badge variant="secondary" className="ml-2">
                        {hibernatedJobs.length}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="active"
                    className="space-y-2 max-h-[60vh] overflow-y-auto pr-2"
                  >
                    {activeJobs.length > 0 ? (
                      activeJobs.map((job) => (
                        <JobList
                          key={job._id}
                          job={job}
                          onSelectJob={setSelectedJob}
                          isSelected={
                            selectedJob && selectedJob._id === job._id
                          }
                        />
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No active jobs found.
                      </p>
                    )}
                  </TabsContent>
                  <TabsContent
                    value="hibernated"
                    className="space-y-2 max-h-[60vh] overflow-y-auto pr-2"
                  >
                    {hibernatedJobs.length > 0 ? (
                      hibernatedJobs.map((job) => (
                        <JobList
                          key={job._id}
                          job={job}
                          onSelectJob={setSelectedJob}
                          isSelected={
                            selectedJob && selectedJob._id === job._id
                          }
                        />
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No hibernated jobs found.
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          {selectedJob ? (
            <JobDetails job={selectedJob} className="col-span-2" />
          ) : (
            <div className="col-span-2 flex items-center justify-center h-96 bg-muted/30 rounded-lg border border-dashed">
              <div className="text-center p-6">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Job Selected</h3>
                <p className="text-muted-foreground max-w-md">
                  Select a job from the list to view details, edit information,
                  or manage applicants.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Authentication Required</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            Please login to access your posted jobs.
          </p>
          <Button className="w-full">Login</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyPostedJobs;
