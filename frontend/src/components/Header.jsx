import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Button } from "../components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar"
import { Link, useNavigate } from "react-router-dom"
import {
  LogOut,
  User2,
  Menu,
  X,
  BriefcaseBusiness,
  Home,
  MessageCircle,
  FileText,
  Crown,
  Newspaper,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "@/store/authSlice"
import axios from "axios"
import { toast } from "sonner";

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.userData)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  console.log(user)
  if (user) {
    console.log(user.coverimage)
  }

  const handleViewProfile = () => {
    navigate("/profile") // Navigate to the profile page
  }

  const handleClick = async () => {
    console.log("inside logout")
    console.log(localStorage.getItem("accessToken"))

    const res = await axios.post(
      "http://localhost:8001/v1/users/logout",
      {},
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Include the token in the header
        },
        withCredentials: true,
      },
    )
    if (res.data.success) {
      localStorage.setItem("accessToken", null)
      localStorage.setItem("refreshToken", null)
      dispatch(logout())
      navigate("/")
      toast.success(res.data.message)
    }
    console.log(res)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to={user?.role === "jobseeker" ? "/userhome" : user?.role === "recruiter" ? "/recruiterhome" : "/"}
              className="flex items-center"
            >
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                Job<span className="text-primary">Connect</span>
              </h1>
            </Link>
          </div>


          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!user ? (
              <></>
            ) : user.role === "jobseeker" ? (
              <div className="flex items-center space-x-6">
                <Link to="/userhome" className="nav-link group">
                  <div className="flex items-center gap-1.5">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </div>
                  <span className="nav-indicator"></span>
                </Link>
                <Link to="/myjobs" className="nav-link group">
                  <div className="flex items-center gap-1.5">
                    <BriefcaseBusiness className="w-4 h-4" />
                    <span>My Jobs</span>
                  </div>
                  <span className="nav-indicator"></span>
                </Link>
                <Link to="/technews" className="nav-link group">
                  <div className="flex items-center gap-1.5">
                    <Newspaper className="w-4 h-4" />
                    <span>TechInsights</span>
                  </div>
                  <span className="nav-indicator"></span>
                </Link>
                <Link to="/ats" className="nav-link group">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>Resume ATS</span>
                  </div>
                  <span className="nav-indicator"></span>
                </Link>
                {user.isPremium ? (
                  <Link to="/chat" className="nav-link group">
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" />
                      <span>Messages</span>
                    </div>
                    <span className="nav-indicator"></span>
                  </Link>
                ) : (
                  <Link to="/payment" className="nav-link group">
                    <div className="flex items-center gap-1.5">
                      <Crown className="w-4 h-4" />
                      <span>Premium</span>
                    </div>
                    <span className="nav-indicator"></span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/recruiterhome" className="nav-link group">
                  <div className="flex items-center gap-1.5">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </div>
                  <span className="nav-indicator"></span>
                </Link>
                <Link to="/postjob" className="nav-link group">
                  <div className="flex items-center gap-1.5">
                    <BriefcaseBusiness className="w-4 h-4" />
                    <span>Post Job</span>
                  </div>
                  <span className="nav-indicator"></span>
                </Link>
                <Link to="/technews" className="nav-link group">
                  <div className="flex items-center gap-1.5">
                    <Newspaper className="w-4 h-4" />
                    <span>TechInsights</span>
                  </div>
                  <span className="nav-indicator"></span>
                </Link>
                <Link to="/chat" className="nav-link group">
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" />
                    <span>Messages</span>
                  </div>
                  <span className="nav-indicator"></span>
                </Link>
              </div>
            )}
          </nav>

          {/* Auth Buttons or User Menu */}
          <div className="flex items-center">
            {!user ? (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="outline" className="font-medium">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-primary hover:bg-primary/90 font-medium">Signup</Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="p-0 h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/10 transition-all hover:border-primary/30">
                      <AvatarImage src={user.coverimage} alt={user.username || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-4" align="end">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 border-2 border-primary/10">
                        <AvatarImage src={user.coverimage} alt={user.username || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base truncate">{user.username}</h4>
                        <p className="text-sm text-muted-foreground truncate">{user.bio || "No bio available"}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {user.role === "jobseeker" ? "Job Seeker" : "Recruiter"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm h-9 px-2 font-normal"
                        onClick={handleViewProfile}
                      >
                        <User2 className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>

                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm h-9 px-2 font-normal text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={handleClick}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden ml-4">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-3 px-4 shadow-lg">
          <nav className="flex flex-col space-y-3">
            {!user ? (
              <div className="flex justify-center gap-4 py-2">
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" className="w-full">
                  <Button className="w-full">Signup</Button>
                </Link>
              </div>
            ) : user.role === "jobseeker" ? (
              <>
                <Link to="/userhome" className="mobile-nav-link">
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
                <Link to="/myjobs" className="mobile-nav-link">
                  <BriefcaseBusiness className="w-5 h-5" />
                  <span>My Jobs</span>
                </Link>
                <Link to="/technews" className="mobile-nav-link">
                  <Newspaper className="w-5 h-5" />
                  <span>TechInsights</span>
                </Link>
                <Link to="/ats" className="mobile-nav-link">
                  <FileText className="w-5 h-5" />
                  <span>Resume ATS</span>
                </Link>
                {user.isPremium ? (
                  <Link to="/chat" className="mobile-nav-link">
                    <MessageCircle className="w-5 h-5" />
                    <span>Messages</span>
                  </Link>
                ) : (
                  <Link to="/payment" className="mobile-nav-link">
                    <Crown className="w-5 h-5" />
                    <span>Premium</span>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/recruiterhome" className="mobile-nav-link">
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
                <Link to="/postjob" className="mobile-nav-link">
                  <BriefcaseBusiness className="w-5 h-5" />
                  <span>Post Job</span>
                </Link>
                <Link to="/technews" className="mobile-nav-link">
                  <Newspaper className="w-5 h-5" />
                  <span>TechInsights</span>
                </Link>
                <Link to="/chat" className="mobile-nav-link">
                  <MessageCircle className="w-5 h-5" />
                  <span>Messages</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header

