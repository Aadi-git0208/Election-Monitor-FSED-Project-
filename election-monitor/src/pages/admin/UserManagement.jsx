import React, { useState, useEffect } from "react";
import "./UserManagement.css";

const getUserImage = (user) => {
  return (
    user?.profileImage ||
    user?.profilePic ||
    user?.image ||
    user?.avatar ||
    "/default-profile.svg"
  );
};

const syncUsersToElectionSystem = (users) => {
  const systemData =
    JSON.parse(localStorage.getItem("electionSystem")) || {
      users: [],
      elections: [],
      reports: [],
      notifications: [],
    };

  localStorage.setItem(
    "electionSystem",
    JSON.stringify({
      ...systemData,
      users,
    })
  );
};

function UserManagement({ onUsersUpdated }) {
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
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        syncUsersToElectionSystem(data);
        onUsersUpdated?.();
      });
  }, [onUsersUpdated]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewUser((prev) => ({
        ...prev,
        profileImage: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddUser = async () => {
    if (!newUser.fullName || !newUser.email || !newUser.password) {
      alert("Please fill all required fields");
      return;
    }

    const response = await fetch("http://localhost:8080/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: newUser.fullName,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        profileImage: newUser.profileImage || "/default-profile.svg",
        blocked: false,
      }),
    });

    const data = await response.json();

    setUsers((prev) => {
      const updatedUsers = [...prev, data];
      syncUsersToElectionSystem(updatedUsers);
      onUsersUpdated?.();
      return updatedUsers;
    });

    setShowModal(false);
    setNewUser({
      fullName: "",
      email: "",
      role: "citizen",
      profileImage: "",
      password: "",
    });
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await fetch(`http://localhost:8080/api/users/${id}`, {
      method: "DELETE",
    });

    setUsers((prev) => {
      const updatedUsers = prev.filter((u) => u.id !== id);
      syncUsersToElectionSystem(updatedUsers);
      onUsersUpdated?.();
      return updatedUsers;
    });
  };

  const toggleBlock = (id) => {
    setUsers((prev) => {
      const updatedUsers = prev.map((u) =>
        u.id === id ? { ...u, blocked: !u.blocked } : u
      );
      syncUsersToElectionSystem(updatedUsers);
      onUsersUpdated?.();
      return updatedUsers;
    });
  };

  const changeRole = (id, newRole) => {
    setUsers((prev) => {
      const updatedUsers = prev.map((u) =>
        u.id === id ? { ...u, role: newRole } : u
      );
      syncUsersToElectionSystem(updatedUsers);
      onUsersUpdated?.();
      return updatedUsers;
    });
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
          <div className="user-card" key={user.id}>
            <img
              src={getUserImage(user)}
              alt="profile"
              className="card-img"
            />
            <h3>{user.fullName || user.name || "User"}</h3>
            <p className="email">{user.email}</p>

            <select
              value={user.role}
              onChange={(e) =>
                changeRole(user.id, e.target.value)
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
                onClick={() => toggleBlock(user.id)}
              >
                {user.blocked ? "Unblock" : "Block"}
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteUser(user.id)}
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