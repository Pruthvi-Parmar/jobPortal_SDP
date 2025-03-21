"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Building,
  FileText,
  ImageIcon,
  Edit3,
  Save,
  X,
  Upload,
} from "lucide-react"

const ProfilePage = () => {
  const { register, handleSubmit, watch, setValue } = useForm()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("personal")

  // Fetch user data from the backend
  const fetchUserData = async () => {
    setLoading(true)
    try {
      const response = await axios.post(
        "http://localhost:8001/v1/users/getCurrentUser",
        {}, // Empty body for POST request
        {
          withCredentials: true, // Include cookies
        },
      )

      const result = response.data
      console.log(result)
      if (result.success) {
        const userData = result.data
        setValue("username", userData.username)
        setValue("email", userData.email)
        setValue("oldemail", userData.email)
        setValue("fullname", userData.fullname)
        setValue("resume", userData.resume)
        setValue("coverimage", userData.coverimage)
        setValue("role", userData.role)
        setValue("bio", userData.bio)
        setValue("location", userData.location)
        setValue("qualifications", userData.qualifications || [])
        setValue("experience", userData.experience || [])
        setValue("company", userData.company || [])
      } else {
        throw new Error(result.message || "Failed to fetch user data")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const formValues = watch()
  const initialValues = {
    oldemail: "",
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
  }
  const [initialFormValues, setInitialFormValues] = useState(initialValues)

  useEffect(() => {
    if (formValues.username && !initialFormValues.username) {
      setInitialFormValues(formValues)
    }
  }, [formValues])

  const isFormEdited = () => {
    return JSON.stringify(formValues) !== JSON.stringify(initialFormValues)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    console.log(data)

    try {
      const response = await fetch("http://localhost:8001/v1/users/updateAccountDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update user data")
      }

      const result = await response.json()
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
      setIsEditing(false)
      setInitialFormValues(data) // Update initial values after successful update
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      console.error("Error updating profile:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle file upload for resume and cover image
  const handleFileChange = async (e, fieldName) => {
    const file = e.target.files[0]
    if (!file) return

    // Simulate file upload (replace this with actual file upload logic)
    const uploadedUrl = `http://localhost:8001/uploads/${file.name}` // Replace with your actual upload logic

    // Update form field with uploaded file URL
    setValue(fieldName, uploadedUrl)
    toast({
      title: "Success",
      description: `${fieldName} updated successfully!`,
    })
  }

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "JC" // JobConnect default
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="relative mb-8">
            <div className="h-48 w-full rounded-t-xl bg-gradient-to-r from-indigo-500 to-purple-600 overflow-hidden">
              {formValues.coverimage && (
                <img
                  src={formValues.coverimage || "/placeholder.svg"}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="absolute -bottom-16 left-8 flex items-end">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={formValues.coverimage} />
                  <AvatarFallback className="bg-indigo-600 text-white text-3xl">
                    {getInitials(formValues.fullname)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md cursor-pointer"
                  >
                    <Upload className="h-4 w-4 text-indigo-600" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "coverimage")}
                    />
                  </label>
                )}
              </div>
              <div className="ml-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{formValues.fullname || "Your Name"}</h1>
                <p className="text-gray-600">{formValues.role || "Job Seeker"}</p>
              </div>
            </div>

            <div className="absolute top-4 right-4">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setIsEditing(false)
                      setValue("username", initialFormValues.username)
                      setValue("email", initialFormValues.email)
                      setValue("fullname", initialFormValues.fullname)
                      setValue("resume", initialFormValues.resume)
                      setValue("coverimage", initialFormValues.coverimage)
                      setValue("role", initialFormValues.role)
                      setValue("bio", initialFormValues.bio)
                      setValue("location", initialFormValues.location)
                      setValue("qualifications", initialFormValues.qualifications)
                      setValue("experience", initialFormValues.experience)
                      setValue("company", initialFormValues.company)
                    }}
                    variant="outline"
                    className="bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={!isFormEdited() || loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-20">
            <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
              </TabsList>

              {/* Personal Info Tab */}
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-indigo-600" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" {...register("username")} disabled={!isEditing} className="bg-white" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" {...register("email")} disabled={!isEditing} className="bg-white" />
                      </div>

                      {formValues.fullname !== undefined && (
                        <div className="space-y-2">
                          <Label htmlFor="fullname">Full Name</Label>
                          <Input id="fullname" {...register("fullname")} disabled={!isEditing} className="bg-white" />
                        </div>
                      )}

                      {formValues.location !== undefined && (
                        <div className="space-y-2">
                          <Label htmlFor="location" className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-indigo-600" />
                            Location
                          </Label>
                          <Input id="location" {...register("location")} disabled={!isEditing} className="bg-white" />
                        </div>
                      )}
                    </div>

                    {formValues.bio !== undefined && (
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          {...register("bio")}
                          disabled={!isEditing}
                          className="min-h-[120px] bg-white resize-none"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {formValues.resume && (
                        <div className="space-y-2">
                          <Label htmlFor="resume" className="flex items-center">
                            <FileText className="h-4 w-4 mr-1 text-indigo-600" />
                            Resume
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input id="resume" {...register("resume")} disabled={!isEditing} className="bg-white" />
                            <a
                              href={formValues.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 inline-flex h-9 items-center justify-center rounded-md bg-indigo-50 px-3 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
                            >
                              View
                            </a>
                          </div>
                          {isEditing && (
                            <div className="mt-2">
                              <label htmlFor="resume-upload" className="cursor-pointer">
                                <div className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700">
                                  <Upload className="h-4 w-4" />
                                  Upload new resume
                                </div>
                                <Input
                                  id="resume-upload"
                                  type="file"
                                  accept="application/pdf"
                                  onChange={(e) => handleFileChange(e, "resume")}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      )}

                      {formValues.coverimage && (
                        <div className="space-y-2">
                          <Label htmlFor="coverimage" className="flex items-center">
                            <ImageIcon className="h-4 w-4 mr-1 text-indigo-600" />
                            Profile Image
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="coverimage"
                              {...register("coverimage")}
                              disabled={!isEditing}
                              className="bg-white"
                            />
                            <div className="shrink-0 h-9 w-9 rounded-md overflow-hidden">
                              <img
                                src={formValues.coverimage || "/placeholder.svg"}
                                alt="Cover"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </div>
                          {isEditing && (
                            <div className="mt-2">
                              <label htmlFor="coverimage-upload" className="cursor-pointer">
                                <div className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700">
                                  <Upload className="h-4 w-4" />
                                  Upload new image
                                </div>
                                <Input
                                  id="coverimage-upload"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileChange(e, "coverimage")}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Qualifications Tab */}
              <TabsContent value="qualifications">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2 text-indigo-600" />
                      Qualifications & Skills
                    </CardTitle>
                    <CardDescription>Showcase your educational background and professional skills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {formValues.qualifications?.length > 0 ? (
                      <div className="space-y-6">
                        {formValues.qualifications.map((qualification, index) => (
                          <div key={index} className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`qualifications[${index}].education`} className="text-indigo-600">
                                  Education
                                </Label>
                                <Input
                                  id={`qualifications[${index}].education`}
                                  {...register(`qualifications[${index}].education`)}
                                  disabled={!isEditing}
                                  placeholder="Education"
                                  className="bg-white"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`qualifications[${index}].skills`} className="text-indigo-600">
                                  Skills
                                </Label>
                                <Input
                                  id={`qualifications[${index}].skills`}
                                  {...register(`qualifications[${index}].skills`)}
                                  disabled={!isEditing}
                                  placeholder="Skills"
                                  className="bg-white"
                                />
                              </div>
                              {!isEditing && formValues.qualifications[index].skills && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {formValues.qualifications[index].skills.split(",").map((skill, skillIndex) => (
                                    <Badge
                                      key={skillIndex}
                                      variant="secondary"
                                      className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                    >
                                      {skill.trim()}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            {index < formValues.qualifications.length - 1 && <Separator className="my-4" />}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <GraduationCap className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <p>No qualifications added yet</p>
                        {isEditing && (
                          <Button
                            onClick={() => setValue("qualifications", [{ education: "", skills: "" }])}
                            variant="outline"
                            className="mt-4"
                          >
                            Add Qualification
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-indigo-600" />
                      Work Experience
                    </CardTitle>
                    <CardDescription>Share your professional journey and work history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {formValues.experience?.length > 0 ? (
                      <div className="space-y-6">
                        {formValues.experience.map((exp, index) => (
                          <div key={index} className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`experience[${index}].title`} className="text-indigo-600">
                                  Job Title
                                </Label>
                                <Input
                                  id={`experience[${index}].title`}
                                  {...register(`experience[${index}].title`)}
                                  disabled={!isEditing}
                                  placeholder="Job Title"
                                  className="bg-white"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`experience[${index}].company`} className="text-indigo-600">
                                  Company
                                </Label>
                                <Input
                                  id={`experience[${index}].company`}
                                  {...register(`experience[${index}].company`)}
                                  disabled={!isEditing}
                                  placeholder="Company"
                                  className="bg-white"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`experience[${index}].desc`} className="text-indigo-600">
                                  Description
                                </Label>
                                <Textarea
                                  id={`experience[${index}].desc`}
                                  {...register(`experience[${index}].desc`)}
                                  disabled={!isEditing}
                                  placeholder="Description"
                                  className="min-h-[100px] bg-white resize-none"
                                />
                              </div>
                            </div>
                            {index < formValues.experience.length - 1 && <Separator className="my-4" />}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <p>No work experience added yet</p>
                        {isEditing && (
                          <Button
                            onClick={() => setValue("experience", [{ title: "", company: "", desc: "" }])}
                            variant="outline"
                            className="mt-4"
                          >
                            Add Experience
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Company Tab */}
              <TabsContent value="company">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="h-5 w-5 mr-2 text-indigo-600" />
                      Company Information
                    </CardTitle>
                    <CardDescription>Details about your company or organization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {formValues.company?.length > 0 ? (
                      <div className="space-y-6">
                        {formValues.company.map((comp, index) => (
                          <div key={index} className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`company[${index}].name`} className="text-indigo-600">
                                  Company Name
                                </Label>
                                <Input
                                  id={`company[${index}].name`}
                                  {...register(`company[${index}].name`)}
                                  disabled={!isEditing}
                                  placeholder="Company Name"
                                  className="bg-white"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`company[${index}].desc`} className="text-indigo-600">
                                  Description
                                </Label>
                                <Textarea
                                  id={`company[${index}].desc`}
                                  {...register(`company[${index}].desc`)}
                                  disabled={!isEditing}
                                  placeholder="Description"
                                  className="min-h-[100px] bg-white resize-none"
                                />
                              </div>
                            </div>
                            {index < formValues.company.length - 1 && <Separator className="my-4" />}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Building className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <p>No company information added yet</p>
                        {isEditing && (
                          <Button
                            onClick={() => setValue("company", [{ name: "", desc: "" }])}
                            variant="outline"
                            className="mt-4"
                          >
                            Add Company
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Only show submit button when editing and not in the tabs UI */}
            {isEditing && (
              <div className="mt-8 flex justify-end">
                <Button
                  type="submit"
                  disabled={!isFormEdited() || loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default ProfilePage

