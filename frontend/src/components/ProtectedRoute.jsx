import { Navigate, Outlet } from "react-router-dom";

// ProtectedRoute component
const ProtectedRoute = ({ allowedRoles }) => {
  const userData = JSON.parse(localStorage.getItem("userData")); // Get role from localStorage
  const userRole = userData.role;
  //console.log(userData.role);
  
  

//   if (!userRole) {
//     return <Navigate to="/login" replace />; 
//   }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />; // Redirect if role mismatch
  }

  return <Outlet />; // Render the component if access is allowed
};

export default ProtectedRoute;
