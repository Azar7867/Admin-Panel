import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api/api";
const UserDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("EMPLOYEE DATA:", res.data);

      setEmployees(res.data.data || res.data.employees || res.data);
    } catch (err) {
      // console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : employees.length === 0 ? (
        <p>No Employee Data</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <div key={emp._id} className="bg-white shadow rounded-2xl p-5">
              <div className="mb-4">
                <h2 className="text-xl font-bold">{emp.name}</h2>

                <p className="text-gray-500">Employee Details</p>
              </div>

              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Department:</span>{" "}
                  {emp.fullAccess ? emp.department : "Restricted"}
                </p>

                <p>
                  <span className="font-semibold">Salary:</span>{" "}
                  {emp.fullAccess ? `₹${emp.salary}` : "Restricted"}
                </p>
              </div>

              <div className="mt-4">
                {emp.fullAccess ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Full Access
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                    Limited Access
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
