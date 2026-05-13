import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api/api";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineTrash, HiOutlineExclamation } from "react-icons/hi";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/invoices`);
      setInvoices(res.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed To Fetch Invoices");
    }
  };

  const openDeletePopup = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/invoices/${deleteId}`);
      setInvoices((prev) => prev.filter((item) => item._id !== deleteId));
      toast.success("Invoice Deleted Successfully");
      setShowConfirm(false);
      setDeleteId(null);
    } catch (error) {
      console.log(error);
      toast.error("Failed To Delete Invoice");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <Toaster position="top-right" />
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-8 shadow-xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5 text-red-500">
              <HiOutlineExclamation size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Delete Invoice?
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-3 mt-7">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">All Invoices</h1>
          <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full">
            {invoices.length}
          </span>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          Manage and review all your billing records.
        </p>
      </div>
      {invoices.length === 0 && (
        <div className="max-w-6xl mx-auto text-center py-24">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-2xl">
            📄
          </div>
          <p className="text-gray-500 font-semibold">No invoices found</p>
          <p className="text-gray-400 text-sm mt-1">
            Create your first invoice to see it here.
          </p>
        </div>
      )}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {invoices.map((item) => (
          <InvoiceCard key={item._id} item={item} onDelete={openDeletePopup} />
        ))}
      </div>
    </div>
  );
}

function InvoiceCard({ item, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const SKIP = new Set([
    "company",
    "invoiceNo",
    "customerName",
    "email",
    "date",
  ]);
  const extraEntries = Object.entries(item?.invoiceData || {}).filter(
    ([k]) => !SKIP.has(k),
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-pink-400 to-violet-400" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="text-base font-bold text-gray-800 leading-snug">
            {item?.invoiceData?.company || "—"}
          </h2>
          <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-lg whitespace-nowrap flex-shrink-0">
            {item?.invoiceData?.invoiceNo || "—"}
          </span>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 font-medium">Customer</span>
            <span className="text-gray-700 font-semibold">
              {item?.invoiceData?.customerName || "—"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 font-medium">Email</span>
            <span className="text-gray-700 truncate max-w-[180px]">
              {item?.invoiceData?.email || "—"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 font-medium">Date</span>
            <span className="text-gray-700">
              {item?.invoiceData?.date || "—"}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between bg-gray-900 rounded-xl px-4 py-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Total Due
          </span>
          <span className="text-white font-bold text-base">
            ₹ {Number(item?.total || 0).toLocaleString()}
          </span>
        </div>
      </div>
      {extraEntries.length > 0 && (
        <>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3 border-t border-gray-100 text-xs font-semibold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <span>
              {expanded
                ? "Hide Details"
                : `View Details (${extraEntries.length})`}
            </span>
            <svg
              className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M3 5l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {expanded && (
            <div className="px-5 pb-3 border-t border-gray-100 max-h-48 overflow-y-auto divide-y divide-gray-50">
              {extraEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-baseline gap-3 py-2 text-sm"
                >
                  <span className="text-gray-400 font-medium capitalize whitespace-nowrap">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="text-gray-700 text-right break-all">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <button
        onClick={() => onDelete(item._id)}
        className="w-full flex items-center justify-center gap-2 py-3 border-t border-gray-100 text-sm font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
      >
        <HiOutlineTrash size={15} />
        Delete Invoice
      </button>
    </div>
  );
}
