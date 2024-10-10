import { Navigate } from "react-router-dom";

export const ProtectedRoute=({children})=>{
    const token = localStorage.getItem("token");

    // If the token doesn't exist, redirect to the SignIn page
   
    if (!token) {
      return <Navigate to="/signin" />;
    }
  
    // If the token exists, render the children (protected component)
    return children;
  
}