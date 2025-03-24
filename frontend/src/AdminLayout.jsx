import React from 'react'

import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import AdminHeader from './components/Admin/AdminHeader'

function AdminLayout() {
  return (
    <>
    {/* <AdminHeader/> */}
    <Outlet /> 
    <Footer/>
    </>
  )
}

export default AdminLayout