// import { useEffect, useState } from "react";

// const LoginHours = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const loadData = () => {
//       const stored = JSON.parse(localStorage.getItem("loginHours")) || [];
//       setData(stored);
//     };

//     loadData();
//     window.addEventListener("loginHoursUpdated", loadData);

//     return () => {
//       window.removeEventListener("loginHoursUpdated", loadData);
//     };
//   }, []);

//   const formatTime = (sec) => {
//     const h = String(Math.floor(sec / 3600)).padStart(2, "0");
//     const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
//     const s = String(sec % 60).padStart(2, "0");
//     return `${h}:${m}:${s}`;
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Login Hours ⏱️</h1>
//           <p className="text-gray-500 text-sm">
//             Track your daily work sessions and activity
//           </p>
//         </div>

//         <button
//           onClick={() => {
//             localStorage.removeItem("loginHours");
//             setData([]);
//           }}
//           className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition shadow-sm"
//         >
//           Clear Records
//         </button>
//       </div>
//       <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-[850px] w-full text-sm">
//             <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
//               <tr>
//                 <th className="p-4 text-left">Id</th>
//                 <th className="p-4 text-left">Staff</th>
//                 <th className="p-4 text-left">Check In</th>
//                 <th className="p-4 text-left">Check Out</th>
//                 <th className="p-4 text-left">Logged</th>
//                 <th className="p-4 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item, i) => (
//                 <tr
//                   key={i}
//                   className="border-t border-gray-100 hover:bg-gray-50 transition"
//                 >
//                   <td className="p-4 text-gray-700 font-medium">#{9000 + i}</td>
//                   <td className="p-4 text-indigo-600 font-semibold">
//                     Mohamed Azardeen
//                   </td>
//                   <td className="p-4 text-gray-700">
//                     {item.start ? new Date(item.start).toLocaleString() : "--"}
//                   </td>
//                   <td className="p-4 font-medium">
//                     {item.end ? (
//                       <span className="text-red-500">
//                         {new Date(item.end).toLocaleTimeString()}
//                       </span>
//                     ) : (
//                       <span className="text-gray-400">--</span>
//                     )}
//                   </td>
//                   <td className="p-4">
//                     <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">
//                       {formatTime(item.duration || 0)}
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     <span
//                       className={`px-3 py-1 text-xs rounded-full font-medium ${
//                         item.status === "Active"
//                           ? "bg-green-100 text-green-600"
//                           : "bg-red-100 text-red-600"
//                       }`}
//                     >
//                       {item.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {data.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-4xl mb-2">📭</div>
//             <p className="text-gray-400 text-sm">No login records yet</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LoginHours;
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api/api";

const LoginHours = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH LOGIN HOURS
  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}/login-hours`
      );

      setData(response.data);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // LOAD DATA + LISTEN EVENT
  useEffect(() => {
    fetchData();

    window.addEventListener(
      "loginHoursUpdated",
      fetchData
    );

    return () => {
      window.removeEventListener(
        "loginHoursUpdated",
        fetchData
      );
    };
  }, []);

  // CLEAR RECORDS
  const clearRecords = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/login-hours/clear`
      );

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  // FORMAT TIME
  const formatTime = (sec) => {
    const h = String(
      Math.floor(sec / 3600)
    ).padStart(2, "0");

    const m = String(
      Math.floor((sec % 3600) / 60)
    ).padStart(2, "0");

    const s = String(sec % 60).padStart(2, "0");

    return `${h}:${m}:${s}`;
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Login Hours ⏱️
          </h1>

          <p className="text-gray-500 text-sm">
            Track your daily work sessions
          </p>
        </div>

        <button
          onClick={clearRecords}
          className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-lg shadow-sm text-sm"
        >
          Clear Records
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[850px] w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
              <tr>
                <th className="p-4 text-left">
                  Id
                </th>

                <th className="p-4 text-left">
                  Staff
                </th>

                <th className="p-4 text-left">
                  Check In
                </th>

                <th className="p-4 text-left">
                  Check Out
                </th>

                <th className="p-4 text-left">
                  Logged Time
                </th>

                <th className="p-4 text-left">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium text-gray-700">
                      #{9000 + index}
                    </td>

                    <td className="p-4 text-indigo-600 font-semibold">
                      {item.staff}
                    </td>

                    <td className="p-4 text-gray-700">
                      {item.start
                        ? new Date(
                            item.start
                          ).toLocaleString()
                        : "--"}
                    </td>

                    <td className="p-4">
                      {item.end ? (
                        <span className="text-red-500 font-medium">
                          {new Date(
                            item.end
                          ).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          --
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                        {formatTime(
                          item.duration || 0
                        )}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-14"
                  >
                    {loading ? (
                      <div>
                        <p className="text-gray-400 text-sm">
                          Loading...
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl mb-2">
                          📭
                        </div>

                        <p className="text-gray-400 text-sm">
                          No login records found
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoginHours;