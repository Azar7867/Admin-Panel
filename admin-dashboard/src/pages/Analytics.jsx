import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Jan", users: 30 },
  { name: "Feb", users: 50 },
  { name: "Mar", users: 40 },
  { name: "Apr", users: 70 },
  { name: "May", users: 60 },
  { name: "Jun", users: 90 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Analytics Overview 📊
        </h1>
        <p className="text-gray-500 text-sm">
          Track your platform growth and performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-5 rounded-2xl shadow-lg overflow-hidden">
          <p className="text-sm opacity-80">Total Users</p>
          <h2 className="text-2xl font-bold mt-1">2,340</h2>
          <p className="text-xs opacity-70 mt-1">+12.5% growth</p>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-5 rounded-2xl shadow-lg overflow-hidden">
          <p className="text-sm opacity-80">Active Users</p>
          <h2 className="text-2xl font-bold mt-1">1,120</h2>
          <p className="text-xs opacity-70 mt-1">+8% this week</p>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-5 rounded-2xl shadow-lg overflow-hidden">
          <p className="text-sm opacity-80">Revenue</p>
          <h2 className="text-2xl font-bold mt-1">$24,000</h2>
          <p className="text-xs opacity-70 mt-1">+5% today</p>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-sm rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">User Growth</p>
            <h2 className="text-xl font-bold text-gray-800">
              Monthly Performance
            </h2>
          </div>

          <span className="text-green-600 text-xs font-medium bg-green-100 px-3 py-1 rounded-full">
            +12.5%
          </span>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                }}
              />

              <Line
                type="monotone"
                dataKey="users"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
