import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const PostJobForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("location", data.location);
      formData.append("salary", data.salary);
      formData.append("type", data.type);
      formData.append("overview", data.overview);
      formData.append("responsiblity", data.responsiblity);
      formData.append("requirment", data.requirment);
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      const response = await fetch("http://localhost:8001/v1/jobs/post-job", {
        method: "POST",
        body: formData, // FormData is used for file uploads, so no need for JSON headers
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}` // Include Bearer token
        },
        credentials: "include", // Include credentials if required
      });

      if (!response.ok) {
        throw new Error("Failed to post job");
      }

      const result = await response.json();
      toast({
        title: "Success",
        description: "Job posted successfully!",
      });
      console.log("Job posted:", result);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error posting job:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Post a Job
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </Label>
              <Input
                id="title"
                {...register("title", { required: "Title is required" })}
                placeholder="Enter job title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </Label>
              <Input
                id="location"
                {...register("location", { required: "Location is required" })}
                placeholder="Enter job location"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {errors.location && (
                <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
              )}
            </div>

            {/* Salary */}
            <div>
              <Label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                Salary
              </Label>
              <Input
                id="salary"
                type="number"
                {...register("salary", { required: "Salary is required" })}
                placeholder="Enter salary"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {errors.salary && (
                <p className="text-sm text-red-500 mt-1">{errors.salary.message}</p>
              )}
            </div>

            {/* Job Type */}
            <div>
              <Label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </Label>
              <Input
                id="type"
                {...register("type", { required: "Job type is required" })}
                placeholder="Enter job type (e.g., Full-time, Part-time)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {errors.type && (
                <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
              )}
            </div>

            {/* Overview */}
            <div>
              <Label htmlFor="overview" className="block text-sm font-medium text-gray-700 mb-1">
                Job Overview
              </Label>
              <Textarea
                id="overview"
                {...register("overview", { required: "Overview is required" })}
                placeholder="Enter job overview"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {errors.overview && (
                <p className="text-sm text-red-500 mt-1">{errors.overview.message}</p>
              )}
            </div>

            {/* Responsibility */}
            <div>
              <Label htmlFor="responsiblity" className="block text-sm font-medium text-gray-700 mb-1">
                Responsibilities
              </Label>
              <Textarea
                id="responsiblity"
                {...register("responsiblity", { required: "Responsibilities are required" })}
                placeholder="Enter job responsibilities"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {errors.responsiblity && (
                <p className="text-sm text-red-500 mt-1">{errors.responsiblity.message}</p>
              )}
            </div>

            {/* Requirement */}
            <div>
              <Label htmlFor="requirment" className="block text-sm font-medium text-gray-700 mb-1">
                Requirements
              </Label>
              <Textarea
                id="requirment"
                {...register("requirment", { required: "Requirements are required" })}
                placeholder="Enter job requirements"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {errors.requirment && (
                <p className="text-sm text-red-500 mt-1">{errors.requirment.message}</p>
              )}
            </div>

            {/* Cover Image */}
            <div>
              <Label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image
              </Label>
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
            >
              {loading ? "Posting..." : "Post Job"}
            </Button>
          </form>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default PostJobForm;