import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './Layout';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './pages/Home';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<Home />} />
      <Route path='signup' element={<SignUp />} />
      <Route path='login' element={<Login />} />
  
      
    </Route>
  )
)

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <RouterProvider router = {router} />
    </>
  )
}    

export default App
