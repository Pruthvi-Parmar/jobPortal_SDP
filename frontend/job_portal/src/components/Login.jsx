import React, { useState } from 'react';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/store/authSlice';


const Login = () => {
  const [input, setInput] = useState({
    username: '',
    email: '',
    password: '',
  });

  const dispatch = useDispatch()

  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8001/v1/users/login', input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      console.log(res);
      localStorage.setItem('accessToken', res.data.data.accessToken);
      localStorage.setItem('refreshToken', res.data.data.refreshToken);
      //console.log();
      
      if (res.data.success) {
        console.log(res.data.data.user);
        
        dispatch(login(res.data.data.user))
        if(res.data.data.user.role == "jobseeker"){
          navigate('/userhome');
        }
        if(res.data.data.user.role == "recruiter"){
          navigate('/');
        }
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg max-w-lg w-full p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Welcome Back!</h1>
        <p className="text-center text-gray-500 text-sm">Log in to access your account</p>
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
          <Button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </Button>
        </form>
        <div className="text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
