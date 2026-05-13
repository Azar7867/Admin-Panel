import { useEffect, useState } from "react";
import { BASE_URL } from "../api/api";

export default function PercentagePage() {
  const [percentages, setPercentages] = useState([]);
  const [value, setValue] = useState("");

  const fetchData = async () => {
    const res = await fetch(`${BASE_URL}/percentage`);
    const data = await res.json();
    setPercentages(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!value) return;

    await fetch(`${BASE_URL}/percentage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: Number(value),
      }),
    });

    setValue("");
    fetchData();
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${BASE_URL}/percentage/${id}`, {
        method: "DELETE",
      });

      setPercentages((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Percentage Management
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Add and manage discount percentages
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            New Percentage
          </label>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="e.g. 10"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition pr-8"
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                %
              </span>
            </div>

            <button
              onClick={handleAdd}
              className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition whitespace-nowrap"
            >
              Add
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              All Percentages
            </span>

            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
              {percentages.length} total
            </span>
          </div>

          {percentages.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              <div className="text-3xl mb-2 opacity-30">%</div>
              No percentages yet. Add one above.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {percentages.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                      <span className="text-violet-600 text-xs font-bold">
                        {p.value}
                      </span>
                    </div>

                    <span className="text-sm font-medium text-gray-800">
                      {p.value}% discount
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition font-medium"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
