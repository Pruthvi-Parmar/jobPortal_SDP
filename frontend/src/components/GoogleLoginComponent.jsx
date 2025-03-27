import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { login } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    try {
      const { credential } = response; // Google Token
      //console.log("Google Token:", credential);

      // Send token to backend
      const { data } = await axios.post("https://jobportal-sdp.onrender.com/auth/google", {
        token: credential,
      });

      //console.log("Backend Response:", data);
      //console.log("User:", data.user);

      // Dispatch user data to Redux store
      dispatch(login(data.user));

      // Store JWT token in localStorage
      localStorage.setItem("accessToken", data.accessToken); // FIXED: Correct key name

      // Redirect based on user role
      if (data.user?.role === "jobseeker") {
        navigate("/userhome");
      } else if (data.user?.role === "recruiter") {
        navigate("/recruiterhome");
      }

      toast.success("Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  const handleFailure = (error) => {
    console.error("Google Login Failed:", error);
    toast.error("Google authentication failed.");
  };

  return (
    <div>
      <h2>Login with Google</h2>
      <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
    </div>
  );
};

export default Login;
