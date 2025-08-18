import React, { useState } from "react";
import { Upload } from "lucide-react";

export default function CertificateUpload() {
  const [form, setForm] = useState({
    logo: null,
    background: null,
    signature: null,
    design: null,
    title: "Certificate of Completion",
    issuer: "Learning Management System",
    autoIssue: false,
  });

  // Handle file upload
  const handleFileChange = (e, field) => {
    setForm({ ...form, [field]: e.target.files[0] });
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800">
        Certificate Management
      </h1>
      <p className="text-gray-600 mb-6">
        Design and configure certificate templates
      </p>

      {/* Main Card */}
      <div className="bg-white shadow-md rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Certificate Preview */}
        <div>
          <h2 className="font-semibold mb-3">Certificate Preview</h2>
          <div className="border rounded-xl p-6 bg-gray-50">
            <div className="text-center">
              <p className="text-sm text-gray-500 text-right">
                Certificate ID: #001
              </p>
              <h3 className="text-xl font-bold">Certificate of Completion</h3>
              <p className="text-gray-600 mt-2">This is to certify that</p>
              <p className="font-semibold text-lg my-2">[Student Name]</p>
              <p className="text-gray-600">
                has successfully completed the course requirements for
              </p>
              <p className="font-semibold text-lg my-2">[Course Name]</p>
              <div className="flex justify-between mt-6 text-sm text-gray-600">
                <p>
                  Signature <br />
                  Learning Management System
                </p>
                <p>Date <br /> 8/18/2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div>
          <h2 className="font-semibold mb-3">Certificate Configuration</h2>
          <div className="space-y-4">
            {/* Upload Logo */}
            <div>
              <label className="block text-sm font-medium">Upload Logo</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "logo")}
                className="mt-1 block w-full text-sm text-gray-600"
              />
            </div>

            {/* Upload Background */}
            <div>
              <label className="block text-sm font-medium">
                Upload Background
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "background")}
                className="mt-1 block w-full text-sm text-gray-600"
              />
            </div>

            {/* Certificate Title */}
            <div>
              <label className="block text-sm font-medium">
                Certificate Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* Upload Signature */}
            <div>
              <label className="block text-sm font-medium">
                Upload Signature
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "signature")}
                className="mt-1 block w-full text-sm text-gray-600"
              />
            </div>

            {/* Issuer Name */}
            <div>
              <label className="block text-sm font-medium">Issuer Name</label>
              <input
                type="text"
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* Upload Design */}
            <div>
              <label className="block text-sm font-medium">
                Upload Design (PNG/PDF)
              </label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                <p className="text-gray-500 text-sm mb-2">
                  Drag and drop your certificate design here, or
                </p>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "design")}
                  className="hidden"
                  id="designUpload"
                />
                <label
                  htmlFor="designUpload"
                  className="cursor-pointer bg-gray-100 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
                >
                  Browse Files
                </label>
              </div>
            </div>

            {/* Auto Issue Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={form.autoIssue}
                onChange={(e) =>
                  setForm({ ...form, autoIssue: e.target.checked })
                }
                className="h-4 w-4 text-green-600 rounded"
              />
              <label className="text-sm">Enable Auto-Issue Certificates</label>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
                Save Template
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
