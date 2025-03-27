import { useState } from "react"
import { GoogleLogin } from "@react-oauth/google"
import axios from "axios"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router-dom"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { useDispatch } from "react-redux"
import { login } from "@/store/authSlice"
import { AtSign, Briefcase, FileText, Image, MapPin, User, UserPlus, BookOpen, Building2 } from "lucide-react"
import SignUpHero from "@/components/SignUp/SignUpHero"

const SignUp = () => {
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  const [input, setInput] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
    coverimage: "",
    resume: "",
    role: "jobseeker",
    bio: "",
    location: "",
    qualifications: [{ education: "", certificate: "", skills: "" }],
    experience: [{ title: "", company: "", desc: "" }],
    company: "",
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleGoogleSuccess = async (response) => {
    try {
      const { credential } = response // Google Token

      // Send Google token and all fields to the backend
      const { data } = await axios.post("https://jobportal-sdp.onrender.com/auth/google", {
        token: credential,
        username: input.username,
        email: input.email,
        fullname: input.fullname,
        password: input.password,
        coverimage: input.coverimage,
        resume: input.resume,
        role: input.role,
        bio: input.bio,
        location: input.location,
        qualifications: input.qualifications,
        experience: input.experience,
        company: input.company,
      })

      //console.log("Backend Response:", data)
      toast.success("Sign-up successful!")
      //console.log("ACCESS TOKEN", data.accessToken)
      localStorage.setItem("accessToken", data.accessToken)
      localStorage.setItem("refreshToken", data.refreshToken)
      dispatch(login(data.user))
      // Redirect based on role
      if (data.user?.role === "jobseeker") {
        navigate("/userhome")
      } else if (data.user?.role === "recruiter") {
        navigate("/recruiterhome")
      }
    } catch (error) {
      console.error("Google login failed:", error)
      toast.error(error.response?.data?.message || "An error occurred")
    }
  }

  const handleGoogleFailure = (error) => {
    console.error("Google Login Failed:", error)
    toast.error("Google authentication failed.")
  }

  const changeEventHandler = (e) => {
    const { name, value } = e.target
    if (name.startsWith("qualifications") || name.startsWith("experience")) {
      const [field, index, subField] = name.split(/\[|\]/).filter(Boolean)
      setInput((prev) => ({
        ...prev,
        [field]: prev[field].map((item, i) => (i === Number.parseInt(index) ? { ...item, [subField]: value } : item)),
      }))
    } else {
      setInput({ ...input, [name]: value })
    }
  }

  const changecoverimageHandler = (e) => {
    setInput({ ...input, coverimage: e.target.files?.[0] })
  }

  const changeresumeHandler = (e) => {
    setInput({ ...input, resume: e.target.files?.[0] })
  }

  const addQualification = () => {
    setInput((prev) => ({
      ...prev,
      qualifications: [...prev.qualifications, { education: "", certificate: "", skills: "" }],
    }))
  }

  const addExperience = () => {
    setInput((prev) => ({
      ...prev,
      experience: [...prev.experience, { title: "", company: "", desc: "" }],
    }))
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("username", input.username)
    formData.append("email", input.email)
    formData.append("fullname", input.fullname)
    formData.append("password", input.password)
    formData.append("role", input.role)
    formData.append("bio", input.bio)
    formData.append("location", input.location)

    if (input.role === "jobseeker") {
      input.qualifications.forEach((qual, index) => {
        formData.append(`qualifications[${index}][education]`, qual.education)
        formData.append(`qualifications[${index}][certificate]`, qual.certificate)
        formData.append(`qualifications[${index}][skills]`, qual.skills)
      })

      input.experience.forEach((exp, index) => {
        formData.append(`experience[${index}][title]`, exp.title)
        formData.append(`experience[${index}][company]`, exp.company)
        formData.append(`experience[${index}][desc]`, exp.desc)
      })
    } else if (input.role === "recruiter") {
      formData.append("company", input.company)
    }

    if (input.coverimage) {
      formData.append("coverimage", input.coverimage)
    }
    if (input.resume) {
      formData.append("resume", input.resume)
    }

    try {
      const res = await axios.post(`${API_URL}/users/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: false,
      })

      if (res.status === 200) {
        navigate("/login")
        toast.success(res.data.message)
      }
    } catch (error) {
      //console.log(error)
      toast.error(error.response?.data?.message || "An error occurred")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-indigo-800 p-8 text-white">
            <SignUpHero/>
          </div>

          <div className="md:w-2/3 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
              <p className="text-gray-600 mt-2">Join our community of professionals</p>
            </div>

            <div className="mb-6">
              <div className="flex justify-center">
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
              </div>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
            </div>

            <form onSubmit={submitHandler} className="space-y-5">
              {/* Role Selection */}
              <div className="mb-4">
                <Label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  I am a...
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      input.role === "jobseeker"
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setInput({ ...input, role: "jobseeker" })}
                  >
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">Job Seeker</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Looking for new opportunities</p>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      input.role === "recruiter"
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setInput({ ...input, role: "recruiter" })}
                  >
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">Recruiter</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Hiring talent for your company</p>
                  </div>
                </div>
                <select name="role" value={input.role} onChange={changeEventHandler} className="hidden">
                  <option value="">Select your role</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="jobseeker">Jobseeker</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Username */}
                <div>
                  <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      id="username"
                      name="username"
                      value={input.username}
                      onChange={changeEventHandler}
                      placeholder="Choose a username"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AtSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={input.email}
                      onChange={changeEventHandler}
                      placeholder="Your email address"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <Label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </Label>
                  <Input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={input.fullname}
                    onChange={changeEventHandler}
                    placeholder="Your full name"
                  />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    value={input.password}
                    onChange={changeEventHandler}
                    placeholder="Create a strong password"
                  />
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <Label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={input.bio}
                    onChange={changeEventHandler}
                    placeholder="Tell us about yourself"
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      id="location"
                      name="location"
                      value={input.location}
                      onChange={changeEventHandler}
                      placeholder="City, Country"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Conditional Field for Recruiter */}
                {input.role === "recruiter" && (
                  <div>
                    <Label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input
                        type="text"
                        id="company"
                        name="company"
                        value={input.company}
                        onChange={changeEventHandler}
                        placeholder="Your company name"
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Conditional Fields for Jobseeker */}
              {input.role === "jobseeker" && (
                <div className="space-y-6 border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>

                  {/* Qualifications */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="block text-sm font-medium text-gray-700">Qualifications</Label>
                      <Button
                        type="button"
                        onClick={addQualification}
                        className="inline-flex items-center px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                      >
                        <span>Add</span>
                        <span className="ml-1">+</span>
                      </Button>
                    </div>

                    {input.qualifications.map((qual, index) => (
                      <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-center mb-2">
                          <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Qualification {index + 1}</span>
                        </div>
                        <div className="space-y-3">
                          <Input
                            type="text"
                            value={qual.education}
                            name={`qualifications[${index}][education]`}
                            onChange={changeEventHandler}
                            placeholder="Education (e.g., Bachelor's in Computer Science)"
                            className="text-sm"
                          />
                          <Input
                            type="text"
                            value={qual.certificate}
                            name={`qualifications[${index}][certificate]`}
                            onChange={changeEventHandler}
                            placeholder="Certificate (e.g., AWS Certified Developer)"
                            className="text-sm"
                          />
                          <Input
                            type="text"
                            value={qual.skills}
                            name={`qualifications[${index}][skills]`}
                            onChange={changeEventHandler}
                            placeholder="Skills (e.g., JavaScript, React, Node.js)"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Experience */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="block text-sm font-medium text-gray-700">Experience</Label>
                      <Button
                        type="button"
                        onClick={addExperience}
                        className="inline-flex items-center px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                      >
                        <span>Add</span>
                        <span className="ml-1">+</span>
                      </Button>
                    </div>

                    {input.experience.map((exp, index) => (
                      <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-center mb-2">
                          <Briefcase className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Experience {index + 1}</span>
                        </div>
                        <div className="space-y-3">
                          <Input
                            type="text"
                            value={exp.title}
                            name={`experience[${index}][title]`}
                            onChange={changeEventHandler}
                            placeholder="Job Title"
                            className="text-sm"
                          />
                          <Input
                            type="text"
                            value={exp.company}
                            name={`experience[${index}][company]`}
                            onChange={changeEventHandler}
                            placeholder="Company"
                            className="text-sm"
                          />
                          <textarea
                            value={exp.desc}
                            name={`experience[${index}][desc]`}
                            onChange={changeEventHandler}
                            placeholder="Job Description"
                            rows={3}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* File Uploads */}
              <div className="space-y-5 border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900">Profile Assets</h3>

                {/* Cover Image */}
                <div>
                  <Label htmlFor="coverimage" className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image
                  </Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <Image className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <Input
                        id="coverimage"
                        type="file"
                        accept="image/*"
                        onChange={changecoverimageHandler}
                        className="text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">Upload a professional profile photo (max 5MB)</p>
                    </div>
                  </div>
                </div>

                {/* Resume */}
                <div>
                  <Label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                    Resume
                  </Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <Input id="resume" type="file" accept=".pdf" onChange={changeresumeHandler} className="text-sm" />
                      <p className="mt-1 text-xs text-gray-500">Upload your resume in PDF format (max 10MB)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Create Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp

