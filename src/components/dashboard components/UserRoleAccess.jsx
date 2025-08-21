import React, { useState } from "react";

export default function UserRoleAccess() {
  // Sample user data
  const [users, setUsers] = useState([
    { id: 1, name: "Vikash Saini", email: "vikash@lms.com", role: "Sub Admin", password: "12345" },
    { id: 2, name: "Anjali Sharma", email: "anjali@lms.com", role: "Finance", password: "pass123" },
    { id: 3, name: "Rahul Kumar", email: "rahul@lms.com", role: "Blog", password: "abc123" },
  ]);

  // Available roles
  const roles = ["Sub Admin", "Finance", "Governance", "Blog"];

  // Role access mapping
  const roleAccess = {
    "Sub Admin": ["Manage Users", "View Reports"],
    Finance: ["Payments", "Invoices", "Reports"],
    Governance: ["MOU Approval", "Policy Management"],
    Blog: ["Add Blog", "Edit Blog", "Delete Blog"],
  };

  // Form states
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Sub Admin",
  });

  // Handle role change
  const handleRoleChange = (id, newRole) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, role: newRole } : user
      )
    );
  };

  // Add new user
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Please fill all fields!");
      return;
    }
    setUsers([
      ...users,
      { id: users.length + 1, ...newUser },
    ]);
    // reset form
    setNewUser({ name: "", email: "", password: "", role: "Sub Admin" });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">User & Role Management</h2>

      {/* Add User Form */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Add New User</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border p-2 rounded"
          >
            {roles.map((role, idx) => (
              <option key={idx} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddUser}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Users Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Access</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="border p-1 rounded"
                >
                  {roles.map((role, idx) => (
                    <option key={idx} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-3 text-sm">
                {roleAccess[user.role].map((access, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-200 text-gray-800 px-2 py-1 m-1 rounded text-xs"
                  >
                    {access}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
