import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Signup({ role }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [doc, setDoc] = useState(null);

  // OTP handling
  const handleSendOtp = () => {
    setOtpSent(true);
    alert("Dummy OTP: 1234");
  };
  const handleVerifyOtp = () => {
    if (otp === "1234") {
      setIsOtpVerified(true);
      alert("OTP Verified");
    } else {
      alert("Invalid OTP");
    }
  };

  const handleFileChange = (e) => {
    setDoc(e.target.files[0]);
  };

  const handleSignup = () => {
    if (!isOtpVerified) {
      alert("Please verify OTP first");
      return;
    }
    if (role === "University" && !doc) {
      alert("Please upload MoU document");
      return;
    }
    alert(`Account Created ✅\nRole: ${role}${doc ? `\nUploaded: ${doc.name}` : ""}`);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-2">Create Account</h2>
        <p className="text-gray-500 mb-6">Continue as {role}</p>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Phone Number + OTP */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">Phone Number</label>
          <div className="flex gap-2">
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="flex-1 border rounded-lg p-2"
            />
            {!otpSent ? (
              <button
                onClick={handleSendOtp}
                className="bg-blue-500 text-white px-4 rounded-lg"
              >
                Send OTP
              </button>
            ) : (
              <button
                onClick={handleVerifyOtp}
                className="bg-green-500 text-white px-4 rounded-lg"
              >
                Verify OTP
              </button>
            )}
          </div>

          {otpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-lg p-2 mt-2"
            />
          )}
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label className="block mb-1 text-sm">Password</label>
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full border rounded-lg p-2 pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-500"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block mb-1 text-sm">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Role specific section */}
        {role === "Student" && (
          <div className="mb-4">
            <label className="block mb-1 text-sm">Student ID / Roll No.</label>
            <input
              type="text"
              placeholder="Enter your Student ID"
              className="w-full border rounded-lg p-2"
            />
          </div>
        )}

        {role === "Teacher" && (
          <div className="mb-4">
            <label className="block mb-1 text-sm">University Code</label>
            <input
              type="text"
              placeholder="Enter your Code"
              className="w-full border rounded-lg p-2"
            />
          </div>
        )}

        {role === "University" && (
          <div className="mb-4">
            <label className="block mb-1 text-sm">Upload MoU Document</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleFileChange}
              className="w-full border rounded-lg p-2"
            />
            {doc && (
              <p className="text-xs text-gray-600 mt-1">Selected: {doc.name}</p>
            )}
          </div>
        )}

        {role === "Referral" && (
          <div className="mb-4">
            <label className="block mb-1 text-sm">Referral Code</label>
            <input
              type="text"
              placeholder="Enter Referral Code"
              className="w-full border rounded-lg p-2"
            />
          </div>
        )}

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          className="w-full bg-green-600 text-white rounded-lg p-2 font-medium"
        >
          Create Account
        </button>

        {/* Footer */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 font-semibold">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
