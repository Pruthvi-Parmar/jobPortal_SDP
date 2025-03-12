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
      console.log("Google Token:", credential);

      // Send token to backend
      const { data } = await axios.post("http://localhost:8001/auth/google", {
        token: credential,
      });

      console.log("Backend Response:", data);
      console.log("user : ",data.user);
      dispatch(login(data.user));
      

      // Store JWT token in localStorage
      localStorage.setItem("accessToken", data.token);
      if (user.role === "jobseeker") {
        navigate("/userhome");
      } else if (user.role === "recruiter") {
        navigate("/recruiterhome");
      }

      toast.success("Login successful!");
      //alert("Login Successful!");

      // Redirect user to dashboard or home page
      
      //window.location.href = "/userhome";
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleFailure = (error) => {
    console.error("Google Login Failed:", error);
  };

  return (
    <div>
      <h2>Login with Google</h2>
      <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
    </div>
  );
};

export default Login;
