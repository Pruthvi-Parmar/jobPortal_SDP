import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Mail, MapPin, Briefcase, GraduationCap, Building, FileText, ImageIcon, Edit, Save, X } from 'lucide-react';

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
        description: error.message || "Failed to fetch user data",
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
    oldemail: '',
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
    
    try {
      const response = await fetch("http://localhost:8001/v1/users/updateAccountDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          fullname: data.fullname,
          bio: data.bio,
          location: data.location
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user data");
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

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto shadow-lg border-0">
          <CardHeader className="relative pb-0">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg"></div>
            <div className="absolute -bottom-12 left-8 flex items-end">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                <AvatarImage src={formValues.coverimage} />
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xl">
                  {getInitials(formValues.fullname || formValues.username)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex justify-end pt-4">
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditing(true)} 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" /> Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset form values
                      Object.entries(initialFormValues).forEach(([key, value]) => {
                        setValue(key, value);
                      });
                    }}
                  >
                    <X className="h-4 w-4" /> Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={handleSubmit(onSubmit)}
                    disabled={!isFormEdited() || loading}
                  >
                    <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-16 pb-8">
            <form className="space-y-8">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="mb-6 grid grid-cols-3 w-full max-w-md mx-auto">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="professional">Professional</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Username */}
                    <div className="space-y-2">
                      <Label htmlFor="username" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-500" /> Username
                      </Label>
                      <Input 
                        id="username" 
                        {...register("username")} 
                        disabled={!isEditing} 
                        className={!isEditing ? "bg-slate-50" : ""}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-500" /> Email
                      </Label>
                      <Input 
                        id="email" 
                        {...register("email")} 
                        disabled={!isEditing} 
                        className={!isEditing ? "bg-slate-50" : ""}
                      />
                    </div>

                    {/* Fullname */}
                    {formValues.fullname !== undefined && (
                      <div className="space-y-2">
                        <Label htmlFor="fullname" className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-500" /> Full Name
                        </Label>
                        <Input 
                          id="fullname" 
                          {...register("fullname")} 
                          disabled={!isEditing} 
                          className={!isEditing ? "bg-slate-50" : ""}
                        />
                      </div>
                    )}

                    {/* Location */}
                    {formValues.location !== undefined && (
                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-500" /> Location
                        </Label>
                        <Input 
                          id="location" 
                          {...register("location")} 
                          disabled={!isEditing} 
                          className={!isEditing ? "bg-slate-50" : ""}
                        />
                      </div>
                    )}

                    {/* Role */}
                    {formValues.role !== undefined && (
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="role" className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-blue-500" /> Role
                        </Label>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50">
                            {formValues.role}
                          </Badge>
                          <span className="text-xs text-slate-500">(Role cannot be changed)</span>
                        </div>
                      </div>
                    )}

                    {/* Bio */}
                    {formValues.bio !== undefined && (
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio" className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-500" /> Bio
                        </Label>
                        <Textarea 
                          id="bio" 
                          {...register("bio")} 
                          disabled={!isEditing} 
                          className={!isEditing ? "bg-slate-50 min-h-[100px]" : "min-h-[100px]"}
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="professional" className="space-y-8">
                  {/* Qualifications */}
                  {formValues.qualifications?.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-blue-500" /> Qualifications
                      </h3>
                      <Separator />
                      {formValues.qualifications.map((qualification, index) => (
                        <Card key={index} className="bg-slate-50 border-slate-200">
                          <CardContent className="p-4 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`qualifications[${index}].education`} className="text-sm text-slate-500">
                                Education
                              </Label>
                              <Input
                                id={`qualifications[${index}].education`}
                                {...register(`qualifications[${index}].education`)}
                                disabled={!isEditing}
                                className={!isEditing ? "bg-white" : ""}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`qualifications[${index}].skills`} className="text-sm text-slate-500">
                                Skills
                              </Label>
                              <Input
                                id={`qualifications[${index}].skills`}
                                {...register(`qualifications[${index}].skills`)}
                                disabled={!isEditing}
                                className={!isEditing ? "bg-white" : ""}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Experience */}
                  {formValues.experience?.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-blue-500" /> Experience
                      </h3>
                      <Separator />
                      {formValues.experience.map((exp, index) => (
                        <Card key={index} className="bg-slate-50 border-slate-200">
                          <CardContent className="p-4 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`experience[${index}].title`} className="text-sm text-slate-500">
                                Title
                              </Label>
                              <Input
                                id={`experience[${index}].title`}
                                {...register(`experience[${index}].title`)}
                                disabled={!isEditing}
                                className={!isEditing ? "bg-white" : ""}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`experience[${index}].company`} className="text-sm text-slate-500">
                                Company
                              </Label>
                              <Input
                                id={`experience[${index}].company`}
                                {...register(`experience[${index}].company`)}
                                disabled={!isEditing}
                                className={!isEditing ? "bg-white" : ""}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`experience[${index}].desc`} className="text-sm text-slate-500">
                                Description
                              </Label>
                              <Textarea
                                id={`experience[${index}].desc`}
                                {...register(`experience[${index}].desc`)}
                                disabled={!isEditing}
                                className={!isEditing ? "bg-white min-h-[80px]" : "min-h-[80px]"}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Company */}
                  {formValues.company?.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Building className="h-5 w-5 text-blue-500" /> Company
                      </h3>
                      <Separator />
                      {formValues.company.map((comp, index) => (
                        <Card key={index} className="bg-slate-50 border-slate-200">
                          <CardContent className="p-4 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`company[${index}].name`} className="text-sm text-slate-500">
                                Company Name
                              </Label>
                              <Input
                                id={`company[${index}].name`}
                                {...register(`company[${index}].name`)}
                                disabled={!isEditing}
                                className={!isEditing ? "bg-white" : ""}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`company[${index}].desc`} className="text-sm text-slate-500">
                                Description
                              </Label>
                              <Textarea
                                id={`company[${index}].desc`}
                                {...register(`company[${index}].desc`)}
                                disabled={!isEditing}
                                className={!isEditing ? "bg-white min-h-[80px]" : "min-h-[80px]"}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="documents" className="space-y-6">
                  {/* Resume */}
                  {formValues.resume && (
                    <div className="space-y-2">
                      <Label htmlFor="resume" className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" /> Resume
                      </Label>
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <Input 
                            id="resume" 
                            {...register("resume")} 
                            disabled={!isEditing} 
                            className={!isEditing ? "bg-slate-50" : ""}
                          />
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={formValues.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 transition-colors"
                          >
                            <FileText className="h-4 w-4" /> View Resume
                          </a>
                          {isEditing && (
                            <div className="relative">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="relative z-10"
                              >
                                Upload New
                              </Button>
                              <Input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => handleFileChange(e, "resume")}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cover Image */}
                  {formValues.coverimage && (
                    <div className="space-y-2">
                      <Label htmlFor="coverimage" className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-blue-500" /> Profile Image
                      </Label>
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <Input 
                            id="coverimage" 
                            {...register("coverimage")} 
                            disabled={!isEditing} 
                            className={!isEditing ? "bg-slate-50" : ""}
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <div className="h-12 w-12 rounded-full overflow-hidden border border-slate-200">
                            <img
                              src={formValues.coverimage || "/placeholder.svg"}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {isEditing && (
                            <div className="relative">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="relative z-10"
                              >
                                Upload New
                              </Button>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "coverimage")}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
};

export default ProfilePage;
