import React, { useState, useEffect } from "react";
import "./UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    role: "citizen",
    profileImage: "",
  });

  /* ================= LOAD USERS ================= */

  useEffect(() => {
    const loadUsers = () => {
      const systemData =
        JSON.parse(localStorage.getItem("electionSystem")) || {
          users: [],
          elections: [],
          reports: [],
          notifications: [],
        };

      setUsers(systemData.users || []);
    };

    loadUsers();

    const interval = setInterval(loadUsers, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ================= UPDATE STORAGE ================= */

  const updateStorage = (updatedUsers) => {
    const systemData =
      JSON.parse(localStorage.getItem("electionSystem")) || {
        users: [],
        elections: [],
        reports: [],
        notifications: [],
      };

    systemData.users = updatedUsers;

    localStorage.setItem("electionSystem", JSON.stringify(systemData));
    setUsers(updatedUsers);
  };

  /* ================= ADD USER ================= */

  const handleAddUser = () => {
    if (!newUser.fullName || !newUser.email) {
      alert("Please fill all fields");
      return;
    }

    const userExists = users.find(
      (u) => u.email.toLowerCase() === newUser.email.toLowerCase()
    );

    if (userExists) {
      alert("User already exists!");
      return;
    }

    const userToAdd = {
      id: Date.now(),
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      password: "123456",
      profileImage: newUser.profileImage || "/default-profile.png",
      blocked: false,
    };

    const updated = [...users, userToAdd];
    updateStorage(updated);

    setShowModal(false);
    setNewUser({
      fullName: "",
      email: "",
      role: "citizen",
      profileImage: "",
    });
  };

  /* ================= DELETE ================= */

  const deleteUser = (email) => {
    if (!window.confirm("Delete this user?")) return;

    const updated = users.filter((user) => user.email !== email);
    updateStorage(updated);
  };

  /* ================= BLOCK ================= */

  const toggleBlock = (email) => {
    const updated = users.map((user) =>
      user.email === email
        ? { ...user, blocked: !user.blocked }
        : user
    );
    updateStorage(updated);
  };

  /* ================= CHANGE ROLE ================= */

  const changeRole = (email, newRole) => {
    const updated = users.map((user) =>
      user.email === email
        ? { ...user, role: newRole }
        : user
    );
    updateStorage(updated);
  };

  /* ================= FILTER ================= */

  const filteredUsers = users
    .filter((user) =>
      user.fullName?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((user) =>
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
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No Users Found
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user.email}>
                <td>
                  <img
                    src={user.profileImage || "/default-profile.png"}
                    alt="profile"
                    className="user-img"
                  />
                </td>

                <td>{user.fullName}</td>
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
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New User</h3>

            <input
              type="text"
              placeholder="Full Name"
              value={newUser.fullName}
              onChange={(e) =>
                setNewUser({ ...newUser, fullName: e.target.value })
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