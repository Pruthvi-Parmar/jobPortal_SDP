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
      console.log(result);
      if (result.success) {
        const userData = result.data;
        setValue("username", userData.username);
        setValue("email", userData.email);
        setValue("oldemail", userData.email);
        setValue("fullname", userData.fullname);
        setValue("resume", userData.resume);
        setValue("coverimage", userData.coverimage);
        setValue("role", userData.role);
        setValue("bio", userData.bio);
        setValue("location", userData.location);
        setValue("qualifications", userData.qualifications || []);
        setValue("experience", userData.experience || []);
        setValue("company", userData.company || []);
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
    oldemail:'',
    username: "",
    email: "",
    fullname: "",
    resume: "",
    coverimage: "",
    role: "",
    bio: "",
    location: "",
    qualifications: [],
    experience: [],
    company: [],
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
    console.log(data);
    
    try {
      const response = await fetch("http://localhost:8001/v1/users/updateAccountDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
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

            {/* Fullname */}
            {formValues.fullname && (
              <div>
                <Label htmlFor="fullname">Full Name</Label>
                <Input id="fullname" {...register("fullname")} disabled={!isEditing} />
              </div>
            )}

            {/* Resume */}
            {formValues.resume && (
              <div>
                <Label htmlFor="resume">Resume</Label>
                <div className="flex items-center gap-4">
                  <Input id="resume" {...register("resume")} disabled={!isEditing} />
                  <a
                    href={formValues.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Preview
                  </a>
                  {isEditing && (
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileChange(e, "resume")}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Cover Image */}
            {formValues.coverimage && (
              <div>
                <Label htmlFor="coverimage">Cover Image</Label>
                <div className="flex items-center gap-4">
                  <Input id="coverimage" {...register("coverimage")} disabled={!isEditing} />
                  <img
                    src={formValues.coverimage}
                    alt="Cover"
                    className="w-16 h-16 object-cover rounded"
                  />
                  {isEditing && (
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "coverimage")}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Role */}
            {formValues.role && (
              <div>
                <Label htmlFor="role">Role</Label>
                <Input id="role" {...register("role")} disabled={true} />
              </div>
            )}

            {/* Bio */}
            {formValues.bio && (
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" {...register("bio")} disabled={!isEditing} />
              </div>
            )}

            {/* Location */}
            {formValues.location && (
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register("location")} disabled={!isEditing} />
              </div>
            )}

            {/* Qualifications */}
            {formValues.qualifications?.length > 0 && (
              <div>
                <Label htmlFor="qualifications">Qualifications</Label>
                {formValues.qualifications.map((qualification, index) => (
                  <div key={index} className="space-y-2">
                    <Input
                      id={`qualifications[${index}].education`}
                      {...register(`qualifications[${index}].education`)}
                      disabled={!isEditing}
                      placeholder="Education"
                    />
                    <Input
                      id={`qualifications[${index}].skills`}
                      {...register(`qualifications[${index}].skills`)}
                      disabled={!isEditing}
                      placeholder="Skills"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Experience */}
            {formValues.experience?.length > 0 && (
              <div>
                <Label htmlFor="experience">Experience</Label>
                {formValues.experience.map((exp, index) => (
                  <div key={index} className="space-y-2">
                    <Input
                      id={`experience[${index}].title`}
                      {...register(`experience[${index}].title`)}
                      disabled={!isEditing}
                      placeholder="Title"
                    />
                    <Input
                      id={`experience[${index}].company`}
                      {...register(`experience[${index}].company`)}
                      disabled={!isEditing}
                      placeholder="Company"
                    />
                    <Input
                      id={`experience[${index}].desc`}
                      {...register(`experience[${index}].desc`)}
                      disabled={!isEditing}
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Company */}
            {formValues.company?.length > 0 && (
              <div>
                <Label htmlFor="company">Company</Label>
                {formValues.company.map((comp, index) => (
                  <div key={index} className="space-y-2">
                    <Input
                      id={`company[${index}].name`}
                      {...register(`company[${index}].name`)}
                      disabled={!isEditing}
                      placeholder="Company Name"
                    />
                    <Input
                      id={`company[${index}].desc`}
                      {...register(`company[${index}].desc`)}
                      disabled={!isEditing}
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
            )}

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
                      setValue("fullname", initialFormValues.fullname);
                      setValue("resume", initialFormValues.resume);
                      setValue("coverimage", initialFormValues.coverimage);
                      setValue("role", initialFormValues.role);
                      setValue("bio", initialFormValues.bio);
                      setValue("location", initialFormValues.location);
                      setValue("qualifications", initialFormValues.qualifications);
                      setValue("experience", initialFormValues.experience);
                      setValue("company", initialFormValues.company);
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