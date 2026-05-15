import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";
const COLORS = [
  "#6366f1",
  "#06b6d4",
  "#f59e0b",
  "#ec4899",
  "#10b981",
  "#8b5cf6",
];
const tooltipStyle = {
  contentStyle: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    color: "#1e293b",
    fontSize: "13px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  labelStyle: { color: "#64748b", fontWeight: 600 },
};
const axisStyle = { tick: { fill: "#94a3b8", fontSize: 12 } };
function ChartHeader({ title, badge, color, icon }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
      </div>
      <span
        className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
        style={{ background: `${color}18`, color }}
      >
        {badge}
      </span>
    </div>
  );
}
const STATS = (data) => [
  {
    label: "Total Sales",
    value: data.reduce((s, d) => s + (d.sales || 0), 0).toLocaleString(),
    color: "#6366f1",
    bg: "bg-indigo-50",
    icon: "📈",
  },
  {
    label: "Total Revenue",
    value: `$${data.reduce((s, d) => s + (d.revenue || 0), 0).toLocaleString()}`,
    color: "#06b6d4",
    bg: "bg-cyan-50",
    icon: "💰",
  },
  {
    label: "Total Users",
    value: data.reduce((s, d) => s + (d.users || 0), 0).toLocaleString(),
    color: "#10b981",
    bg: "bg-emerald-50",
    icon: "👥",
  },
  {
    label: "Data Points",
    value: data.length,
    color: "#f59e0b",
    bg: "bg-amber-50",
    icon: "📊",
  },
];
export default function VisualData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/graph`)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-slate-400 text-sm font-medium tracking-wide">
          Loading dashboard...
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/50 px-4 md:px-8 py-12 relative overflow-hidden">
      
      <div className="fixed top-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />
      <div className="fixed top-1/2 right-1/4 w-72 h-72 bg-pink-100/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="text-center mb-12 relative z-10">
        <span className="inline-block bg-indigo-100 text-indigo-600 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
          Analytics Overview
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Visual Data{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-cyan-500 to-pink-500 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>
        <p className="text-slate-400 mt-3 text-sm">
          Real-time insights across all key metrics
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-4">
          <div className="w-8 h-1 rounded-full bg-indigo-500" />
          <div className="w-3 h-1 rounded-full bg-cyan-400" />
          <div className="w-1.5 h-1 rounded-full bg-pink-400" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8 relative z-10">
        {STATS(data).map(({ label, value, color, bg, icon }) => (
          <div
            key={label}
            className={`${bg} rounded-2xl p-4 border border-white shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{icon}</span>
              <p className="text-xs text-slate-500 font-medium">{label}</p>
            </div>
            <p className="text-xl font-bold" style={{ color }}>
              {value}
            </p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto relative z-10">
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <ChartHeader
            title="Sales & Users Trend"
            badge="Monthly"
            color="#6366f1"
            icon="📉"
          />
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data}>
              <defs>
                <linearGradient id="lineGrad1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" {...axisStyle} />
              <YAxis {...axisStyle} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ color: "#94a3b8", fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#06b6d4"
                strokeWidth={2.5}
                dot={{ fill: "#06b6d4", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <ChartHeader
            title="Sales vs Revenue"
            badge="Comparison"
            color="#06b6d4"
            icon="📊"
          />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} barGap={4}>
              <defs>
                <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" {...axisStyle} />
              <YAxis {...axisStyle} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ color: "#94a3b8", fontSize: "12px" }} />
              <Bar
                dataKey="sales"
                fill="url(#barGrad1)"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
              <Bar
                dataKey="revenue"
                fill="url(#barGrad2)"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <ChartHeader
            title="Sales Distribution"
            badge="By Month"
            color="#f59e0b"
            icon="🥧"
          />
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                dataKey="sales"
                nameKey="month"
                outerRadius={100}
                innerRadius={52}
                paddingAngle={3}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={{ stroke: "#cbd5e1" }}
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <ChartHeader
            title="Revenue Growth"
            badge="Cumulative"
            color="#10b981"
            icon="🚀"
          />
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" {...axisStyle} />
              <YAxis {...axisStyle} />
              <Tooltip {...tooltipStyle} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#areaGrad)"
                dot={{ fill: "#10b981", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <p className="text-center text-slate-300 text-xs mt-12 tracking-wide">
        Last updated ·{" "}
        {new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </div>
  );
}
