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
import ProfileForm from "../components/ProfilePage/ProfileForm";

const ProfilePage = () => {
  const { register, handleSubmit, watch, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [role, setRole] = useState("");

  // Define initialFormValues state
  const [initialFormValues, setInitialFormValues] = useState({
    username: "",
    email: "",
    fullname: "",
    bio: "",
    location: "",
    qualifications: [],
    experience: [],
    company: [],
    resume: "",
    coverimage: "",
  });
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  const fetchUserData = async () => {
    setLoading(true);
    try {
        //console.log("TOKEN CHECK")
        //console.log(localStorage.getItem("token")); // Check token in storage
      const response = await axios.post(
        `${API_URL}/users/getCurrentUser`,
        {},
        { 
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, 
          },
        }
      );

      const result = response.data;
      if (result.success) {
        const userData = result.data;
        setValue("username", userData.username);
        setValue("email", userData.email);
        setValue("fullname", userData.fullname);
        setValue("bio", userData.bio);
        setValue("location", userData.location);
        setValue("qualifications", userData.qualifications || []);
        setValue("experience", userData.experience || []);
        setValue("company", userData.company || []);
        setValue("resume", userData.resume);
        setValue("coverimage", userData.coverimage);
        setRole(userData.role);

        setInitialFormValues({
            username: userData.username,
            email: userData.email,
            fullname: userData.fullname,
            bio: userData.bio,
            location: userData.location,
            qualifications: userData.qualifications || [],
            experience: userData.experience || [],
            company: userData.company || [],
            resume: userData.resume,
            coverimage: userData.coverimage,
          });
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

  const onSubmit = async (data) => {
  setLoading(true);

  try {
    const formData = new FormData()
    formData.append("username", data.username)
    formData.append("email", data.email)
    formData.append("fullname", data.fullname)
    //formData.append("password", input.password)
    //formData.append("role", input.role)
    formData.append("bio", data.bio)
    formData.append("location", data.location)
    formData.append("qualifications", data.qualifications)
    formData.append("experience", data.experience)
    formData.append("resume", data.resume)
    
    const response = await fetch(`${API_URL}/users/updateAccountDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      credentials: "include", // Include cookies for authentication
      body: formData,
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

  const handleFileChange = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadedUrl = `http://localhost:8001/uploads/${file.name}`;
    setValue(fieldName, uploadedUrl);
    toast({
      title: "Success",
      description: `${fieldName} updated successfully!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto shadow-lg border-0">
          <CardHeader className="relative pb-0">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg"></div>
            <div className="absolute -bottom-12 left-8 flex items-end">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                <AvatarImage src={watch("coverimage")} />
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xl">
                  {watch("fullname") ? watch("fullname").split(" ").map(n => n[0]).join("").toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex justify-end pt-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="flex items-center gap-1">
                  <Edit className="h-4 w-4" /> Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="h-4 w-4" /> Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                  >
                    <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-16 pb-8">
            <ProfileForm 
              register={register} 
              watch={watch} 
              isEditing={isEditing} 
              role={role} 
              handleFileChange={handleFileChange}
            />
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
};
export default ProfilePage;