import { useEffect, useState } from "react";
import { FaTrash, FaFilePdf, FaUpload, FaLink, FaDownload } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../api/api";

const COLORS = [
  "from-violet-500 to-purple-600",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-teal-400 to-emerald-500",
  "from-sky-400 to-blue-500",
];

/* ── Toast ── */
function Toast({ toasts, remove }) {
  const style = { success: "bg-emerald-500", error: "bg-rose-500", info: "bg-violet-500" };
  const icon  = { success: "✅", error: "❌", info: "ℹ️" };
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={`${style[t.type]} flex items-center gap-3 px-4 py-3 rounded-2xl text-white text-sm font-medium shadow-xl min-w-64`}>
          <span>{icon[t.type]}</span>
          <span className="flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)} className="opacity-70 hover:opacity-100 text-lg leading-none">×</button>
        </div>
      ))}
    </div>
  );
}

/* ── Delete Modal ── */
function DeleteModal({ title, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-2xl">🗑️</div>
        </div>
        <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Delete PDF?</h3>
        <p className="text-gray-500 text-sm text-center mb-6">
          <span className="font-semibold text-gray-700">"{title}"</span> will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold transition">Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── Visibility Toggle ── */
function VisibilityToggle({ enabled, onChange, loading }) {
  return (
    <button
      onClick={onChange}
      disabled={loading}
      title={enabled ? "Visible to users — click to hide" : "Hidden from users — click to show"}
      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none shrink-0
        ${enabled ? "bg-violet-500" : "bg-gray-200"}
        ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300
          ${enabled ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}

/* ── useToast ── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const remove = (id) => setToasts((p) => p.filter((t) => t.id !== id));
  const add = (message, type = "info") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => remove(id), 4000);
  };
  return { toasts, add, remove };
}

/* ── Main Component ── */
export default function UploadPdfPage() {
  const [users, setUsers]                 = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [pdfTitle, setPdfTitle]           = useState("");
  const [pdfFile, setPdfFile]             = useState(null);
  const [pdfs, setPdfs]                   = useState([]);
  const [loading, setLoading]             = useState(false);
  const [deleteTarget, setDeleteTarget]   = useState(null);
  // Track per-PDF toggle loading state: { [pdfId]: boolean }
  const [toggleLoading, setToggleLoading] = useState({});
  const { toasts, add, remove }           = useToast();

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  const fetchPdfs = () =>
    axios.get(`${BASE_URL}/pdf/admin`, { headers })
      .then((r) => setPdfs(r.data))
      .catch(() => add("Could not load PDFs", "error"));

  useEffect(() => {
    axios.get(`${BASE_URL}/auth/users`, { headers })
      .then((r) => setUsers(r.data.filter((u) => u.role !== "admin")))
      .catch(() => add("Could not load users", "error"));
    fetchPdfs();
  }, []);

  /* Upload */
  const handleUpload = async () => {
    if (!pdfTitle || !pdfFile) return add("Please fill all fields", "error");
    if (pdfFile.size > 5 * 1024 * 1024) return add("File exceeds 5MB limit.", "error");
    try {
      setLoading(true);
      const form = new FormData();
      form.append("title", pdfTitle);
      form.append("pdf", pdfFile);
      form.append("assignedUsers", JSON.stringify(selectedUsers));
      await axios.post(`${BASE_URL}/pdf/upload`, form, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      add("PDF uploaded successfully!", "success");
      setPdfTitle(""); setPdfFile(null); setSelectedUsers([]);
      fetchPdfs();
    } catch { add("Upload failed. Try again.", "error"); }
    finally   { setLoading(false); }
  };

  /* Delete */
  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/pdf/${deleteTarget.id}`, { headers });
      add("PDF deleted successfully", "success");
    } catch { add("Delete failed. Try again.", "error"); }
    setDeleteTarget(null); fetchPdfs();
  };

  /* Download — fetches the blob so the browser saves it as a file */
  const handleDownload = async (pdf) => {
    try {
      const response = await axios.get(pdf.pdfUrl, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${pdf.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      add("Download failed. Try again.", "error");
    }
  };

  /* Visibility toggle */
  const handleToggleVisibility = async (pdf) => {
    const newVisible = !pdf.isVisible;
    // Optimistic UI update
    setPdfs((prev) =>
      prev.map((p) => p._id === pdf._id ? { ...p, isVisible: newVisible } : p)
    );
    setToggleLoading((prev) => ({ ...prev, [pdf._id]: true }));
    try {
      await axios.patch(
        `${BASE_URL}/pdf/${pdf._id}/visibility`,
        { isVisible: newVisible },
        { headers }
      );
      add(`PDF ${newVisible ? "is now visible" : "hidden"} to users`, "success");
    } catch {
      // Revert on failure
      setPdfs((prev) =>
        prev.map((p) => p._id === pdf._id ? { ...p, isVisible: !newVisible } : p)
      );
      add("Could not update visibility. Try again.", "error");
    } finally {
      setToggleLoading((prev) => ({ ...prev, [pdf._id]: false }));
    }
  };

  const toggleUser = (id, checked) =>
    setSelectedUsers(checked ? [...selectedUsers, id] : selectedUsers.filter((u) => u !== id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Toast toasts={toasts} remove={remove} />
      {deleteTarget && (
        <DeleteModal
          title={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="max-w-5xl mx-auto px-5 py-8 md:px-10 md:py-10">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl p-7 text-white shadow-xl shadow-violet-200 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <h1 className="text-2xl font-extrabold leading-tight">📂 PDF Manager</h1>
              <p className="text-purple-200 text-sm mt-1">Upload, assign and manage documents</p>
            </div>
            <div className="flex gap-3">
              {[{ icon: "📄", val: pdfs.length, label: "PDFs" }, { icon: "👥", val: users.length, label: "Users" }].map((s) => (
                <div key={s.label} className="bg-white/20 rounded-2xl px-5 py-3 text-center min-w-[72px]">
                  <div className="text-xl font-bold">{s.icon} {s.val}</div>
                  <div className="text-xs text-purple-200 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* Upload Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-6">

            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-6">
              <span className="w-8 h-8 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center shrink-0">
                <FaUpload size={12} />
              </span>
              Upload New PDF
            </h2>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter document title…"
                value={pdfTitle}
                onChange={(e) => setPdfTitle(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-violet-400 transition"
              />
            </div>

            {/* File Drop */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                File
              </label>
              <label className="flex flex-col items-center justify-center gap-1.5 w-full border-2 border-dashed border-gray-200 hover:border-violet-400 hover:bg-violet-50 rounded-2xl py-6 cursor-pointer transition text-center">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) {
                      add("File exceeds 5MB limit. Please choose a smaller PDF.", "error");
                      e.target.value = "";
                      return;
                    }
                    setPdfFile(file);
                  }}
                />
                <FaFilePdf className="text-2xl text-gray-300" />
                {pdfFile ? (
                  <>
                    <span className="text-sm font-semibold text-violet-600 truncate max-w-[90%] px-2">{pdfFile.name}</span>
                    <span className="text-xs text-gray-400">{(pdfFile.size / (1024 * 1024)).toFixed(2)} MB · Click to change</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-medium text-gray-400">Click to choose a PDF</span>
                    <span className="text-xs text-gray-300">Max 5 MB · Only .pdf files</span>
                  </>
                )}
              </label>
            </div>

            {/* Assign Users */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Assign Users
                </label>
                {selectedUsers.length > 0 && (
                  <span className="text-xs text-violet-500 font-semibold">{selectedUsers.length} selected</span>
                )}
              </div>
              <div className="border-2 border-gray-100 rounded-2xl overflow-hidden">
                {users.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-5">No users available</p>
                ) : (
                  <div className="max-h-36 overflow-y-auto divide-y divide-gray-50">
                    {users.map((u) => (
                      <label key={u._id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50 cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(u._id)}
                          onChange={(e) => toggleUser(u._id, e.target.checked)}
                          className="accent-violet-500 shrink-0"
                        />
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-700">{u.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-60 text-white font-bold text-sm shadow-lg shadow-violet-200 transition flex items-center justify-center gap-2"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Uploading…</>
                : <><FaUpload size={12} />Upload PDF</>
              }
            </button>
          </div>

          {/* PDF Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-5">
              <h2 className="text-base font-bold text-gray-800">Uploaded PDFs</h2>
              {pdfs.length > 0 && (
                <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-xs font-bold flex items-center justify-center">
                  {pdfs.length}
                </span>
              )}
            </div>

            {pdfs.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 py-16 flex flex-col items-center justify-center gap-2">
                <span className="text-5xl">📭</span>
                <p className="font-semibold text-gray-400 text-sm">No PDFs uploaded yet</p>
                <p className="text-xs text-gray-300">Upload your first document using the form</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pdfs.map((pdf, i) => (
                  <div
                    key={pdf._id}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col gap-3"
                  >
                    {/* Card Top Row */}
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center text-white shadow-sm shrink-0`}>
                        <FaFilePdf size={14} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${COLORS[i % COLORS.length]}`}>
                          PDF
                        </span>
                        <button
                          onClick={() => setDeleteTarget({ id: pdf._id, title: pdf.title })}
                          className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-400 flex items-center justify-center transition shrink-0"
                        >
                          <FaTrash size={11} />
                        </button>
                      </div>
                    </div>

                    {/* Title + Action Links */}
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2">{pdf.title}</h3>
                      <div className="flex items-center gap-3">
                        {/* Open link */}
                        <a
                          href={pdf.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-violet-500 hover:text-violet-700 font-semibold text-xs transition"
                        >
                          <FaLink size={9} /> Open
                        </a>

                        {/* Download button — NEW */}
                        <button
                          onClick={() => handleDownload(pdf)}
                          className="inline-flex items-center gap-1.5 text-emerald-500 hover:text-emerald-700 font-semibold text-xs transition cursor-pointer"
                        >
                          <FaDownload size={9} /> Download
                        </button>
                      </div>
                    </div>

                    {/* Visibility Toggle — NEW */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Visible to Users
                        </span>
                        <span className={`text-xs font-semibold mt-0.5 ${pdf.isVisible ? "text-violet-500" : "text-gray-400"}`}>
                          {pdf.isVisible ? "Enabled — users can see this" : "Disabled — hidden from users"}
                        </span>
                      </div>
                      <VisibilityToggle
                        enabled={!!pdf.isVisible}
                        onChange={() => handleToggleVisibility(pdf)}
                        loading={!!toggleLoading[pdf._id]}
                      />
                    </div>

                    {/* Assigned Users */}
                    {pdf.assignedUsers?.length > 0 && (
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Assigned to</p>
                        <div className="flex flex-wrap gap-1.5">
                          {pdf.assignedUsers.map((u) => (
                            <span key={u._id} className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                              <span className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                                {u.name?.[0]?.toUpperCase()}
                              </span>
                              {u.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}