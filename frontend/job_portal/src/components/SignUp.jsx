import React, { useEffect, useState } from 'react'

import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'

import { Button } from '../components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'


const SignUp = () => {

    const [input, setInput] = useState({
      username: "",
      email: "",
      fullname: "",
      password: "",
      coverimage: "",
      resume:"",
    });
  

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
        formData.append("fullname", input.fullname);
        formData.append("password", input.password);
        
        if (input.coverimage) {
            formData.append("coverimage", input.coverimage);
        }
        if (input.resume) {
          formData.append("resume", input.resume);
      }

        try {
            
            const res = await axios.post('http://localhost:8001/v1/users/register', formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: false,
            });
            console.log(res.data.success);
            
            if (res.data.success) {
                navigate("/login");
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
                        <Label>fullname</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="fullname"
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
                    <div className='my-2'>
                    <Label>coverimage</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changecoverimageHandler}
                                className="cursor-pointer"
                            />
                    </div>
                    <div className='my-2'>
                    <Label>resume</Label>
                            <Input
                                accept=".pdf"
                                type="file"
                                onChange={changeresumeHandler}
                                className="cursor-pointer"
                            />
                    </div>
                    <Button type="submit" className="w-full my-4">Signup</Button>
                   
                    <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default SignUp