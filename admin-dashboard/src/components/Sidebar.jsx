import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaChartBar,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaClock,
  FaCalendarAlt,
  FaCog,
  FaUserCheck,
  FaPercentage,
  FaListAlt,
  FaBlog,
  FaUserShield,
  FaUser,
  FaFileInvoiceDollar,
  FaFilePdf,
  FaFileUpload,
} from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";

const allMenus = [
  {
    name: "Dashboard",
    path: "/",
    icon: <FaHome />,
    iconBg: "bg-violet-100 text-violet-600",
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: <FaChartBar />,
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    name: "Task",
    path: "/orders",
    icon: <FaShoppingCart />,
    iconBg: "bg-emerald-100 text-emerald-600",
  },
  {
    name: "Login hours",
    path: "/login-hours",
    icon: <FaClock />,
    iconBg: "bg-indigo-100 text-indigo-600",
  },
  {
    name: "Attendance",
    path: "/attendance",
    icon: <FaUserCheck />,
    iconBg: "bg-green-100 text-green-600",
  },
  {
    name: "R&D Calendar",
    path: "/calendar",
    icon: <FaCalendarAlt />,
    iconBg: "bg-indigo-100 text-indigo-600",
  },
  {
    name: "Performance",
    path: "/performance",
    icon: <FaBox />,
    iconBg: "bg-pink-100 text-pink-600",
  },
  {
    name: "My Profile",
    path: "/profile",
    icon: <FaUsers />,
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    name: "Percentage",
    path: "/percentage",
    icon: <FaPercentage />,
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    name: "Details",
    path: "/details",
    icon: <FaListAlt />,
    iconBg: "bg-green-100 text-green-600",
  },
  {
  name: "Visual Data",
  path: "/visual",
  icon: <FaChartBar />,
  iconBg: "bg-blue-100 text-blue-600",
},
{
  name: "Upload PDF",
  path: "/upload-pdf",
  icon: <FaFileUpload />,
  iconBg: "bg-red-100 text-red-600",
},
{
  name: "My PDFs",
  path: "/my-pdfs",
  icon: <FaFilePdf />,
  iconBg: "bg-red-100 text-red-600",
},
  {
    name: "Blog",
    path: "/blog",
    icon: <FaBlog />,
    iconBg: "bg-green-100 text-green-600",
  },
  {
    name: "Invoice Preview",
    path: "/invoice",
    icon: <FaFileInvoiceDollar />,
    iconBg: "bg-purple-100 text-purple-600",
  },
  {
    name: "Invoice List",
    path: "/invoiceList",
    icon: <FaFileInvoiceDollar />,
    iconBg: "bg-orange-100 text-orange-600",
  },
  {
    name: "Admin Dashboard",
    path: "/admin",
    icon: <FaUserShield />,
    iconBg: "bg-red-100 text-red-600",
  },
  {
    name: "User Dashboard",
    path: "/user",
    icon: <FaUser />,
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <FaCog />,
    iconBg: "bg-gray-100 text-gray-600",
  },
];

const Sidebar = ({ collapsed, setCollapsed, onClose }) => {
  const [tooltip, setTooltip] = useState(null);
  const [allowedMenus, setAllowedMenus] = useState([]);

  const token = localStorage.getItem("token");
  const handleMouseEnter = (e, name) => {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ name, y: rect.top + rect.height / 2 });
  };

  const handleMouseLeave = () => setTooltip(null);
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = res.data;
        if (user.role === "admin") {
          setAllowedMenus(allMenus);
          return;
        }
        const filtered = allMenus.filter((menu) => {
          const menuKey =
            menu.path === "/" ? "dashboard" : menu.path.replace("/", "");

          return user.permissions?.includes(menuKey);
        });

        setAllowedMenus(filtered);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPermissions();
  }, []);
  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-full flex flex-col bg-white border-r border-gray-100 shadow-sm shrink-0 overflow-hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" }}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 shrink-0">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2.5 overflow-hidden"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-xs">N</span>
                </div>
                <span className="text-gray-900 font-bold text-base whitespace-nowrap tracking-tight">
                  Nexus<span className="text-violet-600">HQ</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-1.5 ml-auto">
            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 border border-gray-200 transition shrink-0"
                aria-label="Close sidebar"
              >
                <FaTimes className="text-[10px]" />
              </button>
            )}

            <button
              onClick={() => {
                setCollapsed(!collapsed);
                setTooltip(null);
              }}
              className="hidden md:flex w-7 h-7 rounded-lg items-center justify-center text-gray-400 hover:text-violet-600 hover:bg-violet-50 border border-gray-200 transition shrink-0"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <FaChevronRight className="text-[10px]" />
              ) : (
                <FaChevronLeft className="text-[10px]" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400"
            >
              Main Menu
            </motion.p>
          )}
        </AnimatePresence>

        <nav
          className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto overflow-x-hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {allowedMenus.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              end={item.path === "/"}
              onClick={() => onClose?.()}
            >
              {({ isActive }) => (
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  onMouseEnter={(e) => handleMouseEnter(e, item.name)}
                  onMouseLeave={handleMouseLeave}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 select-none
                    ${
                      isActive
                        ? "bg-violet-50 text-violet-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeBar"
                      className="absolute left-0 top-2 bottom-2 w-0.5 bg-violet-500 rounded-full"
                    />
                  )}

                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 transition-colors
                    ${isActive ? "bg-violet-100 text-violet-600" : item.iconBg}`}
                  >
                    {item.icon}
                  </div>

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`text-sm font-medium whitespace-nowrap ${isActive ? "text-violet-700" : "text-gray-700"}`}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {isActive && collapsed && (
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-violet-500" />
                  )}
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-3 shrink-0">
          <div
            className={`flex items-center gap-3 px-1 py-1 rounded-xl hover:bg-gray-50 transition cursor-pointer ${collapsed ? "justify-center" : ""}`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">AK</span>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-800 text-xs font-semibold whitespace-nowrap leading-tight">
                    Aditi Kumar
                  </p>
                  <p className="text-gray-400 text-[11px] whitespace-nowrap">
                    Administrator
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      <AnimatePresence>
        {tooltip && collapsed && (
          <motion.div
            key={tooltip.name}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[9999] pointer-events-none flex items-center"
            style={{ left: 80, top: tooltip.y, transform: "translateY(-50%)" }}
          >
            <div
              className="w-0 h-0"
              style={{
                borderTop: "5px solid transparent",
                borderBottom: "5px solid transparent",
                borderRight: "6px solid #111827",
              }}
            />
            <div className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
              {tooltip.name}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
