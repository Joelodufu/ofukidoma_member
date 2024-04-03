import { Routes, Route } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import jwtDecode from "jwt-decode";
import Layout from "./Layout";
import LoginPage from "./Components/Users/Login";
import SignUp from "./Components/Users/Registration";
import Dashboard from "./Components/Dashboard/Dashboard";
import Members from "./Components/Members/Members";
import Donations from "./Components/Donations/Donations";
import ProfilePage from "./Components/Profile/Profile";
import MemberView from "./Components/Members/MemberView";
import Verify from "./Components/Users/Verify";
import ResetPassword from "./Components/Users/ResetPassword";
import ForgotPassword from "./Components/Users/ForgotPassword";
import CreateMember from "./Components/Members/CreateMembers";
import AccountSettingsPage from "./Components/Profile/edit-profile";
import AdminLoginPage from "./Components/Admin/Login";
import UserList from "./Components/Admin/Users";
import AdminDashboard from "./Components/Admin/Dashboard";
import Review from "./Components/Admin/Review";
import AdminMembers from "./Components/Admin/Members";
import AdminDonations from "./Components/Admin/Donations";
import Projects from "./Components/Projects/Projects";
import ProjectsView from "./Components/Projects/ProjectsView";
import AdminProjects from "./Components/Admin/Projects";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import { Suspense, lazy } from "react";
import Loading from "./Components/Modal/Loading";
import ErrorFallBack from "./Components/ErrorBoundary";
// import ErrorBoundary from './Components/ErrorBoundary'
import "react-loading-skeleton/dist/skeleton.css";
import EditMember from "./Components/Members/EditMember";
import { ErrorBoundary } from "react-error-boundary";
import FallBack from "./Components/FallBack";
import SponsorProfile from "./Components/Profile/SponsorProfile";
import AdminProfile from "./Components/Admin/Profile";
import ViewFront from "./Components/Members/ViewFront";
import Terms from "./Components/Terms";
import NgoLogin from "./Components/Users/NgoLogin";
const ROLES = {
  ADMIN: "Admin",
  INDIVIDUAL: "Individual",
  SPONSOR: "Sponsor",
};

export default function App() {
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    const token = authCtx.token; // Retrieve the JWT token from your storage mechanism

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTime) {
        console.log("JWT has expired. Logging out the User...");
        authCtx.logout();
        // JWT has expired
        // Perform logout logic here
        // Call your logout function or perform any necessary logout actions
      } else {
        // JWT is still valid
        console.log("JWT is still valid");
      }
    } else {
      // JWT token not found, user is not authenticated
      console.log("JWT token not found. User is not authenticated.");
    }
  }, [authCtx]);

  const errorHandler = (error, errorInfo) => {
    console.log(error, errorInfo);
  };
  return (
    // <ErrorBoundary FallbackComponent={FallBack} onError={errorHandler}>
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/viewf" element={<ViewFront />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/sponsor" element={<SponsorProfile />} />
        <Route path="/terms-conditions" element={<Terms />} />


        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.INDIVIDUAL, ROLES.SPONSOR]} />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.INDIVIDUAL, ROLES.SPONSOR]} />
          }
        >
          <Route path="/members" element={<Members />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.INDIVIDUAL, ROLES.SPONSOR]} />
          }
        >
          <Route path="/committees" element={<Donations />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.INDIVIDUAL]} />}>
          <Route path="/profile" element={<AccountSettingsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin-profile" element={<AdminProfile />} />
        </Route>

        <Route path="/view" element={<MemberView />} />

        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.INDIVIDUAL, ROLES.SPONSOR]} />
          }
        >
          <Route path="/create" element={<CreateMember />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.INDIVIDUAL, ROLES.SPONSOR]} />
          }
        >
          <Route path="/edit" element={<EditMember />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/users" element={<UserList />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/server" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/server-camp" element={<AdminMembers />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/review" element={<Review />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin-don" element={<AdminDonations />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.INDIVIDUAL, ROLES.SPONSOR]} />
          }
        >
          <Route path="/projects" element={<Projects />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.INDIVIDUAL, ROLES.SPONSOR]} />
          }
        >
          <Route path="/cview" element={<ProjectsView />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/server-projects" element={<AdminProjects />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.SPONSOR]} />}>
          <Route path="/sponsor-profile" element={<SponsorProfile />} />
        </Route>
      </Routes>
    </>
  );
}
