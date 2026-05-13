import { useEffect, useState } from "react";
import { BASE_URL } from "../api/api";
export default function DetailsPage() {
  const [percentages, setPercentages] = useState([]);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedPercentage, setSelectedPercentage] = useState("");
  const [amount, setAmount] = useState("");
  const [form, setForm] = useState({ name: "", product: "", place: "" });

  useEffect(() => {
    fetch(`${BASE_URL}/percentage`)
      .then((res) => res.json())
      .then(setPercentages);
  }, []);

  const fetchDetails = async () => {
    const res = await fetch(`${BASE_URL}/details`);
    setData(await res.json());
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddData = async () => {
    await fetch(`${BASE_URL}/details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowModal(false);
    setForm({ name: "", product: "", place: "" });
    fetchDetails();
  };

  const handleCheckbox = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const applyDiscount = async () => {
    if (!selectedPercentage || !amount) return;

    for (let id of selectedRows) {
      const discount = (amount * selectedPercentage) / 100;
      const final = amount - discount;

      console.log("Sending:", {
        originalPrice: amount,
        percentage: selectedPercentage,
        discountPrice: final,
      });

      await fetch(`${BASE_URL}/details/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalPrice: Number(amount),
          percentage: Number(selectedPercentage),
          discountPrice: final,
        }),
      });
    }

    fetchDetails();
  };

  const avatarColors = [
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-pink-100 text-pink-700",
    "bg-amber-100 text-amber-700",
    "bg-teal-100 text-teal-700",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Details</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage customer details and apply discounts
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Apply Discount
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition bg-white"
              value={selectedPercentage}
              onChange={(e) => setSelectedPercentage(e.target.value)}
            >
              <option value="">Select %</option>
              {percentages.map((p) => (
                <option key={p._id} value={p.value}>
                  {p.value}%
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition w-36"
            />

            {selectedPercentage && amount && (
              <div className="text-xs text-gray-500 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg">
                Final:{" "}
                <span className="font-semibold text-emerald-700">
                  {(amount - (amount * selectedPercentage) / 100).toFixed(2)}
                </span>
                <span className="ml-1 text-gray-400">
                  ({selectedPercentage}% off)
                </span>
              </div>
            )}

            <button
              onClick={applyDiscount}
              disabled={
                !selectedPercentage || !amount || selectedRows.length === 0
              }
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition"
            >
              Apply to{" "}
              {selectedRows.length > 0
                ? `${selectedRows.length} row${selectedRows.length > 1 ? "s" : ""}`
                : "selected"}
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="ml-auto px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition"
            >
              + Add Details
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              All Records
            </span>
            <div className="flex items-center gap-2">
              {selectedRows.length > 0 && (
                <span className="text-xs text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full font-medium">
                  {selectedRows.length} selected
                </span>
              )}
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                {data.length} records
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {data.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                <div className="text-3xl mb-2 opacity-30">📋</div>
                No records yet. Click{" "}
                <span className="font-semibold text-violet-500">
                  Add Details
                </span>{" "}
                to get started.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left w-10">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-violet-600 focus:ring-violet-200"
                        onChange={(e) =>
                          setSelectedRows(
                            e.target.checked ? data.map((d) => d._id) : [],
                          )
                        }
                        checked={
                          selectedRows.length === data.length && data.length > 0
                        }
                      />
                    </th>
                    {[
                      "Name",
                      "Product",
                      "Place",
                      "Original Price",
                      "Discount %",
                      "Final Price",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, i) => (
                    <tr
                      key={item._id}
                      onClick={() => handleCheckbox(item._id)}
                      className={`border-b border-gray-50 last:border-0 cursor-pointer transition
                        ${selectedRows.includes(item._id) ? "bg-violet-50" : "hover:bg-gray-50"}`}
                    >
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item._id)}
                          onChange={() => handleCheckbox(item._id)}
                          className="rounded border-gray-300 text-violet-600 focus:ring-violet-200"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${avatarColors[i % avatarColors.length]}`}
                          >
                            {item.name
                              ?.split(" ")
                              .map((w) => w[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase() || "?"}
                          </div>
                          <span className="font-medium text-gray-800">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.product}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{item.place}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.originalPrice != null
                          ? `$${item.originalPrice}`
                          : "-"}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {item.percentage != null ? `${item.percentage}%` : "-"}
                      </td>

                      <td className="px-4 py-3">
                        {item.discountPrice != null ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            ${Number(item.discountPrice).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-base">
                Add Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              {[
                { name: "name", placeholder: "Full name", label: "Name" },
                {
                  name: "product",
                  placeholder: "Product name",
                  label: "Product",
                },
                { name: "place", placeholder: "City / place", label: "Place" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    value={form[field.name]}
                    placeholder={field.placeholder}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2 justify-end px-5 pb-5 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddData}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
