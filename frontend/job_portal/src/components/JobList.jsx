import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  open: "bg-green-100 text-green-800",
  closed: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  draft: "bg-gray-100 text-gray-800",
};

const JobList = ({ job, onSelectJob }) => {
  return (
    <motion.div
      className="cursor-pointer hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card onClick={() => onSelectJob(job)} className="rounded-lg">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
              <div className="flex items-center space-x-2 text-sm">
                {job.company && (
                  <span className="text-gray-600 font-medium">{job.company}</span>
                )}
                {job.location && (
                  <span className="text-gray-500">• {job.location}</span>
                )}
              </div>
            </div>
            <Badge 
              className={`${statusColors[job.status]} hover:${statusColors[job.status]} ml-2`}
            >
              {job.status}
            </Badge>
          </div>
          
          {job.overview && (
            <p className="text-gray-600 text-sm line-clamp-2">{job.overview}</p>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {job.postedDate && (
              <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
            )}
            {job.type && (
              <span className="text-gray-500">• {job.type}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JobList;