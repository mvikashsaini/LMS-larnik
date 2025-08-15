import React, { useState } from "react";
import { Eye, X, Check, Star, Users, BookOpen, Play, Clock, DollarSign } from "lucide-react";
import UserManagementCardDesign from "../UserManagementCardDesign";

export default function CourseManagement() {
  // State for active tab
  const [activeTab, setActiveTab] = useState("all");

  // Tabs
  const tabs = [
    { id: "all", label: "All Courses" },
    { id: "pending", label: "Pending Approval" },
    { id: "analytics", label: "Analytics" },
    { id: "categories", label: "Categories" },
  ];

  // Courses data
  const courses = [
    {
      title: "Complete React Development Course",
      lessons: 85,
      hours: 42,
      instructor: "Dr. Sarah Miller",
      category: "Web Development",
      price: 99,
      students: 1204,
      rating: 4.8,
      status: "active",
      revenue: 119196,
    },
    {
      title: "Advanced JavaScript Patterns",
      lessons: 52,
      hours: 28,
      instructor: "Prof. Michael Brown",
      category: "Programming",
      price: 149,
      students: 567,
      rating: 4.6,
      status: "pending",
      revenue: 84483,
    },
    {
      title: "UI/UX Design Fundamentals",
      lessons: 68,
      hours: 35,
      instructor: "Emma Thompson",
      category: "Design",
      price: 79,
      students: 892,
      rating: 4.7,
      status: "active",
      revenue: 70468,
    },
    {
      title: "Python for Data Science",
      lessons: 78,
      hours: 45,
      instructor: "Dr. James Wilson",
      category: "Data Science",
      price: 129,
      students: 234,
      rating: 4.5,
      status: "review",
      revenue: 30186,
    },
    {
      title: "Mobile App Development",
      lessons: 61,
      hours: 38,
      instructor: "Lisa Rodriguez",
      category: "Mobile Development",
      price: 119,
      students: 445,
      rating: 4.4,
      status: "inactive",
      revenue: 52955,
    },
  ];

  // Categories data
  const categories = [
    { name: "Web Development", count: 50 },
    { name: "Programming", count: 8 },
    { name: "Design", count: 31 },
    { name: "Data Science", count: 31 },
    { name: "Mobile Development", count: 39 },
    { name: "Business", count: 51 },
  ]

  const studentCards = [
    {
      title : "Total Courses",
      icon : BookOpen,
      subTitle : "+12 This month",
      value : "189",
    },
    {
      title : "Active",
      icon : Play,
      subTitle : "5.2% active rate",
      value : "156",
    },
    {
      title : "Pending Review",
      icon : Clock,
      subTitle : "Awaiting Approwal",
      value : "8",
    },
    {
      title : "Total Revenue",
      icon : DollarSign,
      subTitle : "+18% this month",
      value : "$357k",
    },
    {
      title : "Avg Rating",
      icon : Star,
      subTitle : "Across all courses",
      value : "4.6",
    },
  ]


  // Filter for pending courses
  const pendingCourses = [];
  for (let i = 0; i < courses.length; i++) {
    if (courses[i].status === "pending" || courses[i].status === "review") {
      pendingCourses.push(courses[i]);
    }
  }

  // Find max category count (for analytics bar width)
  let maxCategoryCount = 0;
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].count > maxCategoryCount) {
      maxCategoryCount = categories[i].count;
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* cards view  */}
              <div className="flex flex-row gap-5 w-[full]   p-5">
                              {studentCards.map((studentCard, index) => (
                                      <UserManagementCardDesign key={index} title={studentCard.title} subTitle={studentCard.subTitle} icon={studentCard.icon} value={studentCard.value} />
                                      
                                    ))}
                              </div>
              {/* cards view  */}
      {/* Tab buttons */}
      <div className="flex space-x-2 bg-gray-100 rounded-full p-1 w-fit mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab.id ? "bg-white shadow" : "text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* All Courses Tab */}
      {activeTab === "all" && (
        <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
          <h2 className="font-semibold text-lg mb-4">All Courses</h2>
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b">
                <th className="py-2">Course</th>
                <th>Instructor</th>
                <th>Category</th>
                <th>Price</th>
                <th>Students</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  {/* Course Title */}
                  <td className="py-2">
                    <div className="font-medium">{course.title}</div>
                    <div className="text-sm text-gray-500">
                      {course.lessons} lessons • {course.hours} hours
                    </div>
                  </td>

                  {/* Instructor */}
                  <td>{course.instructor}</td>

                  {/* Category */}
                  <td>
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                      {course.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td>${course.price}</td>

                  {/* Students */}
                  <td>
                    <div className="flex items-center gap-1">
                      <Users size={14} /> {course.students}
                    </div>
                  </td>

                  {/* Rating */}
                  <td>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500" />{" "}
                      {course.rating}
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs capitalize ${
                        course.status === "active"
                          ? "bg-green-100 text-green-700"
                          : course.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : course.status === "review"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>

                  {/* Revenue */}
                  <td>${course.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pending Approval Tab */}
      {activeTab === "pending" && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-lg mb-4">Pending Course Approvals</h2>
          {pendingCourses.map((course, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b py-4 flex-wrap gap-4 text-start"
            >
              <div>
                <div className="font-medium">{course.title}</div>
                <div className="text-sm text-gray-500">
                  {course.category} • {course.lessons} lessons • {course.hours} hours • ${course.price}
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-gray-100 rounded flex items-center gap-1">
                  <Eye size={14} /> Preview
                </button>
                <button className="px-3 py-1 bg-red-100 text-red-700 rounded flex items-center gap-1">
                  <X size={14} /> Reject
                </button>
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded flex items-center gap-1">
                  <Check size={14} /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Courses */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold text-lg mb-4">Top Performing Courses</h2>
            {courses.map((course, index) => (
              <div key={index} className="flex justify-between py-2 border-b">
                <div>
                  <div className="font-medium">{course.title}</div>
                  <div className="text-sm text-gray-500 text-start">
                    {course.students} students
                  </div>
                </div>
                <div className="font-medium">${course.revenue.toLocaleString()}</div>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold text-lg mb-4">Course Categories</h2>
            {categories.map((cat, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between text-sm">
                  <span>{cat.name}</span>
                  <span>{cat.count} courses</span>
                </div>
                <div className="w-full bg-gray-200 rounded h-2 mt-1">
                  <div
                    className="bg-black h-2 rounded"
                    style={{
                      width: (cat.count / maxCategoryCount) * 100 + "%",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-lg mb-2">Course Categories</h2>
          <p className="text-sm text-gray-500 mb-4">
            Manage course categories and subcategories
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div className="text-start">
                  <div className="font-medium">{cat.name}</div>
                  <div className="text-sm text-gray-500">
                    {cat.count} courses
                  </div>
                </div>
                <span className="text-gray-400">•••</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
