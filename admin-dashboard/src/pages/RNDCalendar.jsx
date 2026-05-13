import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../api/api";
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function fmt(d) {
  const date = new Date(d);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function fmtDisplay(d) {
  const date = new Date(d);
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function fmt12(t) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
}

export default function CalendarPage() {
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);
  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [meeting, setMeeting] = useState("");
  const [time, setTime] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({ meeting: "", time: "" });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const fetchSchedules = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/schedule`);
      setSchedules(res.data);
    } catch (err) {
      console.error("Failed to fetch schedules", err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const validate = () => {
    const newErrors = { meeting: "", time: "" };
    let valid = true;
    if (!meeting.trim()) {
      newErrors.meeting = "Meeting name is required.";
      valid = false;
    }
    if (!time) {
      newErrors.time = "Time is required.";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const saveSchedule = async () => {
    if (!validate()) return;

    try {
      if (editId) {
        await axios.put(`${BASE_URL}/schedule/${editId}`, {
          date: selectedDate,
          meeting,
          time,
        });
        showToast("Meeting updated successfully ✏️");
      } else {
        await axios.post(`${BASE_URL}/schedule`, {
          date: selectedDate,
          meeting,
          time,
        });
        showToast("Meeting added successfully ✅");
      }

      closeModal();
      fetchSchedules();
    } catch (err) {
      showToast("Something went wrong ❌", "error");
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/schedule/${deleteId}`);
      fetchSchedules();
      showToast("Meeting deleted 🗑️");
    } catch (err) {
      showToast("Delete failed ❌", "error");
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const openAdd = () => {
    setMeeting("");
    setTime("");
    setEditId(null);
    setErrors({ meeting: "", time: "" });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setMeeting(s.meeting);
    setTime(s.time);
    setEditId(s._id);
    setErrors({ meeting: "", time: "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setMeeting("");
    setTime("");
    setEditId(null);
    setErrors({ meeting: "", time: "" });
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrev = new Date(currentYear, currentMonth, 0).getDate();
  const datesWithMeetings = new Set(schedules.map((s) => fmt(s.date)));

  const calCells = [];
  for (let i = 0; i < firstDay; i++)
    calCells.push({
      day: daysInPrev - firstDay + 1 + i,
      current: false,
      date: null,
    });
  for (let d = 1; d <= daysInMonth; d++)
    calCells.push({
      day: d,
      current: true,
      date: new Date(currentYear, currentMonth, d),
    });
  const remaining = calCells.length % 7 === 0 ? 0 : 7 - (calCells.length % 7);
  for (let i = 1; i <= remaining; i++)
    calCells.push({ day: i, current: false, date: null });

  const filtered = schedules
    .filter((s) => fmt(s.date) === fmt(selectedDate))
    .sort((a, b) => a.time.localeCompare(b.time));

  const inputClass = (err) =>
    `w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
      err
        ? "border-red-400 focus:ring-red-300"
        : "border-gray-200 focus:ring-blue-400 focus:border-blue-400"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h1 className="text-xl font-semibold text-gray-900">My Calendar</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            View and manage your daily meetings
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 w-full lg:w-96 flex-shrink-0 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={prevMonth}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 hover:border-gray-200 transition-colors text-xl font-light"
              >
                ‹
              </button>
              <span className="text-sm font-semibold text-gray-800 tracking-wide">
                {MONTHS[currentMonth]} {currentYear}
              </span>
              <button
                onClick={nextMonth}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 hover:border-gray-200 transition-colors text-xl font-light"
              >
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
                <div
                  key={i}
                  className="text-center text-[11px] font-semibold text-gray-300 py-1 tracking-wide"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calCells.map((cell, i) => {
                const isToday = cell.date && fmt(cell.date) === fmt(today);
                const isSelected =
                  cell.date && fmt(cell.date) === fmt(selectedDate);
                const hasMeeting =
                  cell.date && datesWithMeetings.has(fmt(cell.date));

                let cls =
                  "flex flex-col items-center justify-center rounded-xl text-sm select-none transition-all gap-1 h-11 ";
                if (!cell.current) cls += "text-gray-200 pointer-events-none";
                else if (isSelected)
                  cls +=
                    "bg-blue-600 text-white font-semibold cursor-pointer shadow-sm";
                else if (isToday)
                  cls +=
                    "text-blue-600 font-bold cursor-pointer hover:bg-blue-50 ring-1 ring-blue-200";
                else cls += "text-gray-600 cursor-pointer hover:bg-gray-100";

                return (
                  <div
                    key={i}
                    className={cls}
                    onClick={() => cell.date && setSelectedDate(cell.date)}
                  >
                    {cell.day}
                    {hasMeeting && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-blue-200" : "bg-blue-400"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-50 flex items-center gap-4 text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />{" "}
                Has meetings
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />{" "}
                Selected
              </span>
            </div>
          </div>
          <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-5 flex flex-col min-h-96 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <div>
                <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-0.5">
                  Schedule
                </p>
                <p className="text-base font-semibold text-gray-800">
                  {fmtDisplay(selectedDate)}
                </p>
              </div>
              <button
                onClick={openAdd}
                className="flex items-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-4 py-2 rounded-xl transition-all"
              >
                <span className="text-base leading-none font-light">+</span> Add
                Meeting
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3 text-xl">
                    📅
                  </div>
                  <p className="text-sm font-medium text-gray-400">
                    No meetings scheduled
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    Click "+ Add Meeting" to get started
                  </p>
                </div>
              ) : (
                filtered.map((s) => (
                  <div
                    key={s._id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-blue-500 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1 whitespace-nowrap">
                        {fmt12(s.time)}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {s.meeting}
                      </span>
                    </div>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(s)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(s._id);
                          setShowConfirm(true);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors text-xs font-bold"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md p-6 animate-in">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  {editId ? "Edit Meeting" : "New Meeting"}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {fmtDisplay(selectedDate)}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="border-t border-gray-100 mb-5" />

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Meeting Name <span className="text-red-400 font-normal">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Team standup, Client call…"
                value={meeting}
                onChange={(e) => {
                  setMeeting(e.target.value);
                  if (e.target.value.trim())
                    setErrors((prev) => ({ ...prev, meeting: "" }));
                }}
                onKeyDown={(e) => e.key === "Enter" && saveSchedule()}
                autoFocus
                className={inputClass(errors.meeting)}
              />
              {errors.meeting && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <svg
                    className="w-3 h-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.meeting}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Time <span className="text-red-400 font-normal">*</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  if (e.target.value)
                    setErrors((prev) => ({ ...prev, time: "" }));
                }}
                className={inputClass(errors.time)}
              />
              {errors.time && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <svg
                    className="w-3 h-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.time}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSchedule}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-colors shadow-sm"
              >
                {editId ? "Update Meeting" : "Save Meeting"}
              </button>
            </div>
          </div>
        </div>
      )}
      {toast.show && (
        <div className="fixed top-5 right-5 z-50 animate-slideIn">
          <div
            className={`px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center gap-2
        ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}
          >
            {toast.message}
          </div>
        </div>
      )}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-5 w-80">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Confirm Delete
            </h3>

            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete this meeting?
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 text-sm border rounded-lg text-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 py-2 text-sm bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
