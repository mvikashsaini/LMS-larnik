import React from "react";
import { Home, BookOpen, User, Settings, ChartNoAxesCombined, Users, Sun, Bell, ChevronDown, DollarSign, Globe, AlertTriangle } from "lucide-react";
import SearchBar from "./SearchBar";
import DashboardCard from "./DashboardCard";
import { title } from "framer-motion/client";
import { color } from "framer-motion";
import AlertCard from "./AlertCard";
import { info } from "autoprefixer";

export default function AdminDashboard() {
  const alerts = [
    {
      title: "High Server Load",
      subtitle : "Server CPU is at 85%",
      data: "5 minutes",
      btn_name:"Warning",
      bgcolour: "yellow",
      ntmcolour: "yellow",

    },
    {
      title: "New Feature Deployed",
      subtitle : "Course analytics v2.0 is now live",
      data: "2 hours ago",
      btn_name:"info",
      bgcolour: "yellow",
      ntmcolour: "yellow",

    },
    {
      title: "Payment Gateway Issue",
      subtitle : "Some transactions are failing",
      data: "30 minutes ago",
      btn_name:"error",
      bgcolour: "yellow",
      ntmcolour: "yellow",

    },
    {
      title: "High Server Load",
      subtitle : "Server CPU is at 85%",
      data: "5 minutes",
      btn_name:"Warning",
      bgcolour: "yellow",
      ntmcolour: "yellow",

    },
    {
      title: "New Feature Deployed",
      subtitle : "Course analytics v2.0 is now live",
      data: "2 hours ago",
      btn_name:"info",
      bgcolour: "yellow",
      ntmcolour: "yellow",

    },
    {
      title: "Payment Gateway Issue",
      subtitle : "Some transactions are failing",
      data: "30 minutes ago",
      btn_name:"error",
      bgcolour: "yellow",
      ntmcolour: "yellow",

    },
  ]

    const card = [
    {
      title: "45,892",
      subtitle: "Total Users",
      data: "12",
      icon: Users,
      colour : "red",
    },
    {
      title: "3,247",
      subtitle: "Total Courses",
      data: "8",
      icon: BookOpen,
      colour : "green",
    },
    {
      title: "$12.5M",
      subtitle: "Platrom Revenue",
      data: "15",
      icon: DollarSign,
      colour : "orange",
    },
    {
      title: "8,945",
      subtitle: "Active Sessions",
      data: "5",
      icon: Globe,
      colour : "blue",
    },
  ]

    return (
    <>
      <div className="flex h-screen">

        <div className="bg-green-50 h-screen w-64">
            {/* logo  */}
            <div className="px-6 py-4 text-2xl font-bold border-b border-green-500">Larnik</div>

            {/* profile view  */}
            <div className="flex items-center gap-2 border-b border-green-500 px-6 py-4">
                <User className="bg-green-700 rounded-full w-12 h-12 p-2"/>
                <div className="flex flex-col ">
                    <span className="font-bold">Super Admin</span>
                    <span className="text-xs bg-green-200 px-1 py-0.5 rounded-xl ">Super Admin</span>
                </div>
            </div>

            {/* navbar  */}
            <nav className="flex-1 px-4 py-6 space-y-4 text-xs">
        <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-400 hover:text-green-800 py-2 px-3">
          <Home size={20} /> Dashboard
        </a>
        <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-400 hover:text-green-800 py-2 px-3">
          <BookOpen size={20} /> Courses management
        </a>
        <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-400 hover:text-green-800 py-2 px-3">
          <Users size={20} /> Users Management
        </a>
        <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-400 hover:text-green-800 py-2 px-3">
          <ChartNoAxesCombined  size={20} /> Analytics
        </a>
        <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-400 hover:text-green-800 py-2 px-3">
          <Settings size={20} /> Platform Settings
        </a>
        <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-400 hover:text-green-800 py-2 px-3">
          <User size={20} /> Profile
        </a>
        <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-400 hover:text-green-800 py-2 px-3">
          <Settings size={20} /> Settings
        </a>
      </nav>
        </div>

        <div className="flex  h-screen w-full  flex-col gap-5 items-center bg-black/10">
          {/* navbar  */}
          <div className="bg-white w-full h-16 flex items-center justify-between px-7">
            <div>
              <SearchBar/>
            </div>
            <div className="flex gap-7 items-center">
              <Sun className=" hover:bg-green-600 w-12 h-12 rounded-xl p-3" size={32}/>
              <Bell className=" hover:bg-green-600 w-12 h-12 rounded-xl p-3" size={32}/>
              <div className="flex gap-1 hover:bg-green-600 px-2 py-1 rounded-xl">
                <User />
                <span>Super Admin</span>
                <ChevronDown />
              </div>
            </div>
          </div>
          {/* below area  */}
          <div className="bg-red-600 h-32 rounded-xl w-[98%] flex flex-col items-start justify-center p-5 text-white">
            <span className="text-2xl font-bold">Admin Control Center 🛡️</span>
            <span>Monitor and manage the entire platform</span>
          </div>

        {/* card area  */}
        <div className="flex  w-full px-5 gap-2">
          {card.map((card, index) => (
        <DashboardCard key={index} title={card.title} icon={card.icon} data={card.data} colour={card.colour}/>
          ))}
        </div>

          <div className=" w-[98%] h-full flex gap-5 p-5">
            <div className=" shadow-2xl h-[480px] w-full rounded-2xl flex flex-col p-5 gap-2">
              
              <div className="flex items-center justify-start gap-2">
                <AlertTriangle />
                <span className="font-bold"> System Alerts</span>
              </div>
              <div className="flex flex-col w-full h-full  rounded-xl items-center p-2 gap-2 overflow-y-auto">
                  {alerts.map((alert, index) => (
                  <AlertCard key={index} title={alert.title} btn_name={alert.btn_name} subtitle={alert.subtitle} data={alert.data}/>
                  ))}
              </div>

            </div>
              
            <div className="bg-green-300 h-[480px] w-full rounded-2xl "><div>
              </div>
              
              </div>
          </div>

        </div>

      

      </div>
    </>
  )
}
