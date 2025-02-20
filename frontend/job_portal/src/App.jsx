import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import { Routes, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './Layout';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './pages/Home';
import JobsPage from './pages/JobsPage';
import PostJobForm from './components/PostJobForm';
import MyJobsPage from './pages/MyJobsPage';
import MyPostedJobs from './pages/MyPostedJobs';
import MyPostedJobsTestt from './pages/MyPostedJobsTestt';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import Home2 from './pages/Home2';
import AdminLayout from './AdminLayout';
import UsersTable from './components/Admin/UsersTable';
import JobsTable from './components/Admin/JobsTable';
import JobApplicationTable from './components/Admin/JobApplicationsTable';
import TechNews from './pages/Technews';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>

      <Route path='/' element={<Layout />}>
        <Route path='' element={<Home2 />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='login' element={<Login />} />
        <Route path='userhome' element={<JobsPage />} />
        <Route path='myjobs' element={<MyJobsPage />} />
        <Route path='profile' element={<ProfilePage />} />
        <Route path='technews' element={<TechNews />} />
        {/* <Route path='recruiterhome' element={<MyPostedJobs />} /> */}
        <Route path='recruiterhome' element={<MyPostedJobs />} />
        <Route path='postjob' element={<PostJobForm />} />
        {/* <Route path='admin' element={<AdminDashboard />} /> */}


      </Route>
      <Route path='admin' element={<AdminLayout/>}>
        <Route path='' element={<AdminDashboard />} />
        <Route path='users' element={<UsersTable />} />
        <Route path='jobs' element={<JobsTable />} />
        <Route path='job-applications' element={<JobApplicationTable />} />

      </Route>
    </Route>
  )
)

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
