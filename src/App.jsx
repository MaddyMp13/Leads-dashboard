import { Routes, Route, Navigate } from "react-router-dom";
import { isAdmin } from "../src/utils/auth";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import './App.css'

import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Users from "./pages/Users";
import Trash from "./pages/Trash";

function App() {
  return (

    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Dashboard Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/trash"
          element={
            isAdmin() ? <Trash /> : <Dashboard />
          }
        />
        <Route path="/users"
          element={isAdmin() ? <Users /> : <Dashboard />}
        />
      </Route>

      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/dashboard" />} />


    </Routes >
  );
}

export default App;




