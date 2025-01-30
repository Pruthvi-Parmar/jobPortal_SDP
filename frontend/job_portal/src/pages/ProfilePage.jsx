import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const ProfilePage = () => {
  const { register, handleSubmit, watch, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Fetch user data from the backend
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8001/v1/users/getCurrentUser",
        {}, // Empty body for POST request
        {
          withCredentials: true, // Include cookies
        }
      );

      const result = response.data;

      if (result.success) {
        const userData = result.data;
        setValue("username", userData.username);
        setValue("email", userData.email);
        setValue("resume", userData.resume);
        setValue("coverimage", userData.coverimage);
        // setValue("role", userData.role); // Role is fetched but not editable
      } else {
        throw new Error(result.message || "Failed to fetch user data");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const formValues = watch();
  const initialValues = {
    username: "",
    email: "",
    resume: "",
    coverimage: "",
    // role: "", // Initial value for role
  };
  const [initialFormValues, setInitialFormValues] = useState(initialValues);

  useEffect(() => {
    if (formValues.username && !initialFormValues.username) {
      setInitialFormValues(formValues);
    }
  }, [formValues]);

  const isFormEdited = () => {
    return JSON.stringify(formValues) !== JSON.stringify(initialFormValues);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8001/v1/users/updateCurrentUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      const result = await response.json();
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      setIsEditing(false);
      setInitialFormValues(data); // Update initial values after successful update
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload for resume and cover image
  const handleFileChange = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulate file upload (replace this with actual file upload logic)
    const uploadedUrl = `http://localhost:8001/uploads/${file.name}`; // Replace with your actual upload logic

    // Update form field with uploaded file URL
    setValue(fieldName, uploadedUrl);
    toast({
      title: "Success",
      description: `${fieldName} updated successfully!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Profile
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username */}
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...register("username")} disabled={!isEditing} />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...register("email")} disabled={!isEditing} />
            </div>

            {/* Resume */}
            <div>
              <Label htmlFor="resume">Resume</Label>
              <div className="flex items-center gap-4">
                <Input id="resume" {...register("resume")} disabled={!isEditing} />
                {formValues.resume && (
                  <a
                    href={formValues.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Preview
                  </a>
                )}
                {isEditing && (
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, "resume")}
                  />
                )}
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <Label htmlFor="coverimage">Cover Image</Label>
              <div className="flex items-center gap-4">
                <Input id="coverimage" {...register("coverimage")} disabled={!isEditing} />
                {formValues.coverimage && (
                  <img
                    src={formValues.coverimage}
                    alt="Cover"
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                {isEditing && (
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "coverimage")}
                  />
                )}
              </div>
            </div>

            {/* Role */}
            {/* <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" {...register("role")} disabled={!isEditing} />
            </div> */}

            {/* Edit/Save Button */}
            <div className="flex justify-end gap-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setValue("username", initialFormValues.username);
                      setValue("email", initialFormValues.email);
                      setValue("resume", initialFormValues.resume);
                      setValue("coverimage", initialFormValues.coverimage);
                      // setValue("role", initialFormValues.role); // Reset role value
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!isFormEdited() || loading}>
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ProfilePage;
