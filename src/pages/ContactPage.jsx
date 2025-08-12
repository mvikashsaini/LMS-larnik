import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    subscribe: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.message.trim() || form.message.trim().length < 10) e.message = "Message should be at least 10 characters.";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setStatus(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json().catch(() => ({}));

      setStatus({ type: "success", message: data.message || "Message sent — we will get back to you soon." });
      setForm({ name: "", email: "", message: "", subscribe: false });
      setErrors({});
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "There was a problem sending your message. Try again later." });
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-6 md:p-10" >
        
        

        {status && (
          <div
            role="alert"
            className={`mb-4 px-4 py-3 rounded-lg text-sm ${
              status.type === "success"
                ? "bg-green-50 text-green-800 border border-green-100"
                : "bg-red-50 text-red-800 border border-red-100"
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">Name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`mt-2 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.name ? "border-red-300" : "border-gray-200"}`}
                placeholder="Your full name"
              />
              {errors.name && <span className="text-xs text-red-600 mt-1">{errors.name}</span>}
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`mt-2 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.email ? "border-red-300" : "border-gray-200"}`}
                placeholder="aman@gmail.com"
              />
              {errors.email && <span className="text-xs text-red-600 mt-1">{errors.email}</span>}
            </label>
          </div>

          <label className="flex flex-col mt-4">
            <span className="text-sm font-medium text-gray-700">Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={6}
              className={`mt-2 p-3 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.message ? "border-red-300" : "border-gray-200"}`}
              placeholder="Tell us what's on your mind"
            />
            {errors.message && <span className="text-xs text-red-600 mt-1">{errors.message}</span>}
          </label>


           

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 text-white font-medium hover:brightness-105 disabled:opacity-60"
            >
              {loading && (
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              )}
              <span>{loading ? "Sending..." : "Send Message"}</span>
            </button>

            <button
              type="Reset"
              onClick={() => {
                setForm({ name: "", email: "", message: "", subscribe: false });
                setErrors({});
                setStatus(null);
              }}
              className="px-5 py-3 rounded-xl    bg-indigo-600  text-sm"
            >
              Reset
            </button>
          </div>
        </form>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="font-semibold">Support</div>
            <div className="text-gray-600 mt-1">support@larnik.example</div>
            <div className="text-gray-500 mt-2">Average reply time: 24 hours</div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="font-semibold">Sales</div>
            <div className="text-gray-600 mt-1">sales@larnik.example</div>
            <div className="text-gray-500 mt-2">For pricing & partnerships</div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="font-semibold">Head Office</div>
            <div className="text-gray-600 mt-1">Jaipur, Rajasthan, India</div>
            <div className="text-gray-500 mt-2">Mon–Fri, 9:00 — 18:00 (IST)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
