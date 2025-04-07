// src/App.tsx (simplified - no Layout)
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

import { Routes, Route, Navigate, Router } from "react-router-dom";
import Login from "./components/login";
import Signup from "./screens/Signup";
import Dashboard from "./screens/Dashboard";
import Hello from "./screens/Hello";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/NavBar";
import LayoutWithNavbar from './components/LayoutWithNavbar';

function App() {
  return (
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />

      {/* Public pages */}
      <Route 
        path="/login" 
          element={
            <PublicRoute>
              <LayoutWithNavbar>
                <Login />
              </LayoutWithNavbar>
            </PublicRoute>
          } 
      />
      <Route 
        path="/signup" 
          element={
            <PublicRoute> 
              <LayoutWithNavbar>
                <Signup />
              </LayoutWithNavbar>
            </PublicRoute>
          } 
      />
      <Route 
        path="/hello"
          element={
            <PublicRoute> 
              <LayoutWithNavbar>
                <Hello />
              </LayoutWithNavbar>
            </PublicRoute>  
          } 
      />

      {/* Protected pages */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <LayoutWithNavbar>
              <Dashboard />
            </LayoutWithNavbar>
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <PrivateRoute>
            <LayoutWithNavbar>
              <div>Transactions Page</div>
            </LayoutWithNavbar>
          </PrivateRoute>
        }
      />
      <Route
        path="/day"
        element={
          <PrivateRoute>
            <LayoutWithNavbar>
              <div>Day View</div>
            </LayoutWithNavbar>
          </PrivateRoute>
        }
      />
      <Route
        path="/week"
        element={
          <PrivateRoute>
            <LayoutWithNavbar>
              <div>Week View</div>
            </LayoutWithNavbar>
          </PrivateRoute>
        }
      />
      <Route
        path="/month"
        element={
          <PrivateRoute>
            <LayoutWithNavbar>
              <div>Month View</div>
            </LayoutWithNavbar>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <LayoutWithNavbar>
              <div>Profile Page</div>
            </LayoutWithNavbar>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
