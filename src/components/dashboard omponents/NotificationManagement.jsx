import { button, div } from 'framer-motion/client';
import React, { useState } from 'react'

export default function NotificationManagement() {

    // state for active tabs 
    const [activeTab, setActiveTab] = useState("all");

    // tabs 
    const tabs = [
        { id : "all", label : "Compose"},
        { id : "history", label : "History"},
        { id : "templetes", label : "Templetes"},
        { id : "analytics", label : "Analytics"},
    ]



  return (
    <>
    <div className='p-6 bg-gray-50 min-h-screen'>

        {/* tab buttons  */}

        <div className='flex space-x-2 bg-gray-100 rounded-full p-1 w-fit mb-6'>
        {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${ activeTab == tab.id ? "bg-white shadow " : " text-gray-600"}`}>
                {tab.label}
            </button>
        ))}
        </div>

        {/* compose tab  */}
        {activeTab === "all" && (
            <div className='bg-white rounded-lg shadow p-4 overflow-x-auto'>
                <h1>compose tab</h1>
            </div>
        )}



    </div>
    </>
  )
}
