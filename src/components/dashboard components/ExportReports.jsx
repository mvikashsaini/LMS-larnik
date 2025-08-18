import React, { useState } from "react";
import { Calendar, FileText, DollarSign, BookOpen, Users, Download, Eye, RefreshCw } from "lucide-react";

export default function ExportReports() {
  const [reports, setReports] = useState([
    { id: "RPT-001", type: "Student Progress", date: "2025-08-15", format: "PDF", size: "2.4 MB", status: "Completed" },
    { id: "RPT-002", type: "Course Performance", date: "2025-08-14", format: "CSV", size: "856 KB", status: "Completed" },
    { id: "RPT-003", type: "Financial", date: "2025-08-13", format: "Excel", size: "1.2 MB", status: "Processing" },
    { id: "RPT-004", type: "Certificates", date: "2025-08-12", format: "PDF", size: "3.8 MB", status: "Completed" },
    { id: "RPT-005", type: "Student Progress", date: "2025-08-11", format: "CSV", size: "0 KB", status: "Failed" },
    { id: "RPT-006", type: "Course Performance", date: "2025-08-10", format: "PDF", size: "4.1 MB", status: "Completed" },
  ]);

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Export Analytics & Reports</h1>
          <p className="text-gray-500 text-sm">Generate and download comprehensive reports</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 flex items-center gap-2">
          <FileText size={18} /> Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-gray-500 text-sm">Date Range</label>
            <div className="flex gap-2 mt-1">
              <input type="date" className="border rounded-lg p-2 w-full" />
              <input type="date" className="border rounded-lg p-2 w-full" />
            </div>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Report Type</label>
            <select className="border rounded-lg p-2 w-full mt-1">
              <option>All Reports</option>
              <option>Student Progress</option>
              <option>Course Performance</option>
              <option>Financial</option>
              <option>Certificates</option>
            </select>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Export Format</label>
            <select className="border rounded-lg p-2 w-full mt-1">
              <option>PDF</option>
              <option>CSV</option>
              <option>Excel</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Total Users</span>
            <Users size={20} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold mt-2">2,350</h2>
          <p className="text-green-500 text-sm">+8.2% from last month</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Total Certificates Issued</span>
            <FileText size={20} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mt-2">1,847</h2>
          <p className="text-green-500 text-sm">+12.5% from last month</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Revenue Generated</span>
            <DollarSign size={20} className="text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold mt-2">$156,750</h2>
          <p className="text-green-500 text-sm">+15.3% from last month</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Courses Completed</span>
            <BookOpen size={20} className="text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold mt-2">4,920</h2>
          <p className="text-orange-500 text-sm">+9.7% from last month</p>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Generated Reports</h3>
        <table className="w-full text-left">
          <thead className="text-gray-600 border-b">
            <tr>
              <th className="p-2">Report ID</th>
              <th className="p-2">Type</th>
              <th className="p-2">Date Generated</th>
              <th className="p-2">Format</th>
              <th className="p-2">Size</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-2">{r.id}</td>
                <td className="p-2">{r.type}</td>
                <td className="p-2">{r.date}</td>
                <td className="p-2">
                  <span className="px-2 py-1 text-xs rounded bg-gray-100">{r.format}</span>
                </td>
                <td className="p-2">{r.size}</td>
                <td className="p-2">
                  {r.status === "Completed" && <span className="text-green-600 font-medium">Completed</span>}
                  {r.status === "Processing" && <span className="text-blue-600 font-medium">Processing...</span>}
                  {r.status === "Failed" && <span className="text-red-600 font-medium">Failed</span>}
                </td>
                <td className="p-2 flex gap-2">
                  {r.status === "Completed" && (
                    <>
                      <button className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm">
                        <Download size={14} /> Download
                      </button>
                      <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg flex items-center gap-1 text-sm">
                        <Eye size={14} /> View
                      </button>
                    </>
                  )}
                  {r.status === "Processing" && <span className="text-gray-500">Processing…</span>}
                  {r.status === "Failed" && (
                    <button className="bg-red-100 text-red-600 px-3 py-1 rounded-lg flex items-center gap-1 text-sm">
                      <RefreshCw size={14} /> Retry
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-sm text-gray-500 mt-3">Showing {reports.length} reports</p>
      </div>
    </div>
  )
}
