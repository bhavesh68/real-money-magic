// src/App.tsx (simplified - no Layout)

import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Signup from './screens/Signup';
import Dashboard from './screens/Dashboard';
import Hello from './screens/Hello';

function App() {
  return (
    <Routes>
      {/* Default route redirects to login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/hello" element={<Hello />} />

      {/* Main app pages (now standalone) */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions" element={<div>Transactions Page</div>} />
      <Route path="/day" element={<div>Day View</div>} />
      <Route path="/week" element={<div>Week View</div>} />
      <Route path="/month" element={<div>Month View</div>} />
      <Route path="/profile" element={<div>Profile Page</div>} />
    </Routes>
  );
}

export default App;

