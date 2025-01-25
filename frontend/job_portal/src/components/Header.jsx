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
const Header = () => {
    const user = true
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
            <Link to="/userhome"><li>Home</li></Link>
            <Link to="/myjobs"><li>MyJobs</li></Link>
          </ul>
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login"><Button variant="outline">Login</Button></Link>
              <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
             
             
                
             
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={"https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="">
                  <div className="flex gap-2 space-y-1">
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={"https://github.com/shadcn.png"}
                        alt="@shadcn"
                      />
                    </Avatar>
                    <div>
                      <h4 className="font-medium px-3">name</h4>
                      <p className="text-sm text-muted-foreground">
                        bio Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, nihil!
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col my-2 text-gray-600">
                    {user && (
                      <div className="flex w-fit items-center gap-2 cursor-pointer">
                        <User2 />
                        <Button variant="link">
                          view profile
                        </Button>
                      </div>
                    )}

                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <LogOut />
                      <Button variant="link">
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
