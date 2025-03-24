import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import {
  Routes,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "./Layout";
import Login from "./components/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import JobsPage from "./pages/JobsPage";
import PostJobForm from "./components/PostJobForm";
import MyJobsPage from "./pages/MyJobsPage";
import MyPostedJobs from "./pages/MyPostedJobs";
import MyPostedJobsTestt from "./pages/MyPostedJobsTestt";
import ProfilePage from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Home2 from "./pages/Home2";
import AdminLayout from "./AdminLayout";
import UsersTable from "./components/Admin/UsersTable";
import JobsTable from "./components/Admin/JobsTable";
import JobApplicationTable from "./components/Admin/JobApplicationsTable";
import TechNews from "./pages/Technews";
import Payment from "./components/Payments";
import Chat from "./components/chat/Chat";
import { useSelector } from "react-redux";
import ATS from "./pages/Ats";
import GoogleLoginComponent from "./components/GoogleLoginComponent";
import ProfileForm from "./components/ProfilePage/ProfileForm";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import JobPage from "./pages/JobPage";
import RaiseTicket from "./pages/RaiseTicket";



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home2 />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="technews" element={<TechNews />} />
        <Route path="ats" element={<ATS />} />
        <Route path="payment" element={<Payment />} />
        <Route path="chat" element={<Chat />} />
        <Route path="oauth" element={<GoogleLoginComponent />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="raise-ticket" element={<RaiseTicket />} />
        

        {/* Protected Routes for Job Seekers */}
        <Route element={<ProtectedRoute allowedRoles={["jobseeker"]} />}>
          <Route path="userhome" element={<JobsPage />} />
          <Route path="myjobs" element={<MyJobsPage />} />
          <Route path="jobs/:jobId" element={<JobPage/>} />
        </Route>

        {/* Protected Routes for Recruiters */}
        <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
          <Route path="recruiterhome" element={<MyPostedJobs />} />
          <Route path="postjob" element={<PostJobForm />} />
        </Route>

       
  
      </Route>
      <Route path="admin" element={<AdminLayout />}>
            <Route path="" element={<AdminDashboard />} />
            <Route path="users" element={<UsersTable />} />
            <Route path="jobs" element={<JobsTable />} />
            <Route path="job-applications" element={<JobApplicationTable />} />
          </Route>
    </Route>
  )
);

function App() {
  

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
