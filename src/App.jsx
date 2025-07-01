import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LeaveManagement from "@/components/pages/LeaveManagement";
import Departments from "@/components/pages/Departments";
import EmployeeDetail from "@/components/pages/EmployeeDetail";
import Dashboard from "@/components/pages/Dashboard";
import PerformanceReviews from "@/components/pages/PerformanceReviews";
import Employees from "@/components/pages/Employees";
import Reports from "@/components/pages/Reports";
import Layout from "@/components/organisms/Layout";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/:id" element={<EmployeeDetail />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/leave" element={<LeaveManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/performance-reviews" element={<PerformanceReviews />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </div>
  );
}

export default App;