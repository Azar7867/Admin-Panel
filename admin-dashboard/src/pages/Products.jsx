import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const performanceData = [
  { name: "Jan", productivity: 60, tasks: 40 },
  { name: "Feb", productivity: 75, tasks: 55 },
  { name: "Mar", productivity: 70, tasks: 50 },
  { name: "Apr", productivity: 85, tasks: 65 },
  { name: "May", productivity: 90, tasks: 70 },
  { name: "Jun", productivity: 95, tasks: 80 },
];

export default function Performance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Performance Dashboard 🚀
        </h1>
        <p className="text-gray-500 text-sm">
          Monitor productivity, efficiency, and team performance
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-5 rounded-2xl shadow-lg">
          <p className="text-sm opacity-80">Overall Performance</p>
          <h2 className="text-2xl font-bold">92%</h2>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-5 rounded-2xl shadow-lg">
          <p className="text-sm opacity-80">Tasks Completed</p>
          <h2 className="text-2xl font-bold">1,240</h2>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-5 rounded-2xl shadow-lg">
          <p className="text-sm opacity-80">Efficiency</p>
          <h2 className="text-2xl font-bold">87%</h2>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-5 rounded-2xl shadow-lg">
          <p className="text-sm opacity-80">Active Projects</p>
          <h2 className="text-2xl font-bold">18</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-800 font-semibold">
              Productivity Trend 📈
            </h2>
            <span className="text-green-600 text-xs bg-green-100 px-3 py-1 rounded-full">
              +8%
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={performanceData} barCategoryGap="30%">
            {/* Gradient */}
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.6} />
              </linearGradient>
            </defs>

            {/* Grid */}
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

            {/* Axis */}
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            />

            {/* Bars */}
            <Bar
              dataKey="tasks"
              fill="url(#barGradient)"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-gray-800 font-semibold mb-4">Insights 💡</h2>

          <ul className="space-y-3 text-sm text-gray-600">
            <li>✔ Productivity increased by 8% this month</li>
            <li>✔ Task completion rate is improving steadily</li>
            <li>✔ Team efficiency reached highest in June</li>
            <li>✔ Consider scaling resources for growth</li>
          </ul>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-gray-800 font-semibold mb-4">
            Top Performers 🏆
          </h2>

          <div className="space-y-3">
            {["John", "Sara", "Alex"].map((name, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://i.pravatar.cc/40?img=${i + 5}`}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {name}
                  </span>
                </div>

                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  High
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
