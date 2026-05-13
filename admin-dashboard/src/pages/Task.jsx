import { useState } from "react";

const tasksData = [
  {
    id: "#T1024",
    title: "Design Dashboard UI",
    assignee: "John",
    priority: "High",
    status: "In Progress",
  },
  {
    id: "#T1025",
    title: "Fix Login Bug",
    assignee: "Jane",
    priority: "Medium",
    status: "Todo",
  },
  {
    id: "#T1026",
    title: "API Integration",
    assignee: "Alex",
    priority: "High",
    status: "Done",
  },
  {
    id: "#T1027",
    title: "Update Documentation",
    assignee: "Sara",
    priority: "Low",
    status: "Todo",
  },
];

export default function Tasks() {
  const [search, setSearch] = useState("");

  const filtered = tasksData.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase()),
  );

  const statusStyles = {
    Todo: "bg-gray-100 text-gray-600",
    "In Progress": "bg-blue-100 text-blue-600",
    Done: "bg-green-100 text-green-600",
  };

  const priorityStyles = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-600",
    Low: "bg-emerald-100 text-emerald-600",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Task Management 📝</h1>
        <p className="text-gray-500 text-sm">
          Organize and track team tasks efficiently
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-5 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-80">Total Tasks</p>
              <h2 className="text-2xl font-bold mt-1">128</h2>
              <p className="text-xs opacity-70 mt-1">+12 this week</p>
            </div>
            <div className="text-3xl opacity-80">📋</div>
          </div>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-5 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-80">In Progress</p>
              <h2 className="text-2xl font-bold mt-1">42</h2>
              <p className="text-xs opacity-70 mt-1">8 active now</p>
            </div>
            <div className="text-3xl opacity-80">🚀</div>
          </div>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-5 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-80">Completed</p>
              <h2 className="text-2xl font-bold mt-1">86</h2>
              <p className="text-xs opacity-70 mt-1">+5 today</p>
            </div>
            <div className="text-3xl opacity-80">✅</div>
          </div>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search tasks..."
          className="px-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 ring-indigo-400"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide border-b border-gray-200">
              <tr>
                <th className="p-4">Task ID</th>
                <th className="p-4">Title</th>
                <th className="p-4">Assignee</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((task, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-700">{task.id}</td>

                  <td className="p-4 font-semibold text-gray-800">
                    {task.title}
                  </td>

                  <td className="p-4 text-indigo-600 font-medium">
                    {task.assignee}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${priorityStyles[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[task.status]}`}
                    >
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-400">No tasks found</div>
        )}
      </div>
    </div>
  );
}
