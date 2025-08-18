import { Calendar, Inbox, Send, Target,} from 'lucide-react';
import React, { useState } from 'react';
import UserManagementCardDesign from '../UserManagementCardDesign';

export default function NotificationManagement() {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "Compose" },
    { id: "history", label: "History" },
    { id: "templetes", label: "Templetes" },
  ];

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('All Students');
  const [schedule, setSchedule] = useState(false);

  const audience = [
    { name: 'All Students', count: 2380 },
    { name: 'Active Students', count: 1847 },
    { name: 'New Students', count: 156 },
    { name: 'All Teachers', count: 78 },
    { name: 'Top Performing Teachers', count: 23 },
    { name: 'University Staff', count: 24 },
    { name: 'Referral Partners', count: 12 },
  ]

  const studentCards = [
    {
      title : "Total Sent",
      icon : Send,
      subTitle : "This month",
      value : "15,847",
    },
    {
      title : "Average Open Rate",
      icon : Inbox,
      subTitle : "5.2% active rate",
      value : "73.8%",
    },
    {
      title : "Click Through Rate",
      icon : Target,
      subTitle : "2.% From Last Month",
      value : "12.1%",
    },
    {
      title : "Scheduled",
      icon : Calendar,
      subTitle : "Upcoming Notification",
      value : "5",
    },
  ]

  const history_data = [
    {
      title: "Course Enrollment Deadline",
      desc: "Enroll now for the Advanced React course before t...",
      type: "Email",
      recipients: 1250,
      sentDate: "2024-08-12 14:30",
      status: "delivered",
      openRate: "78.5%",
      clickRate: "12.3%",
    },
    {
      title: "New Course Available",
      desc: "Check out our latest Python course for beginners.",
      type: "Push",
      recipients: 2380,
      sentDate: "2024-08-11 09:15",
      status: "delivered",
      openRate: "65.2%",
      clickRate: "8.7%",
    },
    {
      title: "Settlement Processed",
      desc: "Your earnings have been processed and transferred.",
      type: "Sms",
      recipients: 78,
      sentDate: "2024-08-10 16:45",
      status: "delivered",
      openRate: "92.1%",
      clickRate: "15.6%",
    },
    {
      title: "System Maintenance",
      desc: "Platform will be under maintenance on Sunday.",
      type: "Email",
      recipients: 2502,
      sentDate: "2024-08-09 18:00",
      status: "scheduled",
      openRate: "-",
      clickRate: "-",
    },
  ]

  const templates = [
    {
      title: "Course Enrollment",
      desc: "Notify about new course enrollments",
      tag: "Academic",
    },
    {
      title: "Payment Reminder",
      desc: "Payment due date reminders",
      tag: "Finance",
    },
    {
      title: "Welcome Message",
      desc: "Welcome new users to platform",
      tag: "Onboarding",
    },
    {
      title: "Course Completion",
      desc: "Congratulate course completion",
      tag: "Academic",
    },
    {
      title: "System Maintenance",
      desc: "Notify about system downtime",
      tag: "System",
    },
    {
      title: "Settlement Processed",
      desc: "Payment settlement notifications",
      tag: "Finance",
    },
  ]



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
        {/* cards view  */}
        <div className="flex flex-row gap-5 w-[full]   p-5">
                        {studentCards.map((studentCard, index) => (
                                <UserManagementCardDesign key={index} title={studentCard.title} subTitle={studentCard.subTitle} icon={studentCard.icon} value={studentCard.value} />
                                
                              ))}
                        </div>
        {/* cards view  */}
      {/* Tab Buttons */}
      <div className="flex space-x-2 bg-gray-100 rounded-full p-1 w-fit mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition 
              ${activeTab === tab.id ? "bg-white shadow" : "text-gray-600"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Compose Tab */}
      {activeTab === "all" && (
        <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">


          
          <div className="flex gap-5">
            {/* Left Side */}
            <div className="flex flex-col flex-1 p-5 border border-gray-300 rounded-lg items-start">
              
              <div className='flex  flex-col items-center w-full'>
              <h3 className="text-lg font-semibold mb-4">Compose Notification</h3>
                  <p className="font-medium">Notification Type:</p>
                  <div className='flex flex-row gap-5'>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked /> Email
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Push
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> SMS
                  </label>
                  </div>
              </div>

              <p className="font-medium mt-4">Target Audience:</p>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              >
                {audience.map((a) => (
                  <option key={a.name}>{a.name}</option>
                ))}
              </select>

              <p className="font-medium mt-4">Title/Subject:</p>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                />

              <p className="font-medium mt-4">Message:</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full h-28"
                />
              <small className="text-gray-500">{message.length} characters</small>

              <div className="mt-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={schedule}
                    onChange={() => setSchedule(!schedule)}
                    />
                  Schedule for later
                </label>
              </div>

              <div className="flex gap-5 mt-4 h-10">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg ">Send Now</button>
                <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">Save as Template</button>
                <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">Preview</button>
              </div>
            </div>

            {/* Right Side */}
            <div className="w-72 p-5 border border-gray-300 rounded-lg">
              <h4 className="text-md font-semibold mb-3">Audience Segments</h4>
              {audience.map((a) => (
                <div
                key={a.name}
                onClick={() => setTarget(a.name)}
                className={`cursor-pointer px-3 py-2 mb-2 rounded-lg transition text-start 
                  ${target === a.name ? "bg-blue-50 border border-blue-200" : "bg-white border border-gray-200"}`}
                  >
                  <span>{a.name}</span>
                  <span className="float-right text-gray-500">{a.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Compose Tab */}

      {/* history Tab  */}
      {activeTab === "history" && (
        <div className="p-4 bg-white rounded-lg shadow text-start">
        <h2 className="text-lg font-semibold">Notification History</h2>
        <p className="text-gray-500 text-sm mb-4">
          View and manage your sent notifications
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Title</th>
              <th className="text-left py-2">Type</th>
              <th className="text-left py-2">Recipients</th>
              <th className="text-left py-2">Sent Date</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Open Rate</th>
              <th className="text-left py-2">Click Rate</th>
            </tr>
          </thead>
          <tbody>
            {history_data.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 text-start">
                <td className="py-2">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </td>
                <td className="py-2">{item.type}</td>
                <td className="py-2">{item.recipients}</td>
                <td className="py-2">{item.sentDate}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      item.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-2">{item.openRate}</td>
                <td className="py-2">{item.clickRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      {/* history Tab  */}

      {/* Templates Tab  */}
      {activeTab === "templetes" && (
        <div className="p-4 bg-white rounded-lg shadow text-start">
        <h2 className="text-lg font-semibold">Notification Templates</h2>
        <p className="text-gray-500 text-sm mb-4">
          Pre-built templates for common notifications
        </p>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {item.tag}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
  
              <div className="flex gap-2 mt-4">
                <button className="flex-1 border rounded-md py-1 text-sm hover:bg-gray-50">
                  Edit
                </button>
                <button className="flex-1 bg-black text-white rounded-md py-1 text-sm hover:bg-gray-800">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
      {/* Templates Tab  */}


    </div>
  );
}
