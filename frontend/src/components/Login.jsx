"use client"

import { useState } from "react"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { login } from "@/store/authSlice"
import { AtSign, Lock, User } from "lucide-react"

const Login = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (input.username == "admin") {
      const res = await axios.post("http://localhost:8001/v1/admin/login", input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      localStorage.setItem("accessToken", res.data.data.accessToken)
      localStorage.setItem("refreshToken", res.data.data.refreshToken)
      console.log(res.data.data.accessToken)

      if (res.data.success) {
        console.log(res.data.data.user)

        dispatch(login(res.data.data.user))

        navigate("/admin")

        toast.success(res.data.message)
      }
    }

    try {
      const res = await axios.post("http://localhost:8001/v1/users/login", input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      console.log(res)
      localStorage.setItem("accessToken", res.data.data.accessToken)
      localStorage.setItem("refreshToken", res.data.data.refreshToken)
      //console.log();

      if (res.data.success) {
        console.log(res.data.data.user)

        dispatch(login(res.data.data.user))
        if (res.data.data.user.role == "jobseeker") {
          navigate("/userhome")
        }
        if (res.data.data.user.role == "recruiter") {
          navigate("/recruiterhome")
        }
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-sm text-gray-600">Sign in to access your account and find your dream job</p>
          </div>

          <form onSubmit={submitHandler} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </Label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={input.username}
                    onChange={changeEventHandler}
                    required
                    className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={input.email}
                    onChange={changeEventHandler}
                    required
                    className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Link to="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </Link>
                </div>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={input.password}
                    onChange={changeEventHandler}
                    required
                    className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Sign in
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/signup"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Create a new account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="hidden lg:block lg:w-1/2 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-90"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <h2 className="text-4xl font-bold mb-6">Find Your Dream Job</h2>
          <p className="text-xl max-w-md text-center mb-8">
            Connect with top employers and discover opportunities that match your skills and aspirations.
          </p>
          <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <blockquote className="italic text-white/90">
              "This platform helped me find the perfect job within weeks. The process was seamless and professional."
            </blockquote>
            <div className="mt-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-white/30"></div>
              <div className="ml-3">
                <p className="text-sm font-medium">Sarah Johnson</p>
                <p className="text-xs opacity-75">Software Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

