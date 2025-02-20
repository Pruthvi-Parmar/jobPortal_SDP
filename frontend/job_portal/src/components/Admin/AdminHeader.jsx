import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import axios from "axios";

const AdminHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userData);

  const handleClick = async () => {
    console.log("inside logout");
    console.log(localStorage.getItem("accessToken"));

    const res = await axios.post(
      "http://localhost:8001/v1/users/logout",
      {},
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
      }
    );
    if (res.data.success) {
      localStorage.setItem("accessToken", null);
      localStorage.setItem("refreshToken", null);
      dispatch(logout());
      navigate("/");
    }
    console.log(res);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-md shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <div className="mx-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Job<span className="text-[#4F46E5]">Connect</span>
          </h1>
        </div>

        <div className="flex items-center gap-10">
          <ul className="flex font-medium items-center gap-5">
          <Link to="/admin/">
              <li>Home</li>
            </Link>
            <Link to="/admin/jobs">
              <li>Jobs</li>
            </Link>
            <Link to="/admin/users">
              <li>Users</li>
            </Link>
            <Link to="/admin/job-applications">
              <li>Job Applications</li>
            </Link>
          </ul>

          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.coverimage} alt={user.username} />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="">
                  <div className="flex gap-2 space-y-1">
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={user.coverimage} alt={user.username} />
                    </Avatar>
                    <div>
                      <h4 className="font-medium px-3">{user.username}</h4>
                      <p className="text-sm text-muted-foreground">
                        Admin Dashboard
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col my-2 text-gray-600">
                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <LogOut />
                      <Button variant="link" onClick={handleClick}>
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
