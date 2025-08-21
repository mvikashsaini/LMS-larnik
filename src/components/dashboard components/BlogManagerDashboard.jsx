import React, { useState } from "react";

export default function BlogManagerDashboard() {
  // Sample blog posts
  const [blogs, setBlogs] = useState([
    { id: 1, title: "AI in Education", author: "Vikash Saini", status: "Published" },
    { id: 2, title: "Future of LMS", author: "Riya Sharma", status: "Draft" },
    { id: 3, title: "How to Learn Faster", author: "Aman Gupta", status: "Published" },
  ]);

  const [activeTab, setActiveTab] = useState("All");

  // Filter blogs by tab
  const filteredBlogs =
    activeTab === "All"
      ? blogs
      : blogs.filter((blog) => blog.status === activeTab);

  // Handle status change
  const handlePublish = (id) => {
    setBlogs(
      blogs.map((blog) =>
        blog.id === id ? { ...blog, status: "Published" } : blog
      )
    );
  };

  const handleDelete = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Blog Manager Dashboard</h2>

      {/* Tabs */}
      <div className="flex gap-3 mb-4">
        {["All", "Draft", "Published"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Blog Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Title</th>
            <th className="p-3">Author</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBlogs.map((blog) => (
            <tr key={blog.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{blog.title}</td>
              <td className="p-3">{blog.author}</td>
              <td className="p-3">{blog.status}</td>
              <td className="p-3 space-x-2">
                {blog.status === "Draft" && (
                  <button
                    onClick={() => handlePublish(blog.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Publish
                  </button>
                )}
                <button className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add New Blog Button */}
      <div className="mt-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add New Blog
        </button>
      </div>
    </div>
  );
}
