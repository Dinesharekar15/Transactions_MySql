import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

export const PublicRoute = ({ children }) => {
    if (isAuthenticated()) {
      // If user is logged in, redirect them to the dashboard
      return <Navigate to="/dashboard" />;
    }
    // If not logged in, render the children (SignIn or SignUp page)
    return children;
  };