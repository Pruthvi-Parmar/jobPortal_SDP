import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const MyJobsCard = ({ jobDetails,status}) => {
  const { title, location, overview } = jobDetails;
  //console.log(status);
  

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {location}
        </CardDescription>
        <CardDescription className="text-sm text-gray-600 font-bold">
          {status}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700">{overview}</p>
      </CardContent>
    </Card>
  );
};

export default MyJobsCard;