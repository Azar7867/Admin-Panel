import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast, { Toaster } from "react-hot-toast";
import { PieChart, Pie, Cell } from "recharts";
import { BASE_URL } from "../api/api";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaBoxOpen,
  FaArrowUp,
  FaArrowDown,
  FaEllipsisH,
  FaDownload,
  FaPlus,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaStar,
  FaMobileAlt,
  FaDesktop,
  FaBell,
  FaCog,
  FaChevronRight,
  FaTrophy,
  FaFire,
} from "react-icons/fa";

const revenueData = [
  { month: "Jan", revenue: 42000, profit: 21000 },
  { month: "Feb", revenue: 68000, profit: 36000 },
  { month: "Mar", revenue: 51000, profit: 23000 },
  { month: "Apr", revenue: 94000, profit: 53000 },
  { month: "May", revenue: 76000, profit: 40000 },
  { month: "Jun", revenue: 112000, profit: 63000 },
  { month: "Jul", revenue: 98000, profit: 53000 },
];

const trafficData = [
  { day: "Mon", desktop: 1200, mobile: 800 },
  { day: "Tue", desktop: 1900, mobile: 1400 },
  { day: "Wed", desktop: 1400, mobile: 1100 },
  { day: "Thu", desktop: 2300, mobile: 1800 },
  { day: "Fri", desktop: 2800, mobile: 2100 },
  { day: "Sat", desktop: 1600, mobile: 1900 },
  { day: "Sun", desktop: 900, mobile: 1200 },
];

const topProducts = [
  {
    name: "Enterprise Suite",
    pct: 84,
    revenue: "$748K",
    color: "bg-violet-500",
  },
  { name: "Pro Plan", pct: 67, revenue: "$359K", color: "bg-blue-500" },
  { name: "Starter Pack", pct: 52, revenue: "$142K", color: "bg-emerald-500" },
  { name: "Analytics Add-on", pct: 31, revenue: "$85K", color: "bg-amber-400" },
];

const customers = [
  {
    name: "Aria Chen",
    company: "Acme Corp",
    spend: "$4,820",
    tier: "Gold",
    rating: 5,
    avatar: "AC",
    color: "bg-violet-100 text-violet-700",
  },
  {
    name: "Marcus Reid",
    company: "Corp.io",
    spend: "$12,300",
    tier: "Platinum",
    rating: 5,
    avatar: "MR",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Sana Patel",
    company: "Startup.dev",
    spend: "$960",
    tier: "Silver",
    rating: 4,
    avatar: "SP",
    color: "bg-pink-100 text-pink-700",
  },
  {
    name: "Leo Fontaine",
    company: "Studio FR",
    spend: "$3,200",
    tier: "Gold",
    rating: 4,
    avatar: "LF",
    color: "bg-amber-100 text-amber-700",
  },
];

const activities = [
  {
    icon: <FaCheckCircle className="text-emerald-500" />,
    text: "Order #9821 marked as complete",
    time: "2 min ago",
    bg: "bg-emerald-50",
  },
  {
    icon: <FaPlus className="text-blue-500" />,
    text: "New customer Nina Okafor registered",
    time: "18 min ago",
    bg: "bg-blue-50",
  },
  {
    icon: <FaClock className="text-amber-500" />,
    text: "Invoice #INV-1042 is overdue",
    time: "1 hr ago",
    bg: "bg-amber-50",
  },
  {
    icon: <FaTimesCircle className="text-rose-500" />,
    text: "Payment failed — Leo Fontaine ($299)",
    time: "3 hr ago",
    bg: "bg-rose-50",
  },
  {
    icon: <FaCheckCircle className="text-emerald-500" />,
    text: "Monthly backup completed",
    time: "5 hr ago",
    bg: "bg-emerald-50",
  },
];

const statusBadge = {
  Completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Refunded: "bg-rose-50 text-rose-600 border border-rose-200",
};

const tierBadge = {
  Platinum: "bg-slate-100 text-slate-700 border border-slate-300",
  Gold: "bg-amber-50 text-amber-700 border border-amber-200",
  Silver: "bg-gray-50 text-gray-600 border border-gray-200",
};

const revSparkline = [32, 45, 38, 60, 52, 68, 54];
const usersSparkline = [90, 95, 88, 102, 108, 115, 112];
const ordersSparkline = [18, 22, 16, 24, 21, 19, 14];
const productsSparkline = [60, 72, 80, 75, 88, 94, 90];

function Sparkline({ data, color, up }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80,
    h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const areaPath = `M${pts[0]} L${pts.slice(1).join(" L")} L${w},${h} L0,${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#sg-${color})`} />
      <polyline
        points={polyline}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={pts[pts.length - 1].split(",")[0]}
        cy={pts[pts.length - 1].split(",")[1]}
        r="3"
        fill={color}
      />
    </svg>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-xl text-sm">
        <p className="text-gray-400 text-xs mb-2 font-medium">{label}</p>
        {payload.map((p, i) => (
          <p
            key={i}
            style={{ color: p.color }}
            className="font-semibold text-xs"
          >
            {p.name}:{" "}
            {typeof p.value === "number" && p.value > 999
              ? `$${(p.value / 1000).toFixed(0)}k`
              : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function KPICard({
  title,
  value,
  change,
  up,
  icon,
  gradient,
  sparkData,
  sparkColor,
  subtitle,
  delay,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer group"
      style={{
        boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)",
      }}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${gradient}`} />

      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(124,58,237,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 mr-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider truncate">
              {title}
            </p>
            <p className="text-gray-900 text-xl sm:text-2xl font-bold mt-1 leading-none">
              {value}
            </p>
          </div>
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-base shrink-0 ${gradient.replace("bg-gradient-to-r ", "").split(" ")[0].replace("from-", "bg-").replace("-600", "-100")} group-hover:scale-110 transition-transform duration-200`}
            style={{ color: "currentColor" }}
          >
            <span className={`text-base`}>{icon}</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-1.5">
            <div
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full w-fit
              ${up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}
            >
              {up ? (
                <FaArrowUp className="text-[8px]" />
              ) : (
                <FaArrowDown className="text-[8px]" />
              )}
              {change}
            </div>
            <p className="text-gray-400 text-[11px]">
              {subtitle || "vs last month"}
            </p>
          </div>
          <div className="opacity-80">
            <Sparkline data={sparkData} color={sparkColor} up={up} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [orderFilter, setOrderFilter] = useState("All");
  const [ordersData, setOrdersData] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fields, setFields] = useState([]);
  const [rows, setRows] = useState([]);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [newField, setNewField] = useState("");
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const openEditModal = (row, index) => {
    setEditRowIndex(index);
    setEditFormData(row);
    setShowEditModal(true);
  };
  const updateData = async () => {
    try {
      await axios.put(`${BASE_URL}/dynamic/orders/update-data`, {
        index: editRowIndex,
        updatedData: editFormData,
      });

      toast.success("Row updated successfully ✅");

      setShowEditModal(false);
      await fetchData();
    } catch (err) {
      toast.error("Failed to update ❌");
      console.error("Update error:", err);
    }
  };
  const deleteRow = async (index) => {
    try {
      await axios.delete(`${BASE_URL}/dynamic/orders/delete-data`, {
        data: { index },
      });

      toast.success("Row deleted successfully 🗑️");

      await fetchData();
    } catch (err) {
      toast.error("Delete failed ❌");
    }
  };
  const downloadPDF = () => {
    const doc = new jsPDF();

    const tableColumn = fields;

    const tableRows = filteredRows.map((row) =>
      fields.map((field) => row[field] || ""),
    );

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [124, 58, 237] },
    });

    doc.save("orders.pdf");
  };
  const filteredRows = rows
    .filter((r) => {
      if (orderFilter === "All") return true;
      return r.status === orderFilter || r.Status === orderFilter;
    })
    .filter((row) => {
      return fields.some((field) =>
        String(row[field] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      );
    });

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = filteredRows.slice(
    startIndex,
    startIndex + rowsPerPage,
  );
  const addField = async () => {
    if (!newField.trim()) {
      setFieldError("Field is Required");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/dynamic/orders/add-field`, {
        field: newField.trim(),
      });

      setNewField("");
      setFieldError("");
      setShowFieldModal(false);

      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };
  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const addData = async () => {
    let errors = {};

    fields.forEach((field) => {
      if (!formData[field] || !formData[field].trim()) {
        errors[field] = "Field is required";
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await axios.post(`${BASE_URL}/dynamic/orders/add-data`, formData);

      toast.success("Row added successfully 🎉");

      setFormData({});
      setFormErrors({});
      setShowDataModal(false);

      await fetchData();
    } catch (err) {
      toast.error("Failed to add data ❌");
      console.error(err);
    }
  };
  const filteredOrders =
    orderFilter === "All"
      ? ordersData
      : ordersData.filter((o) => o.status === orderFilter);
  const fetchData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/dynamic/orders`);

      // console.log("API RESPONSE:", res.data);

      setFields(res.data.fields || []);
      setRows(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div
      className="bg-gray-50 min-h-screen"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" }}
    >
      <Toaster position="top-right" reverseOrder={false} />
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto">
        <div className="bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white rounded-full translate-y-1/2" />
          </div>
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FaFire className="text-amber-300 text-sm" />
                <span className="text-violet-200 text-xs font-semibold uppercase tracking-wider">
                  7-day streak
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Good morning, Aditi! 👋
              </h1>
              <p className="text-violet-200 text-sm mt-1">
                You're 75% towards your monthly goal. Keep it up!
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <div className="text-center">
                <p className="text-2xl font-bold">75%</p>
                <p className="text-violet-200 text-xs">Goal</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold">6</p>
                <p className="text-violet-200 text-xs">Days left</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <KPICard
            title="Total Revenue"
            value="$54,230"
            change="+18.2%"
            up={true}
            icon={<FaDollarSign className="text-violet-600" />}
            gradient="bg-gradient-to-r from-violet-600 to-violet-400"
            sparkData={revSparkline}
            sparkColor="#7c3aed"
            subtitle="vs last month"
            delay={0}
          />
          <KPICard
            title="Active Users"
            value="12,480"
            change="+5.6%"
            up={true}
            icon={<FaUsers className="text-blue-600" />}
            gradient="bg-gradient-to-r from-blue-600 to-blue-400"
            sparkData={usersSparkline}
            sparkColor="#2563eb"
            subtitle="vs last month"
            delay={0.07}
          />
          <KPICard
            title="New Orders"
            value="1,354"
            change="-2.1%"
            up={false}
            icon={<FaShoppingCart className="text-rose-600" />}
            gradient="bg-gradient-to-r from-rose-500 to-rose-400"
            sparkData={ordersSparkline}
            sparkColor="#e11d48"
            subtitle="vs last month"
            delay={0.14}
          />
          <KPICard
            title="Products Sold"
            value="8,920"
            change="+12.9%"
            up={true}
            icon={<FaBoxOpen className="text-emerald-600" />}
            gradient="bg-gradient-to-r from-emerald-600 to-emerald-400"
            sparkData={productsSparkline}
            sparkColor="#059669"
            subtitle="vs last month"
            delay={0.21}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <h2 className="text-gray-900 font-semibold mb-5 text-sm tracking-wide">
              Quick Actions ⚡
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Add User", color: "from-violet-500 to-indigo-500" },
                { label: "Add Product", color: "from-blue-500 to-cyan-500" },
                {
                  label: "Create Order",
                  color: "from-emerald-500 to-teal-500",
                },
                {
                  label: "Generate Report",
                  color: "from-amber-500 to-orange-500",
                },
              ].map((item, i) => (
                <button
                  key={i}
                  className={`p-4 rounded-xl text-white text-sm font-medium bg-gradient-to-r ${item.color}
          shadow-sm hover:scale-[1.05] hover:shadow-md transition`}
                >
                  + {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <h2 className="text-gray-900 font-semibold mb-5 text-sm tracking-wide">
              System Alerts ⚠️
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 hover:bg-rose-100 transition">
                <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                <p className="text-rose-600 font-medium">
                  Server CPU usage high
                </p>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 hover:bg-amber-100 transition">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <p className="text-amber-600 font-medium">
                  3 pending approvals
                </p>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <p className="text-blue-600 font-medium">
                  New admin login detected
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <h2 className="text-gray-900 font-semibold mb-6 text-sm tracking-wide">
              System Overview 📊
            </h2>
            <div className="flex items-center justify-center relative h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="grad3" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>

                  <Pie
                    data={[
                      { name: "Server", value: 72 },
                      { name: "Database", value: 58 },
                      { name: "API", value: 81 },
                    ]}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    cornerRadius={10}
                  >
                    <Cell fill="url(#grad1)" />
                    <Cell fill="url(#grad2)" />
                    <Cell fill="url(#grad3)" />
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute flex flex-col items-center">
                <p className="text-lg font-bold text-gray-800">70%</p>
                <p className="text-xs text-gray-400">Avg Load</p>
              </div>
            </div>

            <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
                Server
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                Database
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                API
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 no-scrollbar">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 min-w-[220px] sm:min-w-0 flex-shrink-0 sm:flex-shrink">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
              Monthly Goal
            </p>
            <div className="flex items-end justify-between mb-2">
              <p className="text-gray-900 text-xl font-bold">$54.2K</p>
              <p className="text-gray-400 text-xs">of $72K</p>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
              />
            </div>
            <p className="text-violet-600 text-xs font-semibold">
              75% achieved · 6 days left
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 min-w-[220px] sm:min-w-0 flex-shrink-0 sm:flex-shrink">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
              Conversion Rate
            </p>
            <p className="text-gray-900 text-xl font-bold mb-1">3.84%</p>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                <FaArrowUp className="text-[8px]" /> +0.6%
              </span>
              <span className="text-gray-400 text-xs">this month</span>
            </div>
            <div className="flex gap-1 items-end" style={{ height: 32 }}>
              {[60, 45, 70, 80, 55, 90, 75].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gray-100 rounded-sm relative overflow-hidden"
                  style={{ height: 32 }}
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    className="bg-violet-400 rounded-sm absolute bottom-0 left-0 right-0"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 min-w-[220px] sm:min-w-0 flex-shrink-0 sm:flex-shrink">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
              Satisfaction
            </p>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-gray-900 text-xl font-bold">4.8</p>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((j) => (
                  <FaStar
                    key={j}
                    className={`text-xs ${j <= 4 ? "text-amber-400" : "text-amber-200"}`}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              {[
                ["5★", 72],
                ["4★", 18],
                ["3★", 7],
                ["1-2★", 3],
              ].map(([label, pct]) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-gray-400 text-[10px] w-7">{label}</span>
                  <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7 }}
                      className="h-1.5 rounded-full bg-amber-400"
                    />
                  </div>
                  <span className="text-gray-400 text-[10px] w-6 text-right">
                    {pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-gray-900 font-semibold text-sm sm:text-base">
                  Revenue & Profit
                </h2>
                <p className="text-gray-400 text-xs mt-0.5">Jan – Jul 2026</p>
              </div>
              <div className="flex gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block" />
                  Revenue
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  Profit
                </span>
              </div>
            </div>
            <div className="h-44 sm:h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#7c3aed"
                        stopOpacity={0.15}
                      />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#10b981"
                        stopOpacity={0.15}
                      />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    stroke="#cbd5e1"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                  />
                  <YAxis
                    stroke="#e2e8f0"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    tickFormatter={(v) => `$${v / 1000}k`}
                    width={36}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#7c3aed"
                    strokeWidth={2.5}
                    fill="url(#gRev)"
                    name="Revenue"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#gProfit)"
                    name="Profit"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-gray-900 font-semibold text-sm sm:text-base">
                  Site Traffic
                </h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  Desktop vs Mobile
                </p>
              </div>
            </div>
            <div className="flex gap-3 text-xs text-gray-500 mb-4 mt-2">
              <span className="flex items-center gap-1.5">
                <FaDesktop className="text-violet-400 text-[10px]" /> Desktop
              </span>
              <span className="flex items-center gap-1.5">
                <FaMobileAlt className="text-blue-400 text-[10px]" /> Mobile
              </span>
            </div>
            <div className="h-40 sm:h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData} barSize={7} barCategoryGap="30%">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke="#e2e8f0"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                  />
                  <YAxis
                    stroke="#e2e8f0"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    width={32}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="desktop"
                    fill="#7c3aed"
                    radius={[4, 4, 0, 0]}
                    name="Desktop"
                  />
                  <Bar
                    dataKey="mobile"
                    fill="#60a5fa"
                    radius={[4, 4, 0, 0]}
                    name="Mobile"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-gray-100 gap-3">
              <h2 className="text-gray-900 font-semibold text-sm sm:text-base">
                Recent Orders
              </h2>
              <div className="flex items-center gap-1.5 flex-wrap">
                {["All", "Completed", "Pending", "Refunded"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setOrderFilter(f)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition
              ${orderFilter === f ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100 flex-wrap">
              <button
                onClick={() => setShowFieldModal(true)}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-violet-100 text-violet-700 hover:bg-violet-200 transition whitespace-nowrap"
              >
                <FaPlus className="text-[9px]" /> Add Field
              </button>
              <button
                onClick={() => setShowDataModal(true)}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition whitespace-nowrap"
              >
                <FaPlus className="text-[9px]" /> Add Data
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition whitespace-nowrap"
              >
                <FaDownload className="text-[9px]" /> Download PDF
              </button>

              <div className="ml-auto">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 bg-white w-40 transition"
                />
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              {fields.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  <FaBoxOpen className="mx-auto mb-2 text-2xl opacity-30" />
                  No fields yet — click{" "}
                  <span className="font-semibold text-violet-500">
                    Add Field
                  </span>{" "}
                  to get started
                </div>
              ) : (
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr>
                      {fields.map((f, i) => (
                        <th key={i} className="px-4 py-3 ...">
                          {f}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-xs text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRows.length > 0 ? (
                      paginatedRows.map((row, i) => (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 transition border-b border-gray-50 last:border-0"
                        >
                          {fields.map((f, j) => {
                            const val = row[f] ?? "—";
                            const fl = f.toLowerCase();

                            if (fl === "status") {
                              const map = {
                                Completed:
                                  "bg-emerald-50 text-emerald-700 border border-emerald-200",
                                Pending:
                                  "bg-amber-50 text-amber-700 border border-amber-200",
                                Refunded:
                                  "bg-rose-50 text-rose-600 border border-rose-200",
                              };
                              const dot = {
                                Completed: "bg-emerald-500",
                                Pending: "bg-amber-500",
                                Refunded: "bg-rose-500",
                              };
                              return (
                                <td key={j} className="px-4 py-3">
                                  <span
                                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${map[val] || "bg-gray-100 text-gray-600"}`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot[val] || "bg-gray-400"}`}
                                    />
                                    {val}
                                  </span>
                                </td>
                              );
                            }

                            if (fl === "customer") {
                              const avatarColors = [
                                "bg-violet-100 text-violet-700",
                                "bg-blue-100 text-blue-700",
                                "bg-pink-100 text-pink-700",
                                "bg-amber-100 text-amber-700",
                                "bg-teal-100 text-teal-700",
                              ];
                              const initials = val
                                .split(" ")
                                .map((w) => w[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase();
                              return (
                                <td key={j} className="px-4 py-3">
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${avatarColors[i % avatarColors.length]}`}
                                    >
                                      {initials}
                                    </div>
                                    <span className="font-medium text-gray-800 text-sm">
                                      {val}
                                    </span>
                                  </div>
                                </td>
                              );
                            }

                            if (fl === "order id" || fl === "id")
                              return (
                                <td
                                  key={j}
                                  className="px-4 py-3 font-mono text-xs text-gray-500"
                                >
                                  {val}
                                </td>
                              );

                            if (fl === "amount")
                              return (
                                <td
                                  key={j}
                                  className="px-4 py-3 font-semibold text-gray-800"
                                >
                                  {val}
                                </td>
                              );

                            return (
                              <td key={j} className="px-4 py-3 text-gray-600">
                                {val}
                              </td>
                            );
                          })}
                          <td className="px-4 py-3 flex gap-2">
                            <button
                              onClick={() => openEditModal(row, startIndex + i)}
                              className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                              ✏️
                            </button>

                            <button
                              onClick={() => deleteRow(startIndex + i)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={fields.length}
                          className="px-4 py-10 text-center text-gray-400 text-sm"
                        >
                          {searchTerm ? (
                            <>
                              No results for "
                              <span className="font-medium text-gray-600">
                                {searchTerm}
                              </span>
                              "
                            </>
                          ) : (
                            <>
                              No data yet — click{" "}
                              <span className="font-semibold text-emerald-600">
                                Add Data
                              </span>{" "}
                              to add a row
                            </>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
            {fields.length > 0 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {rows.length} order{rows.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-gray-200 select-none">|</span>
                  <span className="text-xs text-gray-400">Show</span>
                  <select
                    value={rowsPerPage}
                    onChange={handleRowsChange}
                    className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white outline-none focus:ring-2 focus:ring-violet-200"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <span className="text-xs text-gray-400">per page</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-2.5 py-1 text-xs rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    ‹
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-2.5 py-1 text-xs rounded-md transition font-medium
                ${
                  currentPage === i + 1
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-2.5 py-1 text-xs rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>

          {showFieldModal && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 text-base">
                    Add new field
                  </h3>
                  <button
                    onClick={() => setShowFieldModal(false)}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition text-sm"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-5">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Field Name
                  </label>
                  <input
                    placeholder="e.g. Customer, Amount, Status…"
                    value={newField}
                    onChange={(e) => {
                      setNewField(e.target.value);
                      if (fieldError) setFieldError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addField();
                    }}
                    className={`w-full border rounded-xl px-3 py-2 text-sm outline-none transition
    ${
      fieldError
        ? "border-red-400 focus:ring-red-200"
        : "border-gray-200 focus:ring-violet-200 focus:border-violet-400"
    }`}
                  />
                  {fieldError && (
                    <p className="text-red-500 text-xs mt-2">{fieldError}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-2">
                    The column will be added to your orders table. Press Enter
                    to save.
                  </p>
                </div>
                <div className="flex gap-2 justify-end px-5 pb-5 pt-2">
                  <button
                    onClick={() => setShowFieldModal(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addField}
                    className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition"
                  >
                    Save Field
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDataModal && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 text-base">
                    Add new row
                  </h3>
                  <button
                    onClick={() => setShowDataModal(false)}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition text-sm"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                  {fields.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">
                      No fields yet. Add fields first.
                    </p>
                  ) : (
                    fields.map((f, i) => (
                      <div key={i}>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                          {f}
                        </label>
                        <input
                          placeholder={`Enter ${f.toLowerCase()}…`}
                          value={formData[f] || ""}
                          onChange={(e) => {
                            setFormData({ ...formData, [f]: e.target.value });
                            if (formErrors[f]) {
                              setFormErrors({ ...formErrors, [f]: "" });
                            }
                          }}
                          className={`w-full border rounded-xl px-3 py-2 text-sm outline-none transition
    ${
      formErrors[f]
        ? "border-red-400 focus:ring-red-200"
        : "border-gray-200 focus:ring-emerald-200 focus:border-emerald-400"
    }`}
                        />
                        {formErrors[f] && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors[f]}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2 justify-end px-5 pb-5 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setShowDataModal(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addData}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition"
                  >
                    Add Row
                  </button>
                </div>
              </div>
            </div>
          )}
          {showEditModal && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                <div className="flex justify-between px-5 py-4 border-b">
                  <h3 className="font-semibold text-gray-900">Edit Row</h3>
                  <button onClick={() => setShowEditModal(false)}>✕</button>
                </div>

                <div className="p-5 space-y-4">
                  {fields.map((f, i) => (
                    <div key={i}>
                      <label className="text-xs text-gray-400">{f}</label>
                      <input
                        value={editFormData[f] || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            [f]: e.target.value,
                          })
                        }
                        className="w-full border rounded-xl px-3 py-2"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 px-5 pb-5">
                  <button onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button
                    onClick={updateData}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900 font-semibold text-sm sm:text-base">
                Activity Feed
              </h2>
              <span className="text-xs text-gray-400 font-medium">Today</span>
            </div>
            <div className="space-y-3 flex-1">
              {activities.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3"
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${a.bg}`}
                  >
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 text-xs leading-snug">
                      {a.text}
                    </p>
                    <p className="text-gray-400 text-[10px] mt-0.5">{a.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <button className="mt-4 w-full text-xs py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition font-medium">
              View full log
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-gray-900 font-semibold text-sm sm:text-base">
                Top Products by Revenue
              </h2>
              <FaEllipsisH className="text-gray-300 cursor-pointer hover:text-gray-500 transition" />
            </div>
            <div className="space-y-4">
              {topProducts.map((p, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-gray-700 text-sm font-medium">
                      {p.name}
                    </span>
                    <span className="text-gray-900 text-sm font-bold">
                      {p.revenue}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p.pct}%` }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: "easeOut",
                      }}
                      className={`h-2 rounded-full ${p.color}`}
                    />
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    {p.pct}% of total
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-gray-900 font-semibold text-sm sm:text-base">
                Top Customers
              </h2>
              <button className="text-xs text-violet-600 font-semibold hover:text-violet-700 transition">
                See all →
              </button>
            </div>
            <div className="space-y-2">
              {customers.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer"
                >
                  <div
                    className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 ${c.color}`}
                  >
                    {c.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-semibold text-sm truncate">
                      {c.name}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {c.company}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-gray-900 font-bold text-sm">{c.spend}</p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${tierBadge[c.tier]}`}
                    >
                      {c.tier}
                    </span>
                  </div>
                  <div className="hidden sm:flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <FaStar
                        key={j}
                        className={`text-[9px] ${j < c.rating ? "text-amber-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-4" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-gray-100 px-2 py-2 flex items-center justify-around z-20">
        {[
          { icon: <FaTrophy />, label: "Overview", active: true },
          { icon: <FaShoppingCart />, label: "Orders", active: false },
          { icon: <FaUsers />, label: "Customers", active: false },
          { icon: <FaCog />, label: "Settings", active: false },
        ].map((item, i) => (
          <button
            key={i}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition
            ${item.active ? "text-violet-600 bg-violet-50" : "text-gray-400 hover:text-gray-600"}`}
          >
            <span className="text-base">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="h-16 sm:hidden" />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (min-width: 480px) { .xs\\:inline { display: inline; } }
      `}</style>
    </div>
  );
}
