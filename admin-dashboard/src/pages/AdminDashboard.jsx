import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api/api";

const sidebarPages = [
  "dashboard", "profile", "performance", "orders", "analytics", "settings",
  "login-hours", "calendar", "attendance", "details", "percentage", "blog",
  "subscribers", "admin", "user", "my-pdfs",
];

const avatarColors = [
  "bg-indigo-500", "bg-rose-500", "bg-sky-500",
  "bg-emerald-500", "bg-amber-500", "bg-violet-500",
];
const getColor = (name) =>
  avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

const ratingColor = (r) => {
  if (r >= 4) return "text-green-500 bg-green-50";
  if (r >= 3) return "text-amber-500 bg-amber-50";
  return "text-red-500 bg-red-50";
};

const pageIcons = {
  dashboard: "🏠", profile: "👤", performance: "📈", orders: "📦",
  analytics: "📊", settings: "⚙️", "login-hours": "🕐", calendar: "📅",
  attendance: "✅", details: "📋", percentage: "%", blog: "✍️",
  subscribers: "👥", admin: "🛡️", user: "👤", "my-pdfs": "📄",
};

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [form, setForm] = useState({
    name: "", department: "", salary: "", email: "", performanceRating: "",
  });

  const token = localStorage.getItem("token");

  const showPopup = (message, type) => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 2500);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const empRes = await axios.get(`${BASE_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(empRes.data.employees || empRes.data.data || empRes.data);
      const userRes = await axios.get(`${BASE_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedUsers = userRes.data.users || userRes.data.data || userRes.data;
      setUsers(fetchedUsers);
      // Auto-select first non-admin user
      const nonAdmins = fetchedUsers.filter((u) => u.role !== "admin");
      if (nonAdmins.length > 0 && !selectedUser) {
        setSelectedUser(nonAdmins[0]);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Keep selectedUser in sync after fetchData refreshes users
  useEffect(() => {
    if (selectedUser) {
      const updated = users.find((u) => u._id === selectedUser._id);
      if (updated) setSelectedUser(updated);
    }
  }, [users]);

  const handleAddEmployee = async () => {
    try {
      if (!form.name || !form.department || !form.salary || !form.email || !form.performanceRating) {
        showPopup("All fields are required", "error");
        return;
      }
      await axios.post(`${BASE_URL}/employees`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showPopup("Employee Added Successfully", "success");
      setShowModal(false);
      setForm({ name: "", department: "", salary: "", email: "", performanceRating: "" });
      fetchData();
    } catch (err) {
      console.log(err.response?.data || err.message);
      showPopup("Employee Add Failed", "error");
    }
  };

  const grantAccess = async (id) => {
    try {
      await axios.put(`${BASE_URL}/employees/grant/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showPopup("Access Granted Successfully", "success");
      fetchData();
    } catch (err) {
      showPopup("Grant Access Failed", "error");
    }
  };

  const removeAccess = async (id) => {
    try {
      await axios.put(`${BASE_URL}/employees/remove/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showPopup("Access Removed Successfully", "error");
      fetchData();
    } catch (err) {
      showPopup("Remove Access Failed", "error");
    }
  };

  const grantPageAccess = async (id, page) => {
    try {
      await axios.put(`${BASE_URL}/employees/grant-page/${id}`, { page }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showPopup(`${page} access granted`, "success");
      fetchData();
    } catch (err) {
      showPopup("Grant failed", "error");
    }
  };

  const removePageAccess = async (id, page) => {
    try {
      await axios.put(`${BASE_URL}/employees/remove-page/${id}`, { page }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showPopup(`${page} access removed`, "error");
      fetchData();
    } catch (err) {
      showPopup("Remove failed", "error");
    }
  };

  const filteredUsers = [
    ...new Map(
      users.filter((u) => u.role !== "admin").map((u) => [u._id, u])
    ).values(),
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans px-4 sm:px-6 lg:px-10 py-6 sm:py-8 text-gray-900">
      {popup.show && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3.5 rounded-2xl text-white text-sm font-semibold shadow-xl transition-all ${
          popup.type === "success" ? "bg-gray-900" : "bg-red-500"
        }`}>
          {popup.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mb-9">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 m-0">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Manage employees & user access</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-gray-900 hover:bg-gray-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-200"
        >
          + Add Employee
        </button>
      </div>

      {/* Employees Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Employees</p>
        {loading ? (
          <p className="text-gray-300 text-sm text-center py-8">Loading...</p>
        ) : employees.length === 0 ? (
          <p className="text-gray-300 text-sm text-center py-8">No employees found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {employees.map((emp) => (
              <div key={emp._id} className="border border-gray-100 rounded-2xl p-5 bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className={`w-11 h-11 rounded-full ${getColor(emp.name)} text-white flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                    {emp.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[15px] m-0">{emp.name}</p>
                    <p className="text-gray-400 text-[13px] m-0">{emp.department}</p>
                  </div>
                </div>
                <div className="flex justify-between text-[13px] mb-1.5">
                  <span className="text-gray-400 font-medium">Salary</span>
                  <span className="font-semibold text-gray-800">₹{emp.salary}</span>
                </div>
                <div className="flex justify-between text-[13px] mb-1.5">
                  <span className="text-gray-400 font-medium">Email</span>
                  <span className="font-semibold text-gray-800 text-xs">{emp.email}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-400 font-medium">Rating</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${ratingColor(emp.performanceRating)}`}>
                    ★ {emp.performanceRating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Access Control Center ─── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
        {/* Section header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 m-0">Access Control Center</h2>
              <p className="text-sm text-gray-400 m-0">Manage dynamically which users can access specific panels and features.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row min-h-[500px]">
          {/* Left — User list */}
          <div className="lg:w-64 xl:w-72 border-b lg:border-b-0 lg:border-r border-gray-100 p-4 flex-shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">
              Select User to Manage
            </p>
            <div className="flex flex-col gap-1">
              {filteredUsers.map((user) => {
                const isSelected = selectedUser?._id === user._id;
                return (
                  <button
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150 border cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-200"
                        : "bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-100"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full ${getColor(user.name)} text-white flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                      {user.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold m-0 truncate ${isSelected ? "text-indigo-700" : "text-gray-800"}`}>
                        {user.name}
                      </p>
                      <p className="text-[11px] text-gray-400 m-0 truncate">{user.email}</p>
                    </div>
                    {isSelected && (
                      <svg className="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
              {filteredUsers.length === 0 && (
                <p className="text-gray-300 text-sm text-center py-6">No users found</p>
              )}
            </div>
          </div>

          {/* Right — Permissions panel */}
          <div className="flex-1 p-5 sm:p-6">
            {selectedUser ? (
              <>
                {/* Permission panel header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 m-0">
                      Permissions for {selectedUser.name}
                    </h3>
                    <p className="text-sm text-gray-400 m-0 mt-0.5">
                      Toggle visibility and access for each dashboard panel.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                      Managing Access
                    </span>
                  </div>
                </div>

                {/* Full access buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
                  <button
                    onClick={() => grantAccess(selectedUser._id)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[13px] transition-colors duration-200 border border-emerald-100 cursor-pointer"
                  >
                    ✓ Grant Full Access
                  </button>
                  <button
                    onClick={() => removeAccess(selectedUser._id)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-[13px] transition-colors duration-200 border border-red-100 cursor-pointer"
                  >
                    ✕ Remove Full Access
                  </button>
                </div>

                {/* Permission toggles grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sidebarPages.map((page) => {
                    const hasPermission = selectedUser.permissions?.includes(page);
                    return (
                      <div
                        key={page}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-150 ${
                          hasPermission
                            ? "bg-emerald-50 border-emerald-100"
                            : "bg-gray-50 border-gray-100"
                        }`}
                      >
                        {/* Icon avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 ${
                          hasPermission
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}>
                          {page.charAt(0).toUpperCase()}
                        </div>

                        {/* Label */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 capitalize m-0 leading-tight">
                            {page.replace(/-/g, " ")}
                          </p>
                          <p className={`text-[10px] uppercase tracking-widest font-bold mt-0.5 m-0 ${
                            hasPermission ? "text-emerald-600" : "text-gray-400"
                          }`}>
                            {hasPermission ? "Access Active" : "No Access"}
                          </p>
                        </div>

                        {/* Toggle */}
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={!!hasPermission}
                            onChange={() =>
                              hasPermission
                                ? removePageAccess(selectedUser._id, page)
                                : grantPageAccess(selectedUser._id, page)
                            }
                          />
                          <div className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${
                            hasPermission ? "bg-emerald-500" : "bg-gray-300"
                          }`}>
                            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 flex items-center justify-center ${
                              hasPermission ? "left-[26px]" : "left-0.5"
                            }`}>
                              {hasPermission && (
                                <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm font-medium">Select a user to manage permissions</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-5 sm:p-7 lg:p-9 w-[95%] sm:w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-3 mb-7">
              <h2 className="text-2xl font-bold m-0">Add Employee</h2>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-100 hover:bg-gray-200 border-none w-8 h-8 rounded-full text-lg cursor-pointer text-gray-500 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>
            {["name", "department", "email"].map((field) => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full border-[1.5px] border-gray-200 focus:border-gray-900 outline-none rounded-xl px-4 py-3 text-sm mb-3.5 font-[inherit] text-gray-900 transition-colors box-border"
              />
            ))}
            <input
              type="number"
              placeholder="Salary"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
              className="w-full border-[1.5px] border-gray-200 focus:border-gray-900 outline-none rounded-xl px-4 py-3 text-sm mb-3.5 font-[inherit] text-gray-900 transition-colors box-border"
            />
            <input
              type="number"
              placeholder="Performance Rating (1–5)"
              value={form.performanceRating}
              onChange={(e) => setForm({ ...form, performanceRating: e.target.value })}
              className="w-full border-[1.5px] border-gray-200 focus:border-gray-900 outline-none rounded-xl px-4 py-3 text-sm mb-3.5 font-[inherit] text-gray-900 transition-colors box-border"
            />
            <button
              onClick={handleAddEmployee}
              className="w-full bg-gray-900 hover:bg-gray-700 text-white border-none py-3.5 rounded-xl font-bold text-[15px] cursor-pointer mt-1 font-[inherit] tracking-wide transition-colors"
            >
              Add Employee
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;