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
    password: "",
  });

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setNewUser({
      ...newUser,
      profileImage: imageUrl,
    });
  };

  const handleAddUser = () => {
    if (!newUser.fullName || !newUser.email || !newUser.password) {
      alert("Please fill all required fields");
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
      password: newUser.password,
      profileImage: "/default-profile.png",
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
      password: "",
    });
  };

  const deleteUser = (email) => {
    if (!window.confirm("Delete this user?")) return;
    updateStorage(users.filter((u) => u.email !== email));
  };

  const toggleBlock = (email) => {
    updateStorage(
      users.map((u) =>
        u.email === email ? { ...u, blocked: !u.blocked } : u
      )
    );
  };

  const changeRole = (email, newRole) => {
    updateStorage(
      users.map((u) =>
        u.email === email ? { ...u, role: newRole } : u
      )
    );
  };

  const filteredUsers = users
    .filter((u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((u) =>
      filterRole === "all" ? true : u.role === filterRole
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

      <div className="card-container">
        {filteredUsers.map((user) => (
          <div className="user-card" key={user.email}>
            <img
              src={user.profileImage}
              alt="profile"
              className="card-img"
            />
            <h3>{user.fullName}</h3>
            <p className="email">{user.email}</p>

            <select
              value={user.role}
              onChange={(e) =>
                changeRole(user.email, e.target.value)
              }
              className="role-select"
            >
              <option value="citizen">Citizen</option>
              <option value="observer">Observer</option>
              <option value="analyst">Analyst</option>
              <option value="admin">Admin</option>
            </select>

            <p className={user.blocked ? "blocked" : "active"}>
              {user.blocked ? "Blocked" : "Active"}
            </p>

            <div className="card-buttons">
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
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New User</h3>

            {newUser.profileImage && (
              <img
                src={newUser.profileImage}
                alt="preview"
                className="preview-img"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />

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

            <input
              type="password"
              placeholder="Default Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
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