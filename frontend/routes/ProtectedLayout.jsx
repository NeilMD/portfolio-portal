import { Outlet, Navigate } from "react-router";
import { useAuth } from "@/context/AuthProvider";

const ProtectedLayout = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or a fancy spinner
  }
  console.log("Current Token: ", token); // Check if token is properly fetched
  if (!token) {
    return <Navigate to="/login" replace />; // If no token, redirect to login page
  }

  return <Outlet />; // If there is a token, render the nested routes
};

export default ProtectedLayout;
