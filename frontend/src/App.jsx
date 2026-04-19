import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "./components/common/Toast";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import NewTrip from "./pages/NewTrip";
import Destination from "./pages/Destination";
import SignIn from "./pages/SignIn";
import AuthCallback from "./pages/AuthCallback";
import Profile from "./pages/Profile";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTrips from "./pages/admin/AdminTrips";
import AdminBookings from "./pages/admin/AdminBookings";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-trip" element={<NewTrip />} />
          <Route path="/destination/:name" element={<Destination />} />

          {/* Protected */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/trips" element={<AdminTrips />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;