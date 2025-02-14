import React, { useEffect, useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const SignUp = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
    coverimage: "",
    resume: "",
    role: "",
    bio: "",
    location: "",
    qualifications: [{ education: "", certificate: "", skills: "" }],
    experience: [{ title: "", company: "", desc: "" }],
    company: "",
  });

  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("qualifications") || name.startsWith("experience")) {
      const [field, index, subField] = name.split(/\[|\]/).filter(Boolean);
      setInput((prev) => ({
        ...prev,
        [field]: prev[field].map((item, i) =>
          i === parseInt(index) ? { ...item, [subField]: value } : item
        ),
      }));
    } else {
      setInput({ ...input, [name]: value });
    }
  };

  const changecoverimageHandler = (e) => {
    setInput({ ...input, coverimage: e.target.files?.[0] });
  };

  const changeresumeHandler = (e) => {
    setInput({ ...input, resume: e.target.files?.[0] });
  };

  const addQualification = () => {
    setInput((prev) => ({
      ...prev,
      qualifications: [
        ...prev.qualifications,
        { education: "", certificate: "", skills: "" },
      ],
    }));
  };

  const addExperience = () => {
    setInput((prev) => ({
      ...prev,
      experience: [...prev.experience, { title: "", company: "", desc: "" }],
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", input.username);
    formData.append("email", input.email);
    formData.append("fullname", input.fullname);
    formData.append("password", input.password);
    formData.append("role", input.role);
    formData.append("bio", input.bio);
    formData.append("location", input.location);

    if (input.role === "jobseeker") {
      // Append qualifications as individual objects
      input.qualifications.forEach((qual, index) => {
        formData.append(`qualifications[${index}][education]`, qual.education);
        formData.append(`qualifications[${index}][certificate]`, qual.certificate);
        formData.append(`qualifications[${index}][skills]`, qual.skills);
      });

      // Append experience as individual objects
      input.experience.forEach((exp, index) => {
        formData.append(`experience[${index}][title]`, exp.title);
        formData.append(`experience[${index}][company]`, exp.company);
        formData.append(`experience[${index}][desc]`, exp.desc);
      });
    } else if (input.role === "recruiter") {
      formData.append("company", input.company);
    }

    if (input.coverimage) {
      formData.append("coverimage", input.coverimage);
    }
    if (input.resume) {
      formData.append("resume", input.resume);
    }

    try {
      const res = await axios.post(
        "http://localhost:8001/v1/users/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: false,
        }
      );

      if (res.status === 200) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 ">
      <div className="bg-white shadow-lg rounded-lg max-w-lg w-full p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Create Your Account
        </h1>
        <form onSubmit={submitHandler} className="space-y-6">
          {/* Role Selection */}
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Role
            </Label>
            <select
              name="role"
              value={input.role}
              onChange={changeEventHandler}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            >
              <option value="">Select your role</option>
              <option value="recruiter">Recruiter</option>
              <option value="jobseeker">Jobseeker</option>
            </select>
          </div>

          {/* Username */}
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Username
            </Label>
            <Input
              type="text"
              value={input.username}
              name="username"
              onChange={changeEventHandler}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
          </div>

          {/* Email */}
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
          </div>

          {/* Full Name */}
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </Label>
            <Input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
          </div>

          {/* Password */}
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
          </div>

          {/* Bio */}
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Bio
            </Label>
            <Input
              type="text"
              value={input.bio}
              name="bio"
              onChange={changeEventHandler}
              placeholder="Enter your bio"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
          </div>

          {/* Location */}
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Location
            </Label>
            <Input
              type="text"
              value={input.location}
              name="location"
              onChange={changeEventHandler}
              placeholder="Enter your location"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
          </div>

          {/* Conditional Fields for Jobseeker */}
          {input.role === "jobseeker" && (
            <>
              {/* Qualifications */}
              <div>
                <Label className="block text-sm font-medium text-gray-600 mb-1">
                  Qualifications
                </Label>
                {input.qualifications.map((qual, index) => (
                  <div key={index} className="space-y-2 mb-4">
                    <Input
                      type="text"
                      value={qual.education}
                      name={`qualifications[${index}][education]`}
                      onChange={changeEventHandler}
                      placeholder="Education"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    />
                    <Input
                      type="text"
                      value={qual.certificate}
                      name={`qualifications[${index}][certificate]`}
                      onChange={changeEventHandler}
                      placeholder="Certificate"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    />
                    <Input
                      type="text"
                      value={qual.skills}
                      name={`qualifications[${index}][skills]`}
                      onChange={changeEventHandler}
                      placeholder="Skills"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addQualification}
                  className="w-full mt-2 bg-indigo-600 text-white font-semibold rounded-lg py-2 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition duration-200"
                >
                  Add Qualification
                </Button>
              </div>

              {/* Experience */}
              <div>
                <Label className="block text-sm font-medium text-gray-600 mb-1">
                  Experience
                </Label>
                {input.experience.map((exp, index) => (
                  <div key={index} className="space-y-2 mb-4">
                    <Input
                      type="text"
                      value={exp.title}
                      name={`experience[${index}][title]`}
                      onChange={changeEventHandler}
                      placeholder="Title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    />
                    <Input
                      type="text"
                      value={exp.company}
                      name={`experience[${index}][company]`}
                      onChange={changeEventHandler}
                      placeholder="Company"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    />
                    <Input
                      type="text"
                      value={exp.desc}
                      name={`experience[${index}][desc]`}
                      onChange={changeEventHandler}
                      placeholder="Description"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addExperience}
                  className="w-full mt-2 bg-indigo-600 text-white font-semibold rounded-lg py-2 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition duration-200"
                >
                  Add Experience
                </Button>
              </div>
            </>
          )}

          {/* Conditional Field for Recruiter */}
          {input.role === "recruiter" && (
            <div>
              <Label className="block text-sm font-medium text-gray-600 mb-1">
                Company
              </Label>
              <Input
                type="text"
                value={input.company}
                name="company"
                onChange={changeEventHandler}
                placeholder="Enter your company"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              />
            </div>
          )}

          {/* Cover Image */}
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Cover Image
            </Label>
            <Input
              type="file"
              accept="image/*"
              onChange={changecoverimageHandler}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
          </div>

          {/* Resume */}
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Resume
            </Label>
            <Input
              type="file"
              accept=".pdf"
              onChange={changeresumeHandler}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition duration-200"
          >
            Sign Up
          </Button>
        </form>

        {/* Login Link */}
        <div className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
  export default SignUp;