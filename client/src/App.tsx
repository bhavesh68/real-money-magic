// src/App.tsx (simplified - no Layout)

import { Routes, Route, Navigate, Router } from "react-router-dom";
import Login from "./components/login";
import Signup from "./screens/Signup";
import Dashboard from "./screens/Dashboard";
import Hello from "./screens/Hello";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/NavBar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/hello" element={<Hello />} />

        {/* Protected pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <div>Transactions Page</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/day"
          element={
            <ProtectedRoute>
              <div>Day View</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/week"
          element={
            <ProtectedRoute>
              <div>Week View</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/month"
          element={
            <ProtectedRoute>
              <div>Month View</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div>Profile Page</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
