import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBell,
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaPlus,
  FaBars,
  FaRegClock,
} from "react-icons/fa";

const notifications = [
  {
    text: "New enterprise inquiry from Acme Corp",
    time: "3 min ago",
    type: "info",
  },
  {
    text: "Server load spike detected (78%)",
    time: "17 min ago",
    type: "warning",
  },
  {
    text: "Monthly report is ready to review",
    time: "1 hr ago",
    type: "success",
  },
  { text: "Subscription renewal failed", time: "2 hr ago", type: "danger" },
];

const typeIcon = {
  info: <FaPlus className="text-blue-500 text-[10px]" />,
  warning: <FaClock className="text-amber-500 text-[10px]" />,
  success: <FaCheckCircle className="text-emerald-500 text-[10px]" />,
  danger: <FaTimesCircle className="text-rose-500 text-[10px]" />,
};

const typeBg = {
  info: "bg-blue-50",
  warning: "bg-amber-50",
  success: "bg-emerald-50",
  danger: "bg-rose-50",
};

const typeDot = {
  info: "bg-blue-400",
  warning: "bg-amber-400",
  success: "bg-emerald-400",
  danger: "bg-rose-400",
};
const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
const Navbar = ({ onMenuClick }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotify, setOpenNotify] = useState(false);
  const [unread, setUnread] = useState(notifications.length);
  const [openTimer, setOpenTimer] = useState(false);
  const timerRef = useRef();
  const profileRef = useRef();
  const notifyRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setOpenProfile(false);
      if (notifyRef.current && !notifyRef.current.contains(e.target))
        setOpenNotify(false);
      if (timerRef.current && !timerRef.current.contains(e.target)) {
        setOpenTimer(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleCheckIn = () => {
    const now = new Date();

    const session = {
      id: Date.now(),
      start: now,
      end: null,
      duration: 0,
      status: "Active",
    };

    const existing = JSON.parse(localStorage.getItem("loginHours")) || [];

    localStorage.setItem("loginHours", JSON.stringify([...existing, session]));

    setStartTime(now);
    setIsRunning(true);

    window.dispatchEvent(new Event("loginHoursUpdated"));
  };
  const handlePause = () => {
    setIsRunning(false);
  };
  const handleCheckOut = () => {
    const endTime = new Date();

    let existing = JSON.parse(localStorage.getItem("loginHours")) || [];

    const index = existing.findIndex((item) => item.status === "Active");

    if (index !== -1) {
      existing[index] = {
        ...existing[index],
        end: endTime,
        duration: seconds,
        status: "Clocked Out",
      };
    }

    localStorage.setItem("loginHours", JSON.stringify(existing));

    window.dispatchEvent(new Event("loginHoursUpdated"));

    setIsRunning(false);
    setSeconds(0);
    setStartTime(null);
  };
  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };
  const handleOpenNotify = () => {
    setOpenNotify((v) => !v);
    setOpenProfile(false);
    if (!openNotify) setUnread(0);
  };

  const handleOpenProfile = () => {
    setOpenProfile((v) => !v);
    setOpenNotify(false);
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-50 flex items-center justify-between
        px-4 sm:px-6 h-16 bg-white border-b border-gray-100 shadow-sm gap-3"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center
            bg-gray-50 border border-gray-200 text-gray-500
            hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition shrink-0"
          aria-label="Open menu"
        >
          <FaBars className="text-sm" />
        </button>

        <div className="min-w-0">
          <h1 className="text-gray-900 text-sm sm:text-base font-bold leading-tight tracking-tight truncate">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-[11px] hidden sm:block">
            Manage your platform
          </p>
        </div>
      </div>

      <div
        className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200
        rounded-xl px-3.5 py-2 w-64 lg:w-80 shrink-0
        focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all"
      >
        <FaSearch className="text-gray-400 text-xs shrink-0" />
        <input
          type="text"
          placeholder="Search orders, customers…"
          className="bg-transparent outline-none w-full text-sm text-gray-700
            placeholder:text-gray-400"
        />
        <kbd
          className="hidden lg:inline text-[10px] text-gray-300 border border-gray-200
          rounded px-1.5 py-0.5 font-mono shrink-0"
        >
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center
            bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100 transition"
          aria-label="Search"
        >
          <FaSearch className="text-sm" />
        </button>
        <div className="relative" ref={timerRef}>
          <button
            onClick={() => setOpenTimer(!openTimer)}
            className="w-9 h-9 rounded-xl flex items-center justify-center
    bg-gray-50 border border-gray-200 text-gray-500
    hover:bg-gray-100 transition"
          >
            <FaRegClock className="text-sm" />
          </button>

          <AnimatePresence>
            {openTimer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50"
              >
                <p className="text-green-600 font-semibold text-sm mb-3">
                  Total logged time: {formatTime(seconds)}
                </p>
                <div className="flex gap-2">
                  {!isRunning ? (
                    <button
                      onClick={handleCheckIn}
                      className="flex-1 border border-green-500 text-green-500 text-xs py-2 rounded-md"
                    >
                      ▶ Check In
                    </button>
                  ) : (
                    <button
                      onClick={handlePause}
                      className="flex-1 border border-blue-500 text-blue-500 text-xs py-2 rounded-md"
                    >
                      ⏸ Pause
                    </button>
                  )}

                  <button
                    onClick={handleCheckOut}
                    className="flex-1 border border-red-500 text-red-500 text-xs py-2 rounded-md"
                  >
                    ⛔ Check Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative" ref={notifyRef}>
          <button
            onClick={handleOpenNotify}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center
              bg-gray-50 border border-gray-200 text-gray-500
              hover:bg-gray-100 hover:text-gray-700 transition"
            aria-label="Notifications"
          >
            <FaBell className="text-sm" />
            {unread > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white
                text-[9px] font-bold rounded-full flex items-center justify-center"
              >
                {unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {openNotify && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-11 w-[min(320px,calc(100vw-2rem))] bg-white
                  border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="text-gray-900 font-semibold text-sm">
                    Notifications
                  </span>
                  <button
                    onClick={() => setUnread(0)}
                    className="text-[11px] text-violet-600 font-semibold hover:text-violet-700 transition"
                  >
                    Mark all read
                  </button>
                </div>

                {notifications.map((n, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition
                      border-b border-gray-50 last:border-b-0 cursor-pointer"
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${typeBg[n.type]}`}
                    >
                      {typeIcon[n.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 text-xs leading-snug">
                        {n.text}
                      </p>
                      <p className="text-gray-400 text-[11px] mt-0.5">
                        {n.time}
                      </p>
                    </div>
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${typeDot[n.type]}`}
                    />
                  </div>
                ))}

                <div className="px-4 py-2.5 text-center">
                  <button className="text-xs text-gray-400 hover:text-violet-600 font-medium transition">
                    View all notifications →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden sm:block w-px h-6 bg-gray-200 mx-0.5" />

        <div className="relative" ref={profileRef}>
          <button
            onClick={handleOpenProfile}
            className="flex items-center gap-2 sm:gap-2.5 px-2 sm:px-2.5 py-1.5
              rounded-xl hover:bg-gray-50 transition cursor-pointer"
            aria-label="Profile menu"
          >
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500
              flex items-center justify-center shrink-0"
            >
              <span className="text-white text-xs font-bold">AK</span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-gray-800 text-xs font-semibold leading-tight">
                Aditi Kumar
              </p>
              <p className="text-gray-400 text-[11px]">Administrator</p>
            </div>
          </button>

          <AnimatePresence>
            {openProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-12 w-52 bg-white border border-gray-100
                  rounded-2xl shadow-xl z-50 overflow-hidden py-1.5"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-gray-900 text-sm font-semibold">
                    Aditi Kumar
                  </p>
                  <p className="text-gray-400 text-xs">aditi@nexushq.io</p>
                </div>

                <div className="py-1">
                  <button
                    className="flex items-center gap-2.5 w-full px-4 py-2.5
                    hover:bg-gray-50 transition text-sm text-gray-700 font-medium"
                  >
                    <FaUser className="text-gray-400 text-xs" /> My Profile
                  </button>
                  <button
                    className="flex items-center gap-2.5 w-full px-4 py-2.5
                    hover:bg-gray-50 transition text-sm text-gray-700 font-medium"
                  >
                    <FaCog className="text-gray-400 text-xs" /> Settings
                  </button>
                </div>

                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5
  hover:bg-rose-50 transition text-sm text-rose-500 font-medium"
                  >
                    <FaSignOutAlt className="text-xs" /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
