import React, { useEffect, useState } from 'react';

import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { toast } from 'sonner';

const SignUp = () => {
  const [input, setInput] = useState({
    username: '',
    email: '',
    fullname: '',
    password: '',
    coverimage: '',
    resume: '',
  });

  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changecoverimageHandler = (e) => {
    setInput({ ...input, coverimage: e.target.files?.[0] });
  };

  const changeresumeHandler = (e) => {
    setInput({ ...input, resume: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', input.username);
    formData.append('email', input.email);
    formData.append('fullname', input.fullname);
    formData.append('password', input.password);

    if (input.coverimage) {
      formData.append('coverimage', input.coverimage);
    }
    if (input.resume) {
      formData.append('resume', input.resume);
    }

    try {
      const res = await axios.post('http://localhost:8001/v1/users/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: false,
      });

      if (res.status === 200) {
        navigate('/login');
        toast.success(res.data.message);
      }

        } catch (error) {
            console.log(error);
            //toast.error(error.response.message);
        } finally{
            
        }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg max-w-lg w-full p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Create Your Account</h1>
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <Label className="block text-sm font-medium text-gray-600">Username</Label>
            <Input
              type="text"
              value={input.username}
              name="username"
              onChange={changeEventHandler}
              placeholder="Enter your username"
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-600">Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="Enter your email"
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-600">Full Name</Label>
            <Input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder="Enter your full name"
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-600">Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Enter your password"
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-600">Cover Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={changecoverimageHandler}
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-600">Resume</Label>
            <Input
              type="file"
              accept=".pdf"
              onChange={changeresumeHandler}
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
          >
            Sign Up
          </Button>
        </form>
        <div className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
