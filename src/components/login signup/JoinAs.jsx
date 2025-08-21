import React, { useState } from "react";
import SignupForm from "./SignupForm";

export default function JoinAs() {
  const [selectedRole, setSelectedRole] = useState("student");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      {/* Container */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 border">

        {/* Role selection */}
        <h2 className="text-center font-semibold text-lg mb-4">Join as</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setSelectedRole("student")}
            className={`p-3 rounded-full border-2 ${
              selectedRole === "student" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
            }`}
          >
            Student
          </button>

          <button
            onClick={() => setSelectedRole("teacher")}
            className={`p-3 rounded-full border-2 ${
              selectedRole === "teacher" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
            }`}
          >
            Teacher
          </button>

          <button
            onClick={() => setSelectedRole("university")}
            className={`p-3 rounded-full border-2 ${
              selectedRole === "university" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
            }`}
          >
            University
          </button>

          <button
            onClick={() => setSelectedRole("referral")}
            className={`p-3 rounded-full border-2 ${
              selectedRole === "referral" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
            }`}
          >
            Referral Partner
          </button>
        </div>

        {/* Display selected role content */}
        <div className="border p-6 rounded-xl text-center min-h-[150px] flex items-center justify-center">
          {!selectedRole && (
            <p className="text-gray-400">Display content according to selected card</p>
          )}

          {selectedRole === "student" && (
            <div className="text-gray-700 font-medium w-full">
              <SignupForm role={"Student"}/>
            </div>
          )}

          {selectedRole === "teacher" && (
            <div className="text-gray-700 font-medium">
              <SignupForm role={"Teacher"}/>
            </div>
          )}

          {selectedRole === "university" && (
            <div className="text-gray-700 font-medium">
              <SignupForm role='University'/>
            </div>
          )}

          {selectedRole === "referral" && (
            <div className="text-gray-700 font-medium">
              <SignupForm role="referral"/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
