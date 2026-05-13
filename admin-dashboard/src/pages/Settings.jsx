import { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings ⚙️</h1>
        <p className="text-gray-500 text-sm">
          Manage your account and application preferences
        </p>
      </div>

      <div className="flex gap-3">
        {["profile", "security", "notifications"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm rounded-lg transition ${
              activeTab === tab
                ? "bg-indigo-500 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
        {activeTab === "profile" && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-800">Profile Settings</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Full Name"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 ring-indigo-400"
              />

              <input
                placeholder="Email Address"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 ring-indigo-400"
              />

              <input
                placeholder="Phone Number"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 ring-indigo-400"
              />

              <input
                placeholder="Location"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 ring-indigo-400"
              />
            </div>

            <button className="bg-indigo-500 text-white px-5 py-2 rounded-lg hover:bg-indigo-600 transition shadow">
              Save Changes
            </button>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-800">Security Settings</h2>

            <input
              type="password"
              placeholder="Current Password"
              className="px-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 ring-indigo-400"
            />

            <input
              type="password"
              placeholder="New Password"
              className="px-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 ring-indigo-400"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="px-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 ring-indigo-400"
            />

            <button className="bg-indigo-500 text-white px-5 py-2 rounded-lg hover:bg-indigo-600 transition shadow">
              Update Password
            </button>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-800">
              Notification Preferences
            </h2>

            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-700">Email Notifications</span>
              <input type="checkbox" className="w-5 h-5 accent-indigo-500" />
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-700">SMS Notifications</span>
              <input type="checkbox" className="w-5 h-5 accent-indigo-500" />
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-700">Push Notifications</span>
              <input type="checkbox" className="w-5 h-5 accent-indigo-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
