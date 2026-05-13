import { useEffect, useState } from "react";

const LoginHours = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = () => {
      const stored = JSON.parse(localStorage.getItem("loginHours")) || [];
      setData(stored);
    };

    loadData();
    window.addEventListener("loginHoursUpdated", loadData);

    return () => {
      window.removeEventListener("loginHoursUpdated", loadData);
    };
  }, []);

  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Login Hours ⏱️</h1>
          <p className="text-gray-500 text-sm">
            Track your daily work sessions and activity
          </p>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("loginHours");
            setData([]);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition shadow-sm"
        >
          Clear Records
        </button>
      </div>
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[850px] w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="p-4 text-left">Id</th>
                <th className="p-4 text-left">Staff</th>
                <th className="p-4 text-left">Check In</th>
                <th className="p-4 text-left">Check Out</th>
                <th className="p-4 text-left">Logged</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-4 text-gray-700 font-medium">#{9000 + i}</td>
                  <td className="p-4 text-indigo-600 font-semibold">
                    Mohamed Azardeen
                  </td>
                  <td className="p-4 text-gray-700">
                    {item.start ? new Date(item.start).toLocaleString() : "--"}
                  </td>
                  <td className="p-4 font-medium">
                    {item.end ? (
                      <span className="text-red-500">
                        {new Date(item.end).toLocaleTimeString()}
                      </span>
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">
                      {formatTime(item.duration || 0)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-gray-400 text-sm">No login records yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginHours;
