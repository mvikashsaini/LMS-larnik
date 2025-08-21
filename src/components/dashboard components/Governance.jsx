import React, { useState } from "react";

export default function Governance() {
  // Sample MoU data
  const [mouList, setMouList] = useState([
    { id: 1, university: "XYZ University", docUrl: "/docs/mou-xyz.pdf", date: "2025-08-12", status: "Pending" },
    { id: 2, university: "ABC Institute", docUrl: "/docs/mou-abc.pdf", date: "2025-08-05", status: "Approved" },
    { id: 3, university: "LMN College", docUrl: "/docs/mou-lmn.pdf", date: "2025-08-01", status: "Rejected" },
  ]);

  // Selected tab: Pending | Approved | Rejected
  const [tab, setTab] = useState("Pending");

  // For viewing document in popup
  const [viewDoc, setViewDoc] = useState(null);

  // Approve or Reject function
  const handleAction = (id, action) => {
    setMouList(mouList.map((mou) =>
      mou.id === id ? { ...mou, status: action } : mou
    ));
  };

  // Filter list by tab
  const filteredList = mouList.filter((mou) => mou.status === tab);

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {["Pending", "Approved", "Rejected"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded ${
              tab === t ? "bg-gray-900 text-white" : "bg-gray-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">University</th>
            <th className="p-3">MoU Document</th>
            <th className="p-3">Uploaded Date</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No {tab} MoUs
              </td>
            </tr>
          ) : (
            filteredList.map((mou) => (
              <tr key={mou.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{mou.university}</td>
                <td className="p-3">
                  <button
                    onClick={() => setViewDoc(mou)}
                    className="text-blue-600 underline"
                  >
                    View
                  </button>
                </td>
                <td className="p-3">{mou.date}</td>
                <td className="p-3">{mou.status}</td>
                <td className="p-3 space-x-2">
                  {mou.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleAction(mou.id, "Approved")}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(mou.id, "Rejected")}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Popup to view document */}
      {viewDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-3/4 h-3/4 rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="font-bold">{viewDoc.university} - MoU</h3>
              <button
                onClick={() => setViewDoc(null)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Close
              </button>
            </div>
            <div className="p-3 h-full">
              <iframe
                src={viewDoc.docUrl}
                title="MoU Document"
                className="w-full h-full rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
