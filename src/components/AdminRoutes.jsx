import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';

export default function AdminRoutes() {
  const { currentUser } = useSelector((state) => state.user);
  
  // Debugging - log current user state
  useEffect(() => {
    console.log('Current user in AdminRoutes:', currentUser);
  }, [currentUser]);

  // Loading state while checking auth
  if (currentUser === undefined) {
    return <div>Loading admin authentication...</div>;
  }

  // Redirect if not admin
  if (!currentUser?.isAdmin) {
    console.log('Redirecting to admin login - user not admin');
    return <Navigate to="/admin/login" replace />;
  }

  // Render admin routes
  return <Outlet />;
}