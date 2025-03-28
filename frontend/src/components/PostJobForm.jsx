"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, MapPin, DollarSign, FileText, Upload, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSelector } from "react-redux"
import axios from "axios"

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Remote"]

const PostJobForm = () => {
  const user = useSelector((state) => state.auth.userData)
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      location: "",
      salary: "",
      type: "",
      overview: "",
      responsiblity: "",
      requirment: "",
    },
  })
  const [coverImage, setCoverImage] = useState(null)
  const [coverImagePreview, setCoverImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formStep, setFormStep] = useState(0)
  const { toast } = useToast()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      //console.log("Form data being submitted:", data)

      const formData = new FormData()

      // Explicitly append each field to FormData
      formData.append("title", data.title || "")
      formData.append("location", data.location || "")
      formData.append("salary", data.salary ? data.salary.toString() : "")
      formData.append("type", data.type || "")
      formData.append("overview", data.overview || "")
      formData.append("responsiblity", data.responsiblity || "")
      formData.append("requirment", data.requirment || "")

      // Only append coverImage if it exists
      if (coverImage) {
        formData.append("coverImage", coverImage)
      } else {
        // Create a blank file as a placeholder if needed
        const blankFile = new File([""], "blank.png", { type: "image/png" })
        formData.append("coverImage", blankFile)
      }

      // Log FormData entries to verify
      for (const pair of formData.entries()) {
        //console.log(pair[0], pair[1])
      }

      //TODO:
      const res = await axios.post(
        `${API_URL}/users/getCurrentUser`,
        {},
        { 
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, 
          },
        }
      );

      const user1 = res.data.data


      if(user1.isAllowedToPostJob){

      const response = await fetch(`${API_URL}/jobs/post-job`, {
        method: "POST",
        body: formData,
        headers: {
          // Don't set Content-Type for FormData, browser will set it with boundary
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to post job")
      }

      const result = await response.json()
      toast({
        title: "Success",
        description: "Job posted successfully!",
      })
      //console.log("Job posted:", result)
    }else{
      toast({
        title: "Failed",
        description: "You are not allowed to post jobs wait for verification!",
      })
    }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      console.error("Error posting job:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverImage(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const nextStep = () => {
    setFormStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setFormStep((prev) => prev - 1)
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Post a New Job</h1>
          <p className="text-muted-foreground mt-2">Fill out the form below to create a new job listing</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${formStep >= 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              1
            </div>
            <div className={`h-1 w-12 mx-2 ${formStep >= 1 ? "bg-primary" : "bg-muted"}`}></div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${formStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              2
            </div>
            <div className={`h-1 w-12 mx-2 ${formStep >= 2 ? "bg-primary" : "bg-muted"}`}></div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${formStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              3
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Step {formStep + 1} of 3</div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {formStep === 0 && "Basic Information"}
              {formStep === 1 && "Job Description"}
              {formStep === 2 && "Cover Image & Review"}
            </CardTitle>
            <CardDescription>
              {formStep === 0 && "Enter the basic details about the job position"}
              {formStep === 1 && "Provide detailed information about the job"}
              {formStep === 2 && "Upload a cover image and review your job posting"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="jobForm" onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Basic Information */}
              {formStep === 0 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                          Job Title
                        </Label>
                        <Input
                          id="title"
                          {...register("title", { required: "Job title is required" })}
                          placeholder="e.g. Senior Frontend Developer"
                        />
                        {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          Location
                        </Label>
                        <Input
                          id="location"
                          {...register("location", { required: "Location is required" })}
                          placeholder="e.g. New York, NY or Remote"
                        />
                        {errors.location && <p className="text-sm text-destructive mt-1">{errors.location.message}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="salary" className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                            Salary
                          </Label>
                          <Input
                            id="salary"
                            type="number"
                            {...register("salary", {
                              required: "Salary is required",
                              valueAsNumber: true, // Ensure it's treated as a number
                            })}
                            placeholder="e.g. 75000"
                          />
                          {errors.salary && <p className="text-sm text-destructive mt-1">{errors.salary.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="type" className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            Job Type
                          </Label>
                          <Controller
                            name="type"
                            control={control}
                            rules={{ required: "Job type is required" }}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger id="type">
                                  <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {JOB_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Job Description */}
              {formStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="overview" className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        Job Overview
                      </Label>
                      <Textarea
                        id="overview"
                        {...register("overview", { required: "Overview is required" })}
                        placeholder="Provide a brief overview of the job position"
                        rows={4}
                      />
                      {errors.overview && <p className="text-sm text-destructive mt-1">{errors.overview.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="responsiblity" className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                        Responsibilities
                      </Label>
                      <Textarea
                        id="responsiblity"
                        {...register("responsiblity", { required: "Responsibilities are required" })}
                        placeholder="List the key responsibilities for this position"
                        rows={5}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Tip: Use bullet points for better readability (e.g. - Develop user interfaces)
                      </p>
                      {errors.responsiblity && (
                        <p className="text-sm text-destructive mt-1">{errors.responsiblity.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requirment" className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                        Requirements
                      </Label>
                      <Textarea
                        id="requirment"
                        {...register("requirment", { required: "Requirements are required" })}
                        placeholder="List the skills, qualifications, and experience required"
                        rows={5}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Tip: Use bullet points for better readability (e.g. - 3+ years of experience)
                      </p>
                      {errors.requirment && (
                        <p className="text-sm text-destructive mt-1">{errors.requirment.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Cover Image & Review */}
              {formStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="coverImage" className="flex items-center">
                        <Upload className="h-4 w-4 mr-2 text-muted-foreground" />
                        Cover Image
                      </Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                        <Input
                          id="coverImage"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Label htmlFor="coverImage" className="cursor-pointer">
                          {coverImagePreview ? (
                            <div className="space-y-2">
                              <img
                                src={coverImagePreview || "/placeholder.svg"}
                                alt="Cover preview"
                                className="mx-auto max-h-48 rounded-md object-cover"
                              />
                              <p className="text-sm text-muted-foreground">Click to change image</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                              <p className="text-sm font-medium">Click to upload an image</p>
                              <p className="text-xs text-muted-foreground">Recommended size: 1200 x 630 pixels</p>
                            </div>
                          )}
                        </Label>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Review Your Job Posting</h3>
                      <Alert>
                        <AlertDescription>
                          Please review all information before submitting. Once posted, your job will be visible to all
                          users.
                        </AlertDescription>
                      </Alert>

                      {/* Display a summary of the form data */}
                      <div className="space-y-3 mt-4 p-4 bg-muted/30 rounded-lg">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm font-medium">Job Title:</p>
                            <p className="text-sm">{watch("title")}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Location:</p>
                            <p className="text-sm">{watch("location")}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Salary:</p>
                            <p className="text-sm">${watch("salary")}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Job Type:</p>
                            <p className="text-sm">{watch("type")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {formStep > 0 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            {formStep === 0 && <div></div>}

            {formStep < 2 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" form="jobForm" disabled={loading} className="bg-primary hover:bg-primary/90">
                {loading ? "Posting..." : "Post Job"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}

export default PostJobForm

