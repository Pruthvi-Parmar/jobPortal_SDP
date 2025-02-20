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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, Eye } from "lucide-react";

const JobsTable = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [creators, setCreators] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState("");

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:8001/v1/admin/getalljobs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setJobs(data.data);
        const uniqueCreators = [...new Set(data.data.map(job => job.createdBy._id))];
        setCreators(uniqueCreators);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleFilterChange = (e) => {
    setSelectedCreator(e.target.value);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = selectedCreator ? jobs.filter(job => job.createdBy._id === selectedCreator) : jobs;

  return (
    <div className="p-6 bg-white rounded-md shadow-md mx-auto max-w-4xl">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center border-b-2 border-gray-300 pb-2">
        Job Management
      </h2>
      
      <Table className="w-full border-collapse">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="py-2 text-left">Job Title</TableHead>
            <TableHead className="py-2 text-left flex items-center gap-2">Created By <select value={selectedCreator} onChange={handleFilterChange} className="border p-1 rounded text-sm">
  <option value="">All</option>
  {creators.map((creator, index) => (
    <option key={index} value={creator}>{creator}</option>
  ))}
</select></TableHead>
            <TableHead className="py-2 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredJobs.map((job) => (
            <TableRow key={job._id} className="hover:bg-gray-50 border-b transition duration-300">
              <TableCell className="py-3 px-4">{job.title}</TableCell>
              <TableCell className="py-3 px-4">{job.createdBy._id}</TableCell>
              <TableCell className="py-3 px-4 text-center">
                <Button variant="ghost" className="text-blue-500 hover:bg-blue-100 p-2 rounded-full">
                  <Eye size={18} />
                </Button>
                <Button variant="ghost" className="text-red-500 hover:bg-red-100 p-2 rounded-full">
                  <Trash2 size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobsTable;
