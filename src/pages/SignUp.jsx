import React, { useState } from "react";

// Single-file Signup component for roles:
// admin, super admin, university, teacher, student, referral partner
// Tailwind CSS classes used — make sure Tailwind is configured in the project.

export default function SignUp() {
  const ROLES = [
    "super_admin",
    "admin",
    "university",
    "teacher",
    "student",
    "referral_partner",
  ];

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    // role-specific fields
    universityName: "",
    department: "",
    referralCode: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function validate() {
    const err = {};
    if (!form.fullName.trim()) err.fullName = "Full name is required";
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) err.email = "Valid email required";
    if (form.password.length < 6) err.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) err.confirmPassword = "Passwords do not match";

    // role-specific validation
    if (form.role === "university" && !form.universityName.trim()) err.universityName = "University name required";
    if (form.role === "teacher" && !form.department.trim()) err.department = "Department required";
    if (form.role === "referral_partner" && !form.referralCode.trim()) err.referralCode = "Referral code required";

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (!validate()) return;

    setLoading(true);
    try {
      // Example API request — adapt endpoint & body to your backend
      const payload = {
        name: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
        metadata: {
          universityName: form.universityName || undefined,
          department: form.department || undefined,
          referralCode: form.referralCode || undefined,
        },
      };

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      setMessage({ type: "success", text: "Signup successful! Check your email." });
      setForm({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: form.role,
        universityName: "",
        department: "",
        referralCode: "",
      });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-400 p-6">
      <div className="w-full max-w-xl bg-blue/50 backdrop-blur-md rounded-2xl shadow-lg p-8 bg-white ">
        <h2 className="text-2xl font-semibold mb-1">Create an account</h2>
        <p className="text-sm text-gray-500 mb-6">Choose your role and sign up to access the Larnik platform.</p>

        {message && (
          <div className={`p-3 rounded mb-4 ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={`w-full rounded-lg p-3 border ${errors.fullName ? "border-red-300" : "border-gray-200"}`}
              placeholder="Enter Your Name"
            />
            {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full rounded-lg p-3 border ${errors.email ? "border-red-300" : "border-gray-200"}`}
              placeholder="Enter Your E-mail"
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className={`w-full rounded-lg p-3 border ${errors.password ? "border-red-300" : "border-gray-200"}`}
                placeholder="Enter Your Password"
              />
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm password</label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`w-full rounded-lg p-3 border ${errors.confirmPassword ? "border-red-300" : "border-gray-200"}`}
                placeholder="Enter Confirm password"
              />
              {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full rounded-lg p-3 border border-gray-200">
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Role-specific fields */}
          {form.role === "university" && (
            <div>
              <label className="block text-sm font-medium mb-1">University name</label>
              <input name="universityName" value={form.universityName} onChange={handleChange} className="w-full rounded-lg p-3 border border-gray-200" placeholder="Example University" />
              {errors.universityName && <p className="text-xs text-red-600 mt-1">{errors.universityName}</p>}
            </div>
          )}

          {form.role === "teacher" && (
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <input name="department" value={form.department} onChange={handleChange} className="w-full rounded-lg p-3 border border-gray-200" placeholder="e.g., Computer Science" />
              {errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
            </div>
          )}

          {form.role === "referral_partner" && (
            <div>
              <label className="block text-sm font-medium mb-1">Referral code</label>
              <input name="referralCode" value={form.referralCode} onChange={handleChange} className="w-full rounded-lg p-3 border border-gray-200" placeholder="Partner code" />
              {errors.referralCode && <p className="text-xs text-red-600 mt-1">{errors.referralCode}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-green-800 text-white font-semibold hover:bg-sky-700 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-xs text-gray-500 mt-2">By signing up you agree to our Terms of Service and Privacy Policy.</p>
        </form>
      </div>
    </div>
  );
}
