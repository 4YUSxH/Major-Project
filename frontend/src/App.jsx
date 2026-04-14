import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import { useThemeStore } from "./store/themeStore";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterStaff from "./pages/RegisterStaff";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import TicketList from "./pages/TicketList";
import TicketDetail from "./pages/TicketDetail";
import CreateTicket from "./pages/CreateTicket";
import KnowledgeBase from "./pages/KnowledgeBase";
import Announcements from "./pages/Announcements";
import Landing from "./pages/Landing";
import ProfileSetup from "./pages/ProfileSetup";
import Profile from "./pages/Profile";

function App() {
  const { fetchMe, user, isLoading } = useAuthStore();
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    fetchMe();
    initializeTheme();
  }, [fetchMe, initializeTheme]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900"><p className="text-slate-500 dark:text-slate-400 animate-pulse">Loading Application...</p></div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/register-staff" element={!user ? <RegisterStaff /> : <Navigate to="/dashboard" />} />
        <Route path="/profile-setup" element={user && !user.hasSetupProfile ? <ProfileSetup /> : <Navigate to={user ? "/dashboard" : "/login"} />} />
        
        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            user ? (
              user.hasSetupProfile ? (
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<Navigate replace to="/dashboard" />} />
                    <Route path="/tickets" element={<TicketList />} />
                    <Route path="/tickets/new" element={<CreateTicket />} />
                    <Route path="/tickets/:id" element={<TicketDetail />} />
                    <Route path="/kb" element={<KnowledgeBase />} />
                    <Route path="/announcements" element={<Announcements />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/profile-setup" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
