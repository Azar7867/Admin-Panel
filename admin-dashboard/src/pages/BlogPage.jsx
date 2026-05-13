import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../api/api";
export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const [showBlog, setShowBlog] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [rate, setRate] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [subscribers, setSubscribers] = useState([]);
  const [showUnsub, setShowUnsub] = useState(false);
  const [unsubEmail, setUnsubEmail] = useState("");
  const fetchSubscribers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/subscribers`);
      setSubscribers(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchBlogs();
    fetchSubscribers(); 
  }, []);

  const handleUnsubscribe = async () => {
    const cleanEmail = unsubEmail.trim().toLowerCase();

    if (!cleanEmail) {
      showToast("Enter email ❌", "error");
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/subscribers`);

      const user = res.data.find(
        (s) => s.email.trim().toLowerCase() === cleanEmail,
      );

      if (!user) {
        showToast("Email not found ❌", "error");
        return;
      }

      await axios.delete(`${BASE_URL}/subscribers/${user._id}`);

      showToast("Unsubscribed successfully 🗑️");

      setShowUnsub(false);
      setUnsubEmail("");

      fetchSubscribers(); 
    } catch (err) {
      console.log(err);
      showToast("Unsubscribe failed ❌", "error");
    }
  };
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/blog`);
      setBlogs(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  const subscribe = async () => {
    if (!email) {
      showToast("Email is required", "error");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/subscribe`, { email });
      showToast("Subscribed successfully");
      setTimeout(() => {
        setEmail("");
        setShowSub(false);
      }, 500);
    } catch {
      showToast("Already subscribed or error occurred", "error");
    }
  };

  const handleImage = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const err = {};
    if (!name) err.name = true;
    if (!rate) err.rate = true;
    if (!description) err.description = true;
    if (!image) err.image = true;
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const addBlog = async () => {
    if (!validate()) return;
    try {
      const formData = new FormData();
      const descArray = description.split("\n").filter((d) => d.trim() !== "");
      formData.append("name", name);
      formData.append("rate", rate);
      formData.append("image", image);
      descArray.forEach((d) => formData.append("description", d));
      await axios.post(`${BASE_URL}/blog`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showToast("Blog published successfully");
      setTimeout(() => {
        setShowBlog(false);
        setName("");
        setRate("");
        setDescription("");
        setImage(null);
        setPreview("");
        setErrors({});
      }, 500);
      fetchBlogs();
    } catch {
      showToast("Failed to publish blog", "error");
    }
  };

  const closeAddBlog = () => {
    setShowBlog(false);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center border-b border-gray-100">
        <h1 className="text-lg font-semibold">Blog</h1>
        <div className="grid grid-cols-2 sm:flex gap-3 w-full lg:w-auto">
          <button
            onClick={() => setShowSub(true)}
            className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Subscribe
          </button>
          <button
            onClick={() => setShowUnsub(true)}
            className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Unsubscribe
          </button>
          <button
            onClick={() => (window.location.href = "/subscribers")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Subscribers
          </button>
          <button
            onClick={() => setShowBlog(true)}
            className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
          >
            + Add Blog
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {blogs.length === 0 && (
          <p className="text-gray-400 text-sm col-span-3 py-16">
            No blogs yet. Add one!
          </p>
        )}
        {blogs.map((b) => (
          <div
            key={b._id}
            className="border border-gray-400 rounded-xl overflow-hidden bg-green-100 shadow-sm"
          >
            <div className="bg-green-100 h-36 flex items-center justify-center">
              <img src={b.image} alt={b.name} className="h-20 object-contain" />
            </div>
            <div className="p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-1">
                {b.name}
              </h2>
              <p className="text-2xl font-bold text-gray-900 mb-4">₹{b.rate}</p>
              <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                Promote
              </button>
              <ul className="space-y-2">
                {(Array.isArray(b.description)
                  ? b.description
                  : [b.description]
                ).map((p, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-500"
                  >
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {showSub && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setShowSub(false)}
        >
          <div
            className="bg-white rounded-xl p-7 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold mb-1">Subscribe</h3>
            <p className="text-sm text-gray-400 mb-5">
              Get updates directly in your inbox.
            </p>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowSub(false)}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={subscribe}
                className="flex-1 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      )}

      {showBlog && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={closeAddBlog}
        >
          <div
            className="bg-white rounded-xl p-7 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold mb-1">Add Blog</h3>
            <p className="text-sm text-gray-400 mb-5">
              Fill in the details to publish.
            </p>

            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Title
            </label>
            <input
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition ${errors.name ? "border-red-300" : "border-gray-200"}`}
              placeholder="Blog title"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">Required</p>
            )}

            <label className="block text-xs font-medium text-gray-500 mt-4 mb-1.5">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-500 cursor-pointer transition ${errors.image ? "border-red-300" : "border-gray-200"}`}
              onChange={(e) => handleImage(e.target.files[0])}
            />
            {errors.image && (
              <p className="text-xs text-red-400 mt-1">Required</p>
            )}
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-full h-24 object-contain rounded-lg bg-gray-50 mt-2"
              />
            )}

            <label className="block text-xs font-medium text-gray-500 mt-4 mb-1.5">
              Price (₹)
            </label>
            <input
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition ${errors.rate ? "border-red-300" : "border-gray-200"}`}
              placeholder="e.g. 999"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
            {errors.rate && (
              <p className="text-xs text-red-400 mt-1">Required</p>
            )}

            <label className="block text-xs font-medium text-gray-500 mt-4 mb-1.5">
              Features{" "}
              <span className="text-gray-300 font-normal">(one per line)</span>
            </label>
            <textarea
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition resize-y min-h-[88px] ${errors.description ? "border-red-300" : "border-gray-200"}`}
              placeholder={"Unlimited access\nWeekly digest\nPriority support"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <p className="text-xs text-red-400 mt-1">Required</p>
            )}

            <div className="flex gap-3 mt-5">
              <button
                onClick={closeAddBlog}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={addBlog}
                className="flex-1 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-[9999] flex items-center gap-2.5 bg-white border rounded-xl px-4 py-3 shadow-md text-sm ${toast.type === "error" ? "border-red-200" : "border-green-200"}`}
        >
          <span
            className={`font-semibold ${toast.type === "error" ? "text-red-400" : "text-green-500"}`}
          >
            {toast.type === "error" ? "✕" : "✓"}
          </span>
          <span className="text-gray-700">{toast.message}</span>
        </div>
      )}
      {showUnsub && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80">
            <h3 className="text-sm font-semibold mb-3">Unsubscribe</h3>

            <input
              type="email"
              placeholder="Enter email"
              value={unsubEmail}
              onChange={(e) => setUnsubEmail(e.target.value)}
              className="w-full border p-2 rounded-lg mb-4 text-sm"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowUnsub(false)}
                className="flex-1 py-2 border rounded-lg text-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={handleUnsubscribe}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg"
              >
                UnSubscribe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
