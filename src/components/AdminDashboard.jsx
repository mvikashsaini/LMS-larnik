import React, { useState } from "react";
import { Home, BookOpen, User, Settings, ChartNoAxesCombined, Users, Sun, Bell, ChevronDown, DollarSign, Globe, AlertTriangle, UserCheck, Plus, UserX } from "lucide-react";
import SearchBar from "./SearchBar";
import DashboardCard from "./DashboardCard";
import { a, div, select, title } from "framer-motion/client";
import { color } from "framer-motion";
import AlertCard from "./AlertCard";
import { info } from "autoprefixer";
import PlatformCard from "./PlatformCard";
import UserManagementCardDesgin from "./UserManagementCardDesign";
import UserManagementCardDesign from "./UserManagementCardDesign";
import UserManagementListDesign from "./UserManagementListDesign";

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

  const platforms = [
    {
      title : "User Management",
      icon : Users,
    },
    {
      title : "Review Courses",
      icon : BookOpen,
    },
    {
      title : "View Analytics",
      icon : ChartNoAxesCombined,
    },
    {
      title : "System Setings",
      icon : Settings,
    },
  ]

  const studentCards = [
    {
      title : "Total Students",
      icon : Users,
      subTitle : "+12% from last month",
      value : "2,380",
    },
    {
      title : "Active",
      icon : UserCheck,
      subTitle : "90.5% active rate",
      value : "2,156",
    },
    {
      title : "Pending",
      icon : UserX,
      subTitle : "Awaiting approval",
      value : "124",
    },
    {
      title : "This Month",
      icon : Plus,
      subTitle : "New registrations",
      value : "156",
    },
  ]


const userLists = [
  {
    name: "Alice Johnson",
    mail: "alice.johnson@mail.com",
    phone: "+91 9876543210",
    status: "alert",
    courses: "3",
    progress: 50,
    last_login: "24-08-2025",
    status_title: "Pending",
    status_colour: "red",
    progress_val: 50
  },
  {
    name: "Vikash Saini",
    mail: "vikash.saini@mail.com",
    phone: "+91 7231842488",
    status: "active",
    courses: "5",
    progress: 70,
    last_login: "12-08-2025",
    status_title: "Active",
    status_colour: "green",
    progress_val: 70
  },
  {
    name: "Sara Ali",
    mail: "sara.ali@mail.com",
    phone: "+91 8823445566",
    status: "active",
    courses: "6",
    progress: 85,
    last_login: "13-08-2025",
    status_title: "Active",
    status_colour: "green",
    progress_val: 85
  },
  {
    name: "Rohit Verma",
    mail: "rohit.verma@mail.com",
    phone: "+91 7744112233",
    status: "alert",
    courses: "1",
    progress: 15,
    last_login: "01-06-2025",
    status_title: "Pending",
    status_colour: "red",
    progress_val: 15
  },
  {
    name: "Emily Carter",
    mail: "emily.carter@mail.com",
    phone: "+91 9933221100",
    status: "active",
    courses: "7",
    progress: 95,
    last_login: "14-08-2025",
    status_title: "Active",
    status_colour: "green",
    progress_val: 95
  },
  {
    name: "Arjun Mehta",
    mail: "arjun.mehta@mail.com",
    phone: "+91 9102030405",
    status: "alert",
    courses: "2",
    progress: 35,
    last_login: "18-07-2025",
    status_title: "Pending",
    status_colour: "red",
    progress_val: 35
  }
];

  const [nav_links, setNav_links] = useState("home")
  const [management, setManagement] = useState(false)
  const managementRoles = [
  { name: "Students", action: () => alert("Manage Students") },
  { name: "Teachers", action: () => alert("Manage Teachers") },
  { name: "University", action: () => alert("Manage University") },
  { name: "Referral Partners", action: () => alert("Manage Referral Partners") },
  { name: "Sub-Admins", action: () => alert("Manage Sub-Admins") },
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
        <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-400 hover:text-green-800 py-2 px-3" onClick={() => setNav_links("home")}>
          <Home size={20} /> Dashboard
        </a>
        <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-400 hover:text-green-800 py-2 px-3" onClick={() => setNav_links("Course")}>
          <BookOpen size={20} /> Courses management
        </a>
        <label htmlFor="">Management : </label>
        <select name="" id="" className="bg-green-400">
          {managementRoles.map((managementRole, index) => (
            <option value={managementRole.name}>{managementRole.name}</option>
          ))}
          </select>
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

      {/* drop down */}
      <div className="flex flex-col gap-2 items-start p-5">

      

        <label htmlFor="">Management : </label>
        <select name="" id="" className="bg-green-400">
          {managementRoles.map((managementRole, index) => (
            <option value={managementRole.name}>{managementRole.name}</option>
          ))}
          </select>

        
      </div>
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

          {/* logic for nav buttons  */}
           {nav_links === "home" ? ("") : ("")}

          <div className="w-full flex bg-orange-500 flex-col justify-center items-center">

              <div className=" w-full  flex gap-5 p-5 bg-red-400">
                    
                    {/* aletr system */}
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
            </div>
           <div className="bg-green-300 w-full p-5 flex justify-center items-center">
            <div className="w-full bg-gray-400 rounded-2xl shadow-2xl flex flex-col gap-5 p-5">
              <div className="flex">
                <span className="font-bold">Platform Management</span>
              </div>
              <div className="flex gap-3">
                {platforms.map((platform, index) => (
                        <PlatformCard key={index} tittle={platform.title} icon={platform.icon}/>
                        ))}
              </div>

            
            </div>
           </div>
              <div className="flex flex-row gap-5 w-[98%]  bg-gray-500 p-5">
                {studentCards.map((studentCard, index) => (
                        <UserManagementCardDesign key={index} title={studentCard.title} subTitle={studentCard.subTitle} icon={studentCard.icon} value={studentCard.value} />
                        ))}
              </div>
              <div className="flex flex-col gap-5 w-[98%]  bg-white p-5 rounded-2xl shadow-2xl">
                <div className="bg-gray-200 flex justify-between items-center text-start p-2 font-bold">
                  <input type="checkbox" />
                  <span className="w-1/4">Name</span>
                  <span className="w-1/6">Phone</span>
                  <span className="w-1/12">Status</span>
                  <span className="w-1/12">Courses</span>
                  <span className="w-1/12">Progress</span>
                  <span className="w-1/12">Last Login</span>
                  <span className="w-1/12">Actions</span>
                </div>
                {userLists.map((userList, index) => (
                        <UserManagementListDesign key={index} name={userList.name} mail={userList.mail} phone={userList.phone} courses={userList.courses} progress_val={userList.progress_val} last_login={userList.last_login} status_title={userList.status_title} status_colour={userList.status_colour}/>
                        ))}
              </div>
          </div>


        </div>

      

      </div>
    </>
  )
}

