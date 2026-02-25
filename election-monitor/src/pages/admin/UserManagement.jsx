import React, { useState } from "react";
import "./UserManagement.css";

function UserManagement() {

  const [users, setUsers] = useState(() => {
    return JSON.parse(localStorage.getItem("users")) || [];
  });

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const [showModal, setShowModal] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "citizen",
    image: "",
  });

  /* ================= UPDATE STORAGE ================= */

  const updateStorage = (updatedUsers) => {
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  /* ================= ADD USER ================= */

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      alert("Please fill all fields");
      return;
    }

    const userExists = users.find(u => u.email === newUser.email);
    if (userExists) {
      alert("User already exists!");
      return;
    }

    const userToAdd = {
      ...newUser,
      password: "123456", // default password
      blocked: false,
    };

    const updated = [...users, userToAdd];
    updateStorage(updated);

    setShowModal(false);
    setNewUser({ name: "", email: "", role: "citizen", image: "" });
  };

  /* ================= DELETE ================= */

  const deleteUser = (email) => {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;

    const updated = users.filter(user => user.email !== email);
    updateStorage(updated);
  };

  /* ================= BLOCK ================= */

  const toggleBlock = (email) => {
    const updated = users.map(user =>
      user.email === email
        ? { ...user, blocked: !user.blocked }
        : user
    );
    updateStorage(updated);
  };

  /* ================= CHANGE ROLE ================= */

  const changeRole = (email, newRole) => {
    const updated = users.map(user =>
      user.email === email
        ? { ...user, role: newRole }
        : user
    );
    updateStorage(updated);
  };

  /* ================= FILTER ================= */

  const filteredUsers = users
    .filter(user =>
      user.name?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(user =>
      filterRole === "all" ? true : user.role === filterRole
    );

  return (
    <div className="user-management">
      <div className="header-row">
        <h2>User Management</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add New User
        </button>
      </div>

      {/* Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="citizen">Citizen</option>
          <option value="observer">Observer</option>
          <option value="analyst">Analyst</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.email}>
              <td>
                <img
                  src={user.image || "/default-profile.png"}
                  alt="profile"
                  className="user-img"
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>

              <td>
                <select
                  value={user.role}
                  onChange={(e) =>
                    changeRole(user.email, e.target.value)
                  }
                >
                  <option value="citizen">Citizen</option>
                  <option value="observer">Observer</option>
                  <option value="analyst">Analyst</option>
                  <option value="admin">Admin</option>
                </select>
              </td>

              <td>
                {user.blocked ? (
                  <span className="blocked">Blocked</span>
                ) : (
                  <span className="active">Active</span>
                )}
              </td>

              <td>
                <button
                  className="block-btn"
                  onClick={() => toggleBlock(user.email)}
                >
                  {user.blocked ? "Unblock" : "Block"}
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteUser(user.email)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New User</h3>

            <input
              type="text"
              placeholder="Full Name"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />

            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
            >
              <option value="citizen">Citizen</option>
              <option value="observer">Observer</option>
              <option value="analyst">Analyst</option>
              <option value="admin">Admin</option>
            </select>

            <div className="modal-buttons">
              <button onClick={handleAddUser} className="save-btn">
                Save
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;