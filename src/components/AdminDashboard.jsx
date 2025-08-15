import React, { useState } from "react";
import {
  Home,
  Users,
  GraduationCap,
  User,
  Building2,
  UserPlus,
  Shield,
  BookOpen,
  Monitor,
  BarChart3,
  FileText,
  Bell,
  DollarSign,
  Layers,
  ChevronDown,
  Sun,
  Globe,
  AlertTriangle,
  UserCheck,
  UserX,
  Plus,
  Import
} from "lucide-react";
import SearchBar from "./SearchBar";
import DashboardCard from "./DashboardCard";
import { div } from "framer-motion/client";
import AlertCard from "./AlertCard";
import UserManagementCardDesign from "./UserManagementCardDesign";
import UserManagementListDesign from "./UserManagementListDesign";
import CourseManagement from "./dashboard omponents/CourseManagement";
import NotificationManagement from "./dashboard omponents/NotificationManagement";

// Sidebar menu structure
const menuItems = [
  { title: "Dashboard", icon: <Home size={18} /> },
  {
    title: "User Management",
    icon: <Users size={18} />,
    children: [
      { title: "Students", icon: <GraduationCap size={16} /> },
      { title: "Teachers", icon: <User size={16} /> },
      { title: "University Staff", icon: <Building2 size={16} /> },
      { title: "Referral Partners", icon: <UserPlus size={16} /> },
      { title: "Sub-Admins", icon: <Shield size={16} /> },
    ],
  },
  { title: "Course Management", icon: <BookOpen size={18} /> },
  {
    title: "Monitoring",
    icon: <Monitor size={18} />,
    children: [
      { title: "Course Monitoring", icon: <BarChart3 size={16} /> },
      { title: "Content Monitoring", icon: <FileText size={16} /> },
    ],
  },
  { title: "Notifications", icon: <Bell size={18} /> },
  { title: "Finance & Settlement", icon: <DollarSign size={18} /> },
  {
    title: "Specialized",
    icon: <Layers size={18} />,
    children: [
      { title: "Special 1", icon: <FileText size={16} /> },
      { title: "Special 2", icon: <FileText size={16} /> },
    ],
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
]

export default function AdminDashboard () {
  // Track expanded sections
  const [openSections, setOpenSections] = useState({});
  // Track active menu item
  const [activeItem, setActiveItem] = useState("Dashboard");

  // Toggle expand/collapse
  const toggleSection = (title) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Handle item click
  const handleItemClick = (item) => {
    setActiveItem(item.title);
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4 overflow-y-auto">
        <div className="text-2xl font-bold border-b-2 p-1 border-gray-600 mb-8">
        <span>Larnik</span>
        </div>
        {menuItems.map((item) => (
          <div key={item.title}>
            {/* Main menu item */}
            <div
              onClick={() => {
                if (item.children) {
                  toggleSection(item.title);
                } else {
                  handleItemClick(item);
                }
              }}
              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                activeItem === item.title ? "bg-blue-50 text-blue-600" : "text-gray-700"
              }`}
            >
              {item.icon}
              <span className="flex-1">{item.title}</span>
              {item.children && (
                <span className="text-xs">{openSections[item.title] ? "▲" : "▼"}</span>
              )}
            </div>

            {/* Submenu items */}
            {item.children && openSections[item.title] && (
              <div className="ml-6 mt-1">
                {item.children.map((child) => (
                  <div
                    key={child.title}
                    onClick={() => handleItemClick(child)}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                      activeItem === child.title ? "bg-blue-50 text-blue-600" : "text-gray-600"
                    }`}
                  >
                    {child.icon}
                    {child.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dynamic Content Area */}
      <div className="flex flex-col overflow-y-auto  w-full items-center">
        {/* dynamic top bar  */}
      <div className="bg-white w-full h-16 flex items-center justify-between px-7">
            <div>
              <SearchBar />
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
        {/* dynamic top bar  */}



        {/* dynamic content area with nav  */}
        {/*debug colour */}
        <div className="w-full flex justify-center items-start bg-white mt-1 p-3 overflow-y-auto">
            {activeItem === "Dashboard" && (
            <div className="w-full flex flex-col gap-5 items-center">

              <div className="w-full flex items-center justify-center">
                <div className="bg-red-600 h-32 rounded-xl w-[98%] flex flex-col items-start justify-center p-5 text-white">
                 <span className="text-2xl font-bold">Admin Control Center 🛡️</span>
                 <span>Monitor and manage the entire platform</span>
                </div>
              </div>

              <div className="flex  w-full px-5 gap-2">
                {card.map((card, index) => (
                  <DashboardCard key={index} title={card.title} icon={card.icon} data={card.data} colour={card.colour}/>
                 ))}
              </div>

            </div>
          )}
        
          {activeItem === "Students" && (
              <div className="flex w-full flex-col">
{/*debug colour */}
                

                        {/* debug color */}
                <div className="flex flex-row gap-5 w-[full]   p-5">
                {studentCards.map((studentCard, index) => (
                        <UserManagementCardDesign key={index} title={studentCard.title} subTitle={studentCard.subTitle} icon={studentCard.icon} value={studentCard.value} />
                        ))}
                </div>

                <div className="flex flex-col gap-5 w-[98%]  bg-white p-5 rounded-2xl shadow-2xl">
                  <div className="flex flex-col ">
                    <div className="flex flex-row justify-between">

                      <div className="flex flex-col items-start">
                        <span className="font-bold">Students List</span>
                        <span>View and manage all students on your platform</span>
                      </div>

                      <div className="flex gap-3">
                        <button className="bg-white rounded-xl shadow-xl border border-black px-2 py-0.5 h-8 hover:bg-green-600">
                          Export
                          </button>
                        <button className="bg-white rounded-xl shadow-xl border border-black px-2 py-0.5 h-8 hover:bg-green-600">
                          Add
                          </button>
                      </div>

                    </div>
                    
                    <div className="flex">
                    <div className="flex gap-10 h-16 items-center ">
                      <SearchBar />
                      <div>
                      <select name="" id="" >
                        <option value="">Active</option>
                        <option value="">pending</option>
                      </select>
                      </div>
                    </div>
                    </div>
                  </div>
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
      
          )}
        
          {activeItem === "Teachers" && (
            <div className="flex w-full flex-col">
            {/*debug colour */}
                            
            
                                    {/* debug color */}
                            <div className="flex flex-row gap-5 w-[full]   p-5">
                            {studentCards.map((studentCard, index) => (
                                    <UserManagementCardDesign key={index} title={studentCard.title} subTitle={studentCard.subTitle} icon={studentCard.icon} value={studentCard.value} />
                                    ))}
                            </div>
            
                            <div className="flex flex-col gap-5 w-[98%]  bg-white p-5 rounded-2xl shadow-2xl">
                              <div className="flex flex-col ">
                                <div className="flex flex-row justify-between">
            
                                  <div className="flex flex-col items-start">
                                    <span className="font-bold">Students List</span>
                                    <span>View and manage all students on your platform</span>
                                  </div>
            
                                  <div className="flex gap-3">
                                    <button className="bg-white rounded-xl shadow-xl border border-black px-2 py-0.5 h-8 hover:bg-green-600">
                                      Export
                                      </button>
                                    <button className="bg-white rounded-xl shadow-xl border border-black px-2 py-0.5 h-8 hover:bg-green-600">
                                      Add
                                      </button>
                                  </div>
            
                                </div>
                                
                                <div className="flex">
                                <div className="flex gap-10 h-16 items-center ">
                                  <SearchBar />
                                  <div>
                                  <select name="" id="" >
                                    <option value="">Active</option>
                                    <option value="">pending</option>
                                  </select>
                                  </div>
                                </div>
                                </div>
                              </div>
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
          )}
        
          {activeItem === "University Staff" && (
            <div className="flex w-full flex-col">
            {/*debug colour */}
                            
            
                                    {/* debug color */}
                            <div className="flex flex-row gap-5 w-[full]   p-5">
                            {studentCards.map((studentCard, index) => (
                                    <UserManagementCardDesign key={index} title={studentCard.title} subTitle={studentCard.subTitle} icon={studentCard.icon} value={studentCard.value} />
                                    ))}
                            </div>
            
                            <div className="flex flex-col gap-5 w-[98%]  bg-white p-5 rounded-2xl shadow-2xl">
                              <div className="flex flex-col ">
                                <div className="flex flex-row justify-between">
            
                                  <div className="flex flex-col items-start">
                                    <span className="font-bold">Students List</span>
                                    <span>View and manage all students on your platform</span>
                                  </div>
            
                                  <div className="flex gap-3">
                                    <button className="bg-white rounded-xl shadow-xl border border-black px-2 py-0.5 h-8 hover:bg-green-600">
                                      Export
                                      </button>
                                    <button className="bg-white rounded-xl shadow-xl border border-black px-2 py-0.5 h-8 hover:bg-green-600">
                                      Add
                                      </button>
                                  </div>
            
                                </div>
                                
                                <div className="flex">
                                <div className="flex gap-10 h-16 items-center ">
                                  <SearchBar />
                                  <div>
                                  <select name="" id="" >
                                    <option value="">Active</option>
                                    <option value="">pending</option>
                                  </select>
                                  </div>
                                </div>
                                </div>
                              </div>
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
          )}
        
          {activeItem === "Referral Partners" && (
            <div className="flex w-full flex-col">
            {/*debug colour */}
                            
            
                                    {/* debug color */}
                            <div className="flex flex-row gap-5 w-[full]   p-5">
                            {studentCards.map((studentCard, index) => (
                                    <UserManagementCardDesign key={index} title={studentCard.title} subTitle={studentCard.subTitle} icon={studentCard.icon} value={studentCard.value} />
                                    ))}
                            </div>
            
                            <div className="flex flex-col gap-5 w-[98%]  bg-white p-5 rounded-2xl shadow-2xl">
                              <div className="flex flex-col ">
                                <div className="flex flex-row justify-between">
            
                                  <div className="flex flex-col items-start">
                                    <span className="font-bold">Students List</span>
                                    <span>View and manage all students on your platform</span>
                                  </div>
            
                                  <div className="flex gap-3">
                                    <button className="bg-white rounded-xl shadow-xl border border-black px-2 py-0.5 h-8 hover:bg-green-600">
                                      Export
                                      </button>
                                    <button className="bg-white rounded-xl shadow-xl border border-black px-2 py-0.5 h-8 hover:bg-green-600">
                                      Add
                                      </button>
                                  </div>
            
                                </div>
                                
                                <div className="flex">
                                <div className="flex gap-10 h-16 items-center ">
                                  <SearchBar />
                                  <div>
                                  <select name="" id="" >
                                    <option value="">Active</option>
                                    <option value="">pending</option>
                                  </select>
                                  </div>
                                </div>
                                </div>
                              </div>
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
          )}
        
          {activeItem === "Sub-Admins" && (
            <div className="flex w-full flex-col">
            {/*debug colour */}
                            
            
                                    {/* debug color */}
                            <div className="flex flex-row gap-5 w-[full]   p-5">
                            {studentCards.map((studentCard, index) => (
                                    <UserManagementCardDesign key={index} title={studentCard.title} subTitle={studentCard.subTitle} icon={studentCard.icon} value={studentCard.value} />
                                    ))}
                            </div>
            
                            <div className="flex flex-col gap-5 w-[98%]  bg-white p-5 rounded-2xl shadow-2xl">
                              <div className="flex flex-col ">
                                <div className="flex flex-row justify-between">
            
                                  <div className="flex flex-col items-start">
                                    <span className="font-bold">Students List</span>
                                    <span>View and manage all students on your platform</span>
                                  </div>
            
                                  <div className="flex gap-3">
                                    <button className="bg-white rounded-xl shadow-xl border border-black px-2 py-0.5 h-8 hover:bg-green-600">
                                      Export
                                      </button>
                                    <button className="bg-white rounded-xl shadow-xl border border-black px-2 py-0.5 h-8 hover:bg-green-600">
                                      Add
                                      </button>
                                  </div>
            
                                </div>
                                
                                <div className="flex">
                                <div className="flex gap-10 h-16 items-center ">
                                  <SearchBar />
                                  <div>
                                  <select name="" id="" >
                                    <option value="">Active</option>
                                    <option value="">pending</option>
                                  </select>
                                  </div>
                                </div>
                                </div>
                              </div>
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
          )}
        
          {activeItem === "Course Management" && (
            <div className="flex w-full flex-col">
              {/* <h1 className="text-2xl font-bold mb-4">Course Management</h1>
              <p>Create, edit, and manage all courses.</p> */}
              <CourseManagement />
            </div>
          )}
        
          {activeItem === "Course Monitoring" && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Course Monitoring</h1>
              <p>Monitor course progress and completion rates.</p>
            </div>
          )}
        
          {activeItem === "Content Monitoring" && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Content Monitoring</h1>
              <p>Review and approve course content.</p>
            </div>
          )}
        
          {activeItem === "Notifications" && (
            <div className="flex w-full flex-col">
              {/* <h1 className="text-2xl font-bold mb-4">Notifications</h1>
              <p>Manage system and user notifications.</p> */}
              <NotificationManagement />
            </div>
          )}
        
          {activeItem === "Finance & Settlement" && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Finance & Settlement</h1>
              <p>View and process financial transactions and settlements.</p>
            </div>
          )}
        
          {activeItem === "Special 1" && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Special 1</h1>
              <p>Custom specialized feature 1 page.</p>
            </div>
          )}
        
          {activeItem === "Special 2" && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Special 2</h1>
              <p>Custom specialized feature 2 page.</p>
            </div>
          )}

        </div>
        {/* dynamic content area with nav  */}

      </div>

                


    </div>
  )
  
}

