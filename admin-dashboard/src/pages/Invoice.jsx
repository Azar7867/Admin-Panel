import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api/api";
import {
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  IndianRupee,
  Plus,
  X,
  Pencil,
  Check,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
const REQUIRED_FIELDS = [
  "invoiceNo",
  "company",
  "customerName",
  "email",
  "phone",
  "date",
  "address",
  "service",
  "amount",
];

const DEFAULT_FIELDS = [
  {
    id: "invoiceNo",
    label: "Invoice No",
    name: "invoiceNo",
    type: "text",
    system: true,
  },
  {
    id: "company",
    label: "Company Name",
    name: "company",
    type: "text",
    system: true,
  },
  {
    id: "customerName",
    label: "Customer Name",
    name: "customerName",
    type: "text",
    system: true,
  },
  { id: "email", label: "Email", name: "email", type: "email", system: true },
  { id: "phone", label: "Phone", name: "phone", type: "text", system: true },
  { id: "date", label: "Date", name: "date", type: "date", system: true },
  {
    id: "address",
    label: "Address",
    name: "address",
    type: "text",
    system: true,
    fullWidth: true,
  },
  {
    id: "service",
    label: "Service Description",
    name: "service",
    type: "text",
    system: true,
    fullWidth: true,
  },
  {
    id: "amount",
    label: "Amount (₹)",
    name: "amount",
    type: "number",
    system: true,
  },
  { id: "tax", label: "Tax (%)", name: "tax", type: "number", system: true },
  {
    id: "notes",
    label: "Notes",
    name: "notes",
    type: "textarea",
    system: true,
    fullWidth: true,
  },
];

const EMPTY_INVOICE = {
  invoiceNo: "",
  company: "",
  customerName: "",
  email: "",
  phone: "",
  address: "",
  service: "",
  amount: "",
  tax: "",
  date: "",
  notes: "",
};

const TYPE_OPTIONS = [
  { value: "text", label: "Text", hint: "Any characters" },
  { value: "number", label: "Number", hint: "Numeric only" },
  { value: "email", label: "Email", hint: "Email format" },
  { value: "date", label: "Date", hint: "Date picker" },
  { value: "textarea", label: "Long Text", hint: "Multi-line text" },
];

export default function PremiumInvoicePreview() {
  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const [invoice, setInvoice] = useState({ ...EMPTY_INVOICE });
  const [errors, setErrors] = useState({});

  const [editingLabel, setEditingLabel] = useState(null);
  const [labelDraft, setLabelDraft] = useState("");

  const [popup, setPopup] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState("text");
  const [newFull, setNewFull] = useState(false);
  const [popErr, setPopErr] = useState("");
  const subtotal = Number(invoice.amount || 0);
  const taxAmount = (subtotal * Number(invoice.tax || 0)) / 100;
  const total = subtotal + taxAmount;
  const validate = () => {
    const newErrors = {};
    fields.forEach((f) => {
      const isRequired = REQUIRED_FIELDS.includes(f.name) || !f.system;
      const value = invoice[f.name] ?? "";
      if (isRequired && !String(value).trim()) {
        newErrors[f.name] = `${f.label} is required`;
      }
    });
    if (invoice.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invoice.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (invoice.phone && invoice.phone.length < 10) {
      newErrors.phone = "Phone must be 10 digits";
    }
    return newErrors;
  };

  const saveInvoice = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in all required fields");
      return;
    }
    setErrors({});
    try {
      const payload = {
        fields,
        invoiceData: invoice,
        subtotal,
        taxAmount,
        total,
      };
      const res = await axios.post(`${BASE_URL}/invoices`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("SUCCESS:", res.data);
      toast.success("Invoice Saved Successfully 🎉");
      const emptyBase = { ...EMPTY_INVOICE };
      fields.forEach((f) => {
        if (!f.system) emptyBase[f.name] = "";
      });
      setInvoice(emptyBase);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed To Save Invoice");
    }
  };

  const handleChange = (e, fieldType) => {
    let value = e.target.value;
    if (e.target.name === "invoiceNo")
      value = value.replace(/[^a-zA-Z0-9\-_/]/g, "");
    else if (e.target.name === "phone")
      value = value.replace(/[^0-9]/g, "").slice(0, 10);
    else if (fieldType === "text" || fieldType === "textarea")
      value = value.replace(/[^a-zA-Z0-9\s.,\-_/]/g, "");
    else if (fieldType === "number") value = value.replace(/[^0-9.]/g, "");
    else if (fieldType === "email") value = value.replace(/\s/g, "");
    setInvoice((prev) => ({ ...prev, [e.target.name]: value }));
    if (errors[e.target.name])
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const startEditLabel = (f) => {
    setEditingLabel(f.id);
    setLabelDraft(f.label);
  };
  const saveLabel = (id) => {
    if (!labelDraft.trim()) return;
    setFields((fs) =>
      fs.map((f) => (f.id === id ? { ...f, label: labelDraft.trim() } : f)),
    );
    setEditingLabel(null);
  };

  const removeField = (id) => {
    setFields((fs) => fs.filter((f) => f.id !== id));
    setInvoice((inv) => {
      const n = { ...inv };
      delete n[id];
      return n;
    });
  };

  const openPopup = () => {
    setNewLabel("");
    setNewType("text");
    setNewFull(false);
    setPopErr("");
    setPopup(true);
  };
  const closePopup = () => setPopup(false);
  const addField = () => {
    if (!newLabel.trim()) {
      setPopErr("Field name is required.");
      return;
    }
    const id = "custom_" + Date.now();
    setFields((fs) => [
      ...fs,
      {
        id,
        label: newLabel.trim(),
        name: id,
        type: newType,
        system: false,
        fullWidth: newFull,
      },
    ]);
    setInvoice((inv) => ({ ...inv, [id]: "" }));
    closePopup();
  };

  const customFields = fields.filter((f) => !f.system && invoice[f.name]);

  const inputCls = (name) =>
    `w-full bg-stone-50 border rounded-xl px-3.5 py-2.5 text-sm font-[DM_Sans,sans-serif] text-gray-900 outline-none transition-all duration-150 focus:bg-white focus:ring-2 focus:ring-orange-400/30 ${
      errors[name]
        ? "border-red-400 bg-red-50"
        : "border-stone-200 focus:border-orange-400"
    }`;

  return (
    <>
      <Toaster position="top-right" />
      {popup && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={(e) => e.target === e.currentTarget && closePopup()}
        >
          <div className="bg-white rounded-3xl p-9 w-full max-w-md shadow-2xl animate-[popIn_0.2s_ease]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3
                  className="text-2xl font-black text-gray-900 leading-none"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Add Custom Field
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Appears in both form & invoice preview.
                </p>
              </div>
              <button
                onClick={closePopup}
                className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:bg-stone-200 transition-colors border-0 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="mb-5">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-2">
                Field Name
              </label>
              <input
                autoFocus
                value={newLabel}
                onChange={(e) => {
                  setNewLabel(e.target.value);
                  setPopErr("");
                }}
                onKeyDown={(e) => e.key === "Enter" && addField()}
                placeholder="e.g. Project ID, GST No…"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
              />
              {popErr && (
                <p className="text-red-500 text-xs mt-1.5 font-semibold">
                  {popErr}
                </p>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-3">
                Field Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setNewType(opt.value)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      newType === opt.value
                        ? "bg-orange-50 border-orange-400 text-orange-700"
                        : "bg-stone-50 border-stone-200 text-stone-500 hover:border-stone-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-stone-400 mt-2">
                {TYPE_OPTIONS.find((o) => o.value === newType)?.hint}
              </p>
            </div>

            <div className="mb-7 flex items-center gap-3">
              <button
                onClick={() => setNewFull((v) => !v)}
                className={`w-11 h-6 rounded-full transition-colors duration-200 border-0 cursor-pointer flex items-center px-0.5 ${newFull ? "bg-orange-500" : "bg-stone-200"}`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${newFull ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
              <span className="text-sm font-semibold text-stone-500">
                Full-width field
              </span>
            </div>

            <button
              onClick={addField}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-2xl py-3.5 font-bold text-sm border-0 cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={17} /> Add Field
            </button>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-stone-100 px-6 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
            <div className="mb-7 flex justify-between items-start">
              <div>
                <h2
                  className="text-3xl font-black text-gray-900 leading-none mb-1.5"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Invoice Form
                </h2>
                <p className="text-xs text-stone-400">
                  Click ✏️ to rename any label. Fields marked * are required.
                </p>
              </div>
              <button
                onClick={openPopup}
                className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl border-0 cursor-pointer transition-colors shadow-md shadow-orange-200 shrink-0"
              >
                <Plus size={14} /> Add Field
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {fields.map((f) => {
                const isRequired =
                  REQUIRED_FIELDS.includes(f.name) || !f.system;
                return (
                  <div key={f.id} className={f.fullWidth ? "col-span-2" : ""}>
                    <div className="flex items-center gap-1 mb-1.5">
                      {editingLabel === f.id ? (
                        <>
                          <input
                            autoFocus
                            value={labelDraft}
                            onChange={(e) => setLabelDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveLabel(f.id);
                              if (e.key === "Escape") setEditingLabel(null);
                            }}
                            className="bg-orange-50 border border-orange-400 rounded-lg px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gray-900 outline-none w-36"
                          />
                          <button
                            onClick={() => saveLabel(f.id)}
                            className="p-1 rounded-md hover:bg-stone-100 text-orange-500 border-0 cursor-pointer bg-transparent"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            onClick={() => setEditingLabel(null)}
                            className="p-1 rounded-md hover:bg-stone-100 text-stone-400 border-0 cursor-pointer bg-transparent"
                          >
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
                            {f.label}
                            {isRequired && (
                              <span className="text-red-400 ml-0.5">*</span>
                            )}
                          </span>
                          <button
                            onClick={() => startEditLabel(f)}
                            className="p-0.5 rounded-md hover:bg-stone-100 text-stone-300 hover:text-orange-400 border-0 cursor-pointer bg-transparent"
                          >
                            <Pencil size={10} />
                          </button>
                          {!f.system && (
                            <button
                              onClick={() => removeField(f.id)}
                              className="p-0.5 rounded-md hover:bg-stone-100 text-stone-300 hover:text-red-400 ml-auto border-0 cursor-pointer bg-transparent"
                            >
                              <X size={11} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    {f.type === "textarea" ? (
                      <textarea
                        name={f.name}
                        value={invoice[f.name] ?? ""}
                        onChange={(e) => handleChange(e, f.type)}
                        rows={3}
                        className={`${inputCls(f.name)} resize-none`}
                      />
                    ) : (
                      <input
                        type={f.type}
                        name={f.name}
                        value={invoice[f.name] ?? ""}
                        onChange={(e) => handleChange(e, f.type)}
                        className={inputCls(f.name)}
                      />
                    )}
                    {errors[f.name] && (
                      <p className="text-red-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
                        <span>⚠</span> {errors[f.name]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-7 bg-gray-900 rounded-2xl px-6 py-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="text-xs text-white/50 mb-0.5">
                  Final Invoice Amount
                </p>
                <p
                  className="text-2xl font-black text-white flex items-center gap-1"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  <IndianRupee size={18} />
                  {total.toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={saveInvoice}
              className="w-full mt-5 bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white font-bold py-4 rounded-2xl transition-all shadow-lg border-0 cursor-pointer text-sm"
            >
              Save Invoice
            </button>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl lg:sticky lg:top-10">
            <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-violet-600 px-9 py-9 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10" />
              <div className="absolute -bottom-16 left-1/4 w-60 h-60 rounded-full bg-white/5" />
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p
                    className="text-5xl font-black tracking-tighter leading-none"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    INVOICE
                  </p>
                  <p className="text-xs opacity-70 mt-1.5">
                    Professional Billing Document
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FileText size={28} />
                </div>
              </div>
            </div>
            <div className="bg-white px-8 py-8">
              <div className="flex justify-between items-start gap-4 pb-6 border-b border-stone-100">
                <div>
                  <p
                    className="text-xl font-bold text-gray-900 mb-2.5"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {invoice.company || (
                      <span className="text-stone-300 font-normal">
                        Company Name
                      </span>
                    )}
                  </p>
                  {invoice.address && (
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
                      <MapPin size={12} className="text-orange-400" />
                      {invoice.address}
                    </div>
                  )}
                  {invoice.email && (
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
                      <Mail size={12} className="text-orange-400" />
                      {invoice.email}
                    </div>
                  )}
                  {invoice.phone && (
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <Phone size={12} className="text-orange-400" />
                      {invoice.phone}
                    </div>
                  )}
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-100 border border-orange-200 rounded-2xl px-4 py-3.5 shrink-0 min-w-40">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                    {fields.find((f) => f.name === "invoiceNo")?.label ||
                      "Invoice No"}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {invoice.invoiceNo || (
                      <span className="text-stone-300 font-normal">—</span>
                    )}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-amber-600 mt-2">
                    <Calendar size={12} />
                    {invoice.date || "—"}
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2.5">
                  Bill To
                </p>
                <div className="bg-gradient-to-br from-stone-50 to-stone-100 border border-stone-200 rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-900 mb-1.5">
                    <User size={14} className="text-orange-500" />
                    {invoice.customerName || (
                      <span className="text-stone-300 font-normal">
                        Customer Name
                      </span>
                    )}
                  </div>
                  {invoice.email && (
                    <p className="text-xs text-stone-500 mb-1">
                      {invoice.email}
                    </p>
                  )}
                  {invoice.phone && (
                    <p className="text-xs text-stone-500">{invoice.phone}</p>
                  )}
                </div>
              </div>
              <div className="mt-5 rounded-2xl overflow-hidden border border-stone-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-900 to-gray-700">
                      <th className="text-left px-4 py-3 text-white text-[10px] font-bold uppercase tracking-widest">
                        {fields.find((f) => f.name === "service")?.label ||
                          "Service"}
                      </th>
                      <th className="text-right px-4 py-3 text-white text-[10px] font-bold uppercase tracking-widest">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3.5 text-sm text-stone-600">
                        {invoice.service || (
                          <span className="text-stone-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-right font-semibold text-stone-700">
                        ₹ {subtotal.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {customFields.length > 0 && (
                <div className="mt-4 rounded-2xl border border-stone-200 overflow-hidden">
                  <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      Additional Details
                    </p>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {customFields.map((f) => (
                      <div
                        key={f.id}
                        className="flex justify-between items-center px-4 py-2.5"
                      >
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                          {f.label}
                        </span>
                        <span className="text-xs font-semibold text-stone-600">
                          {invoice[f.name]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 bg-gradient-to-br from-stone-50 to-stone-100 border border-stone-200 rounded-2xl px-5 py-5">
                <div className="flex justify-between text-sm text-stone-500 mb-2">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹ {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-stone-500 mb-2">
                  <span>
                    {fields.find((f) => f.name === "tax")?.label || "Tax"} (
                    {invoice.tax || 0}%)
                  </span>
                  <span className="font-semibold text-gray-900">
                    ₹ {taxAmount.toLocaleString()}
                  </span>
                </div>
                <hr className="border-stone-200 my-3" />
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">Total Due</span>
                  <span
                    className="text-3xl font-black"
                    style={{
                      fontFamily: "Playfair Display, serif",
                      background: "linear-gradient(135deg,#f97316,#ec4899)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ₹ {total.toLocaleString()}
                  </span>
                </div>
              </div>
              {invoice.notes && (
                <div className="mt-4 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 mb-1.5">
                    📝{" "}
                    {fields.find((f) => f.name === "notes")?.label || "Notes"}
                  </p>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {invoice.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
