import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api/api";

const sidebarPages = [
  "dashboard",
  "profile",
  "performance",
  "orders",
  "analytics",
  "settings",
  "login-hours",
  "calendar",
  "attendance",
  "details",
  "percentage",
  "blog",
  "subscribers",
  "admin",
  "user",
];

const avatarColors = [
  "bg-indigo-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
];
const getColor = (name) =>
  avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

const ratingColor = (r) => {
  if (r >= 4) return "text-green-500 bg-green-50";
  if (r >= 3) return "text-amber-500 bg-amber-50";
  return "text-red-500 bg-red-50";
};

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [form, setForm] = useState({
    name: "",
    department: "",
    salary: "",
    email: "",
    performanceRating: "",
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(empRes.data.employees || empRes.data.data || empRes.data);
      const userRes = await axios.get(`${BASE_URL}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(userRes.data.users || userRes.data.data || userRes.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddEmployee = async () => {
    try {
      if (
        !form.name ||
        !form.department ||
        !form.salary ||
        !form.email ||
        !form.performanceRating
      ) {
        showPopup("All fields are required", "error");
        return;
      }
      await axios.post(`${BASE_URL}/employees`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showPopup("Employee Added Successfully", "success");
      setShowModal(false);
      setForm({
        name: "",
        department: "",
        salary: "",
        email: "",
        performanceRating: "",
      });
      fetchData();
    } catch (err) {
      console.log(err.response?.data || err.message);
      showPopup("Employee Add Failed", "error");
    }
  };

  const grantAccess = async (id) => {
    try {
      await axios.put(
        `${BASE_URL}/employees/grant/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      showPopup("Access Granted Successfully", "success");
      fetchData();
    } catch (err) {
      console.log(err);
      showPopup("Grant Access Failed", "error");
    }
  };

  const removeAccess = async (id) => {
    try {
      await axios.put(
        `${BASE_URL}/employees/remove/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      showPopup("Access Removed Successfully", "error");
      fetchData();
    } catch (err) {
      console.log(err);
      showPopup("Remove Access Failed", "error");
    }
  };

  const grantPageAccess = async (id, page) => {
    try {
      await axios.put(
        `${BASE_URL}/employees/grant-page/${id}`,
        { page },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      showPopup(`${page} access granted`, "success");
      fetchData();
    } catch (err) {
      console.log(err);
      showPopup("Grant failed", "error");
    }
  };

  const removePageAccess = async (id, page) => {
    try {
      await axios.put(
        `${BASE_URL}/employees/remove-page/${id}`,
        { page },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      showPopup(`${page} access removed`, "error");
      fetchData();
    } catch (err) {
      console.log(err);
      showPopup("Remove failed", "error");
    }
  };

  const filteredUsers = [
    ...new Map(
      users.filter((u) => u.role !== "admin").map((u) => [u._id, u]),
    ).values(),
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans px-4 sm:px-6 lg:px-10 py-6 sm:py-8 text-gray-900">
      {popup.show && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3.5 rounded-2xl text-white text-sm font-semibold shadow-xl animate-fade-in transition-all ${
            popup.type === "success" ? "bg-gray-900" : "bg-red-500"
          }`}
        >
          {popup.message}
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mb-9">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 m-0">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage employees & user access
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-gray-900 hover:bg-gray-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-200"
        >
          + Add Employee
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
          Employees
        </p>

        {loading ? (
          <p className="text-gray-300 text-sm text-center py-8">Loading...</p>
        ) : employees.length === 0 ? (
          <p className="text-gray-300 text-sm text-center py-8">
            No employees found
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {employees.map((emp) => (
              <div
                key={emp._id}
                className="border border-gray-100 rounded-2xl p-5 bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-3.5 mb-4">
                  <div
                    className={`w-11 h-11 rounded-full ${getColor(emp.name)} text-white flex items-center justify-center font-bold text-lg flex-shrink-0`}
                  >
                    {emp.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[15px] m-0">{emp.name}</p>
                    <p className="text-gray-400 text-[13px] m-0">
                      {emp.department}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between text-[13px] mb-1.5">
                  <span className="text-gray-400 font-medium">Salary</span>
                  <span className="font-semibold text-gray-800">
                    ₹{emp.salary}
                  </span>
                </div>
                <div className="flex justify-between text-[13px] mb-1.5">
                  <span className="text-gray-400 font-medium">Email</span>
                  <span className="font-semibold text-gray-800 text-xs">
                    {emp.email}
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-400 font-medium">Rating</span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${ratingColor(emp.performanceRating)}`}
                  >
                    ★ {emp.performanceRating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
          User Access Management
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="border border-gray-100 rounded-2xl p-5 bg-gray-50 flex flex-col gap-0"
            >
              <div className="flex items-center gap-3.5 mb-5">
                <div
                  className={`w-11 h-11 rounded-full ${getColor(user.name)} text-white flex items-center justify-center font-bold text-lg flex-shrink-0`}
                >
                  {user.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[15px] m-0">{user.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5 m-0">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
                <button
                  onClick={() => grantAccess(user._id)}
                  className="flex-1 py-2 px-4 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-[13px] transition-colors duration-200 border-none cursor-pointer"
                >
                  Grant Full Access
                </button>
                <button
                  onClick={() => removeAccess(user._id)}
                  className="flex-1 py-2 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-[13px] transition-colors duration-200 border-none cursor-pointer"
                >
                  Remove Full Access
                </button>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                  Sidebar Permissions
                </p>
                <div className="flex flex-wrap gap-2">
                  {sidebarPages.map((page) => {
                    const hasPermission = user.permissions?.includes(page);
                    return (
                      <div
                        key={page}
                        className={`flex flex-wrap items-center justify-between gap-2 px-2.5 py-2 rounded-xl border text-xs font-semibold capitalize w-full sm:w-auto ${
                          hasPermission
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : "bg-red-50 border-red-200 text-red-800"
                        }`}
                      >
                        <span>{page}</span>
                        {hasPermission ? (
                          <button
                            onClick={() => removePageAccess(user._id, page)}
                            className="bg-red-600 hover:bg-red-700 text-white border-none rounded-md px-2 py-0.5 text-[11px] font-bold cursor-pointer transition-colors"
                          >
                            Deny
                          </button>
                        ) : (
                          <button
                            onClick={() => grantPageAccess(user._id, page)}
                            className="bg-green-700 hover:bg-green-800 text-white border-none rounded-md px-2 py-0.5 text-[11px] font-bold cursor-pointer transition-colors"
                          >
                            Allow
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
              onChange={(e) =>
                setForm({ ...form, performanceRating: e.target.value })
              }
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
