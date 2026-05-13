import { useState } from "react";

const user = {
  id: 1,
  name: "Mohamed Azardeen",
  role: "Admin",
  status: "Active",
  email: "azardeen@email.com",
  phone: "+91 98765 43210",
  location: "Madurai, India",
};

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const statusStyles = {
    Active: "bg-green-100 text-green-600",
    Inactive: "bg-red-100 text-red-500",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Profile 👤</h1>
        <p className="text-gray-500 text-sm">
          Manage your personal information and settings
        </p>
      </div>
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <img
            src={`https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png`}
            alt=""
            className="w-28 h-28 rounded-full border-4 border-indigo-100 shadow"
          />
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>

            <p className="text-gray-500 text-sm">{user.email}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
              <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-600">
                {user.role}
              </span>

              <span
                className={`px-3 py-1 text-xs rounded-full ${statusStyles[user.status]}`}
              >
                {user.status}
              </span>
            </div>

            <div className="text-sm text-gray-500 mt-2">📍 {user.location}</div>
          </div>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-600 transition">
            Edit Profile
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-5 rounded-2xl shadow-lg">
          <p className="text-sm opacity-80">Projects</p>
          <h2 className="text-2xl font-bold">24</h2>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-5 rounded-2xl shadow-lg">
          <p className="text-sm opacity-80">Tasks Completed</p>
          <h2 className="text-2xl font-bold">142</h2>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-5 rounded-2xl shadow-lg">
          <p className="text-sm opacity-80">Performance</p>
          <h2 className="text-2xl font-bold">92%</h2>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-sm p-5">
        <div className="flex gap-4 mb-4">
          {["overview", "activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm rounded-lg transition ${
                activeTab === tab
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {activeTab === "overview" && (
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Location:</strong> {user.location}
            </p>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-3 text-sm text-gray-600">
            <p>✔ Completed dashboard UI design</p>
            <p>✔ Updated API endpoints</p>
            <p>✔ Reviewed project tasks</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
