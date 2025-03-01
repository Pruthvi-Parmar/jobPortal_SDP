import React from 'react'

import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import MyJobsPage from './pages/MyJobsPage'
import PostJobForm from './components/PostJobForm'
import Footer from './components/Footer'

function Layout() {
  return (
    <>
    <Header/>
    <Outlet /> 
    <Footer/>
    </>
  )
}

export default Layout