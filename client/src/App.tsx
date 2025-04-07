// src/App.tsx (simplified - no Layout)
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

<<<<<<< HEAD
import { Routes, Route, Navigate, Router } from "react-router-dom";
import Login from "./components/login";
import Signup from "./screens/Signup";
import Dashboard from "./screens/Dashboard";
import Hello from "./screens/Hello";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/NavBar";
=======
import { Routes, Route, Navigate } from 'react-router-dom';
import LayoutWithNavbar from './components/LayoutWithNavbar';
import Login from './components/login';
import Signup from './screens/Signup';
import Dashboard from './screens/Dashboard';
import Hello from './screens/Hello';
>>>>>>> dev-alex

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />

<<<<<<< HEAD
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
=======
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
>>>>>>> dev-alex
  );
}

export default App;
