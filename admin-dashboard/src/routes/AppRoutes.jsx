import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/MyProfile";
import Products from "../pages/Products";
import Orders from "../pages/Task";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import LoginHours from "../pages/LoginHours";
import RNDCalendar from "../pages/RNDCalendar";
import Attendance from "../pages/Attendance";
import DetailsPage from "../pages/DetailsPage";
import PercentagePage from "../pages/PercentagePage";
import BlogPage from "../pages/BlogPage";
import SubscriberPage from "../pages/SubscriberPage";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import PremiumInvoicePreview from "../pages/Invoice";
import InvoiceList from "../pages/InvoiceList";
import VisualData from "../pages/VisualData";
import UserPdfPage from "../pages/UserPdfPage";
import UploadPdfPage from "../pages/UploadPdfPage";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Users />} />
        <Route path="performance" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="login-hours" element={<LoginHours />} />
        <Route path="calendar" element={<RNDCalendar />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="details" element={<DetailsPage />} />
        <Route path="percentage" element={<PercentagePage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="subscribers" element={<SubscriberPage />} />
        <Route path="invoice" element={<PremiumInvoicePreview />} />
        <Route path="invoiceList" element={<InvoiceList />} />
        <Route path="visual" element={<VisualData />} />
        <Route
  path="my-pdfs"
  element={<UserPdfPage />}
/>
<Route
  path="upload-pdf"
  element={<UploadPdfPage />}
/>
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />

      <Route
        path="/"
        element={
          localStorage.getItem("token") ? (
            <Navigate to="/" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
