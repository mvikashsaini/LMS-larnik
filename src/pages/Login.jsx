import React, { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: ""
  });

  const roles = [
    "Admin",
    "Super Admin",
    "University",
    "Teacher",
    "Referral Partner",
    "Sub Admin"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
    // TODO: Add API call for login
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-800 to-green-800">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Dashboard
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              required
            >
              <option value="">-- Select --</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              required/>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              required
            />
          </div>

          {/* Submit */}
          <button type="submit"
            className="w-full bg-green-800 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200"
          >Login</button>
        </form>

        {/* Optional - Footer */}
        <p className="text-center text-gray-500 text-sm mt-4">
          © {new Date().getFullYear()} Larnik E-Learning Platformm
        </p>
      </div>
    </div>
  );
}
