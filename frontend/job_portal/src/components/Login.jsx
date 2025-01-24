import React, { useEffect, useState } from 'react'

import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'

import { Button } from '../components/ui/button'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'


const Login = () => {

    const [input, setInput] = useState({
      username: "",
      email: "",
      password: "",
      
    });

    const navigate = useNavigate();
  

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changecoverimageHandler = (e) => {
        setInput({ ...input, coverimage: e.target.files?.[0] });
    }
    const changeresumeHandler = (e) => {
      setInput({ ...input, resume: e.target.files?.[0] });
  }
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();    //formdata object
        formData.append("username", input.username);
        formData.append("email", input.email);

        formData.append("password", input.password);
        
       

        try {
            
            const res = await axios.post('http://localhost:8001/v1/users/login', input, {
                headers: { 'Content-Type': "application/json" },
                withCredentials: false,
            });
            console.log(res.data.success);
            
            if (res.status == 200) {
              navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            //toast.error(error.response.message);
        } finally{
            
        }
    }

    
    return (
        <div>
            
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                    <div className='my-2'>
                        <Label>username</Label>
                        <Input
                            type="text"
                            value={input.username}
                            name="username"
                            onChange={changeEventHandler}
                            placeholder="username"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="email"
                        />
                    </div>
                    
                    <div className='my-2'>
                        <Label>password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="password"
                        />
                    </div>
                    
                    
                    <Button type="submit" className="w-full my-4">Signup</Button>
                   
                    <span className='text-sm'>Don't have an account? <Link to="/signup" className='text-blue-600'>SignUp</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Login