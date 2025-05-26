import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from './components/navbar';

import Home from './auth/Home';
import VerifyEmailPage from './auth/VerifyEmailPage';
import ForgotPasswordPage from './auth/ForgotPasswordPage';
import ResetPasswordPage from './auth/ResetPasswordPage';
import LoginPage from './auth/LoginPage';
import SignupPage from './auth/SignupPage';
import IndexPage from "./pages/index";
import PublicProfilePage from './pages/PublicProfilePage';
import PageNotFound from './pages/PageNotFound';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import PublicOnlyRoute from './components/Layout/PublicOnlyRoute';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // List all static, non-profile routes here (add more if needed)
  const NON_PROFILE_ROUTES = [
    "/", "/dashboard", "/login", "/signup", "/forgot-password", "/reset-password", "/verify-email"
  ];

  // Helper to check if current path is a public profile route
  function isPublicProfilePath(pathname) {
    // Remove trailing slash
    const clean = pathname.replace(/\/+$/, "");
    // Check for single-segment and not in known routes
    return (
      clean.split("/").length === 2 && // e.g. "/akshithbilla"
      !NON_PROFILE_ROUTES.some(route => clean === route || clean.startsWith(route + "/"))
    );
  }
  const hideNavbar = isPublicProfilePath(location.pathname);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://lake.onrender.com";

    if (!token) {
      console.warn("No token found in localStorage.");
      setUser && setUser(null);
      return false;
    }

    try {
      console.log("Checking auth with token:", token);

      const response = await axios.get(`${BACKEND_URL}/check-auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data?.authenticated) {
        console.log("User authenticated:", response.data.user);
        setUser && setUser(response.data.user);
        return true;
      } else {
        console.warn("Auth check failed: Not authenticated.");
        localStorage.removeItem("token");
        setUser && setUser(null);
        return false;
      }
    } catch (err) {
      console.error("Auth check error:", err?.response?.data || err.message);
      localStorage.removeItem("token");
      setUser && setUser(null);
      return false;
    }
  };

  useEffect(() => {
    const init = async () => {
      const isAuth = await checkAuth();
      if (isAuth && location.pathname === '/') {
        navigate('/dashboard');
      }
      setLoading(false);
    };
    init();
    // eslint-disable-next-line
  }, [navigate, location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!hideNavbar && <Navbar user={user} setUser={setUser} />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home user={user} />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage refreshUser={checkAuth} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage refreshUser={checkAuth} />} />

        <Route path="/login" element={
          <PublicOnlyRoute user={user}>
            <LoginPage setUser={setUser} />
          </PublicOnlyRoute>
        } />
        <Route path="/signup" element={
          <PublicOnlyRoute user={user}>
            <SignupPage />
          </PublicOnlyRoute>
        } />

        {/* Protected route */}
        <Route path="/dashboard" element={
          <ProtectedRoute user={user}>
            <IndexPage user={user} />
          </ProtectedRoute>
        } />

        {/* Public profile */}
        <Route path="/:username" element={<PublicProfilePage />} />

        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;