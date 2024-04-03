import React, { useContext } from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

// const ProtectedRoute = ({ element: Element, allowedRoles }) => {
const ProtectedRoute = ({ children, allowedRoles }) => {
  const authCtx = useContext(AuthContext)
  const location = useLocation()
  console.log(location)

  const isAuthenticated = !!authCtx.token
  const currentUserRole = authCtx.userInfo?.userType

  // Check if the user is authenticated and has the allowed role
  const isAuthorized = isAuthenticated && allowedRoles.includes(currentUserRole)

  return isAuthorized ?  <Outlet/> : <Navigate to='/login' replace={true} />
}

export default ProtectedRoute
