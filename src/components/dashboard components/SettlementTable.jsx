import React, { useState } from "react";
import { Calendar, Clock, CheckCircle, AlertTriangle, CircleCheck, DollarSign } from "lucide-react";
import UserManagementCardDesign from "../UserManagementCardDesign";

export default function SettlementTable (){

    const studentCards = [
        {
          title : "Total Settlement",
          icon : DollarSign,
          subTitle : "+12% from last month",
          value : "&18,665",
        },
        {
          title : "Pending Approvals",
          icon : AlertTriangle,
          subTitle : "Requires immediate attention",
          value : "5",
        },
        {
          title : "Completed",
          icon : CircleCheck,
          subTitle : "This Week",
          value : "3",
        },
      ]

  const [transactions, setTransactions] = useState([
    { id: "TXN-001", user: "John Smith", role: "Teacher", amount: 2450, status: "Pending", date: "2025-08-15" },
    { id: "TXN-002", user: "Sarah Johnson", role: "Teacher", amount: 1200, status: "Completed", date: "2025-08-14" },
    { id: "TXN-003", user: "Mike Davis", role: "Teacher", amount: 3800, status: "Pending", date: "2025-08-13" },
    { id: "TXN-004", user: "Emma Wilson", role: "Teacher", amount: 890, status: "Completed", date: "2025-08-12" },
    { id: "TXN-005", user: "David Brown", role: "Teacher", amount: 5200, status: "Pending", date: "2025-08-11" },
    { id: "TXN-006", user: "Lisa Chen", role: "Teacher", amount: 1850, status: "Pending", date: "2025-08-10" },
    { id: "TXN-007", user: "Robert Taylor", role: "Teacher", amount: 2300, status: "Completed", date: "2025-08-09" },
    { id: "TXN-008", user: "Maria Garcia", role: "Teacher", amount: 975, status: "Pending", date: "2025-08-08" },
  ]);

  const handleApprove = (id) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Completed" } : t))
    );
  };

  const handleReject = (id) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Rejected" } : t))
    );
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
        <div className="flex flex-col items-start ">
                        <span className="text-3xl font-bold">Finance Management</span>
                        <span className="text-sm pt-1">Monitor and approve settlements</span>
                        <span className="text-xl font-bold mt-3 mb-2">Finance: Monitor & Approve Settlements</span>
                      </div>
                      

     {/* cards view  */}
            <div className="flex flex-row gap-5 w-[full]   p-5">
                            {studentCards.map((studentCard, index) => (
                                    <UserManagementCardDesign key={index} title={studentCard.title} subTitle={studentCard.subTitle} icon={studentCard.icon} value={studentCard.value} />
                                    
                                  ))}
                            </div>
            {/* cards view  */}


      <div className="bg-white p-6 rounded-2xl shadow-md border">
        {/* Header */}
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock size={18} /> Settlement Management
        </h2>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* <div>
            <label className="block text-sm text-gray-600">Date Range (From)</label>
            <div className="flex items-center border rounded-lg p-2 bg-gray-50">
              <Calendar size={16} className="text-gray-400 mr-2" />
              <input type="date" className="bg-transparent outline-none w-full text-sm" />
            </div>
          </div> */}

          <div>
            <label className="block text-sm text-gray-600">Status</label>
            <select className="w-full border rounded-lg p-2 bg-gray-50 text-sm">
              <option>All Status</option>
              <option>Pending</option>
              <option>Completed</option>
              <option>Rejected</option>
            </select>
          </div>

          {/* <div>
            <label className="block text-sm text-gray-600">User Type</label>
            <select className="w-full border rounded-lg p-2 bg-gray-50 text-sm">
              <option>All Users</option>
              <option>Teacher</option>
              <option>Teacher</option>
            </select>
          </div> */}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr
                  key={t.id}
                  className={`${t.status === "Pending" ? "bg-yellow-50" : ""} border-t text-start`}
                >
                  <td className="px-4 py-3 font-medium">{t.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{t.user}</p>
                    <span className="text-xs text-gray-500">{t.role}</span>
                  </td>
                  <td className="px-4 py-3">${t.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {t.status === "Pending" && (
                      <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                        <Clock size={12} /> Pending
                      </span>
                    )}
                    {t.status === "Completed" && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                        <CheckCircle size={12} /> Completed
                      </span>
                    )}
                    {t.status === "Rejected" && (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full w-fit">
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{t.date}</td>
                  <td className="px-4 py-3">
                    {t.status === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(t.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(t.id)}
                          className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs hover:bg-red-200"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-3 text-sm text-gray-500">
          Showing {transactions.length} of {transactions.length} settlements
        </div>
      </div>
    </div>
  )
}


