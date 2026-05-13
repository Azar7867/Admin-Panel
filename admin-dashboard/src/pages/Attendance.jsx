import { useState } from "react";

const attendanceData = [
  {
    id: 1,
    name: "John Doe",
    checkIn: "09:10 AM",
    checkOut: "06:20 PM",
    status: "Present",
    hours: "08:45",
  },
  {
    id: 2,
    name: "Jane Smith",
    checkIn: "09:30 AM",
    checkOut: "--",
    status: "Active",
    hours: "04:10",
  },
  {
    id: 3,
    name: "Alex Ray",
    checkIn: "--",
    checkOut: "--",
    status: "Absent",
    hours: "00:00",
  },
];

export default function Attendance() {
  const [search, setSearch] = useState("");

  const filtered = attendanceData.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  const statusStyles = {
    Present: "bg-green-100 text-green-600",
    Active: "bg-blue-100 text-blue-600",
    Absent: "bg-red-100 text-red-600",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Attendance Dashboard 🧑‍💼
        </h1>
        <p className="text-gray-500 text-sm">
          Track employee attendance and working hours
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-5 rounded-2xl shadow-lg">
          <p className="text-sm opacity-80">Total Employees</p>
          <h2 className="text-2xl font-bold">120</h2>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-5 rounded-2xl shadow-lg">
          <p className="text-sm opacity-80">Present</p>
          <h2 className="text-2xl font-bold">98</h2>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-5 rounded-2xl shadow-lg">
          <p className="text-sm opacity-80">Active Now</p>
          <h2 className="text-2xl font-bold">45</h2>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-5 rounded-2xl shadow-lg">
          <p className="text-sm opacity-80">Absent</p>
          <h2 className="text-2xl font-bold">22</h2>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search employee..."
          className="px-4 py-2 border border-gray-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 ring-indigo-400"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[750px] w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide border-b border-gray-200">
              <tr>
                <th className="p-4">Employee</th>
                <th className="p-4">Check In</th>
                <th className="p-4">Check Out</th>
                <th className="p-4">Hours</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={`https://i.pravatar.cc/40?img=${user.id}`}
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="font-medium text-gray-800">
                      {user.name}
                    </span>
                  </td>

                  <td className="p-4 text-gray-700">{user.checkIn}</td>

                  <td className="p-4 text-red-500 font-medium">
                    {user.checkOut}
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">
                      {user.hours}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${statusStyles[user.status]}`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <button className="text-indigo-600 text-sm hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-400">No records found</div>
        )}
      </div>
    </div>
  );
}
