import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api/api";
export default function SubscriberPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };
  const fetchSubscribers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/subscribers`);
      setSubscribers(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    const result = subscribers.filter((s) =>
      s.email.toLowerCase().includes(search.toLowerCase()),
    );
    setFiltered(result);
  }, [search, subscribers]);

  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/subscribers/${deleteId}`);

      fetchSubscribers();
      showToast("Subscriber deleted successfully 🗑️");
    } catch (err) {
      showToast("Delete failed ❌", "error");
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };
  const deleteSubscriber = async (id) => {
    if (!window.confirm("Delete this subscriber?")) return;

    try {
      await axios.delete(`${BASE_URL}/subscribers/${id}`);
      fetchSubscribers();

      showToast("Subscriber deleted successfully 🗑️");
    } catch (err) {
      console.log(err);
      showToast("Delete failed ❌", "error");
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Subscribers
        </h1>
        <p className="text-sm text-gray-400">
          Manage everyone who subscribed to your blog.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-4 bg-violet-50 border border-violet-100 rounded-xl px-5 py-4 min-w-max">
            <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white text-base">
              📩
            </div>
            <div>
              <p className="text-xs text-violet-400 font-medium">
                Total Subscribers
              </p>
              <p className="text-2xl font-bold text-violet-700">
                {subscribers.length}
              </p>
            </div>
          </div>

          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4">
            <span className="text-gray-300 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by email..."
              className="flex-1 bg-transparent py-3.5 text-sm text-gray-700 outline-none placeholder-gray-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-gray-300 hover:text-gray-500 text-xs transition"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide w-12">
                  #
                </th>
                <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Email
                </th>
                <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((sub, index) => (
                  <tr
                    key={sub._id}
                    className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm text-gray-300 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {sub.email[0].toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-700 font-medium">
                          {sub.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setDeleteId(sub._id);
                          setShowConfirm(true);
                        }}
                        className="text-xs font-medium text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-16 text-sm text-gray-300"
                  >
                    No subscribers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {toast.show && (
        <div className="fixed top-5 right-5 z-[9999]">
          <div
            className={`px-4 py-2 rounded-lg shadow border flex items-center gap-2 bg-white
        ${
          toast.type === "error"
            ? "border-red-300 text-red-500"
            : "border-green-300 text-green-600"
        }
      `}
          >
            <span>{toast.type === "error" ? "❌" : "✅"}</span>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Confirm Delete
            </h3>

            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to delete this subscriber?
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 border rounded-lg text-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg"
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
