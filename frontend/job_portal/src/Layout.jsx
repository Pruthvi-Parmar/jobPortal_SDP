import React from 'react'

import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import MyJobsPage from './pages/MyJobsPage'
import PostJobForm from './components/PostJobForm'

function Layout() {
  return (
    <>
    <Header/>
    <PostJobForm/>
    {/* <MyJobsPage/>
    <Outlet /> */}
    </>
  )
}

export default Layout