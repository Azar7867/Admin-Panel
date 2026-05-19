import { useEffect, useState } from "react";

import axios from "axios";

import { BASE_URL } from "../api/api";

export default function UserPdfPage() {
  const [pdfs, setPdfs] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user"),
  );

  useEffect(() => {
    fetchUserPdfs();
  }, []);

  const fetchUserPdfs = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/pdf/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPdfs(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          My PDFs
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome{" "}
          <span className="font-semibold">
            {user?.name}
          </span>
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">
          Loading PDFs...
        </div>
      ) : pdfs.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-700">
            No PDFs Assigned
          </h2>

          <p className="text-gray-400 mt-3">
            Admin has not assigned any PDFs yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pdfs.map((pdf) => (
            <div
              key={pdf._id}
              className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
                  <span className="text-2xl">
                    📄
                  </span>
                </div>

                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                  PDF
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-3">
                {pdf.title}
              </h2>

              <p className="text-sm text-gray-400 mb-6">
                Assigned by Admin
              </p>

              <div className="flex gap-3">
                <a
                  href={pdf.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-black hover:bg-gray-800 text-white text-center py-3 rounded-xl font-semibold transition"
                >
                  Open PDF
                </a>

                <a
                  href={pdf.pdfUrl}
                  download
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-xl transition"
                >
                  ⬇
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}