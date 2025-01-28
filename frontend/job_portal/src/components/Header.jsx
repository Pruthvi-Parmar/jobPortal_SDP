import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User2, User2Icon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "@/store/authSlice";
import store from "@/store/store";
import axios from "axios";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userData);
  //const user = false
  console.log(user);
  if (user) {
    console.log(user.coverimage);
  }

  const handleClick = async () => {
    console.log("inside logout");
    console.log(localStorage.getItem("accessToken"));

    const res = await axios.post(
      "http://localhost:8001/v1/users/logout",
      {},
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Include the token in the header
        },
        withCredentials: true,
      }
    );
    if (res.data.success) {
      localStorage.setItem("accessToken", null);
      localStorage.setItem("refreshToken", null);
      dispatch(logout());
      navigate("/");
      toast.success(res.data.message);
    }
    console.log(res);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-md shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <div>
          <h1 className="text-2xl font-bold">
            App<span className="text-[#F83002]">Logo</span>
          </h1>
        </div>
        <div className="flex items-center gap-10">
          <ul className="flex font-medium items-center gap-5">
            {!user ? (
              // Case when no user is logged in
              <>
                {/* <Link to="/userhome">
                  <li>Home</li>
                </Link> */}
                {/* <Link to="/login">
                  <li>Login</li>
                </Link> */}
              </>
            ) : user.role === "jobseeker" ? (
              // Case when logged-in user is a jobseeker
              <>
                <Link to="/userhome">
                  <li>Home</li>
                </Link>
                <Link to="/myjobs">
                  <li>My Jobs</li>
                </Link>
              </>
            ) : (
              // Case when logged-in user is a recruiter
              <>
                <Link to="/userhome">
                  <li>Home</li>
                </Link>
                <Link to="/postjob">
                  <li>Post Job</li>
                </Link>
              </>
            )}
          </ul>
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.coverimage} alt="@shadcn" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="">
                  <div className="flex gap-2 space-y-1">
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={user.coverimage} alt="@shadcn" />
                    </Avatar>
                    <div>
                      <h4 className="font-medium px-3">{user.username}</h4>
                      <p className="text-sm text-muted-foreground">
                        bio Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Hic, nihil!
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col my-2 text-gray-600">
                    {user && (
                      <div className="flex w-fit items-center gap-2 cursor-pointer">
                        <User2 />
                        <Button variant="link">view profile</Button>
                      </div>
                    )}

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
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
