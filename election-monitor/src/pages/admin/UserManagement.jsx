import React, { useCallback, useState, useEffect } from "react";
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

  // 🔥 FETCH USERS FROM BACKEND
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("https://your-backend.up.railway.app/api/users/all");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const kickoff = setTimeout(() => {
      void fetchUsers();
      onUsersUpdated?.();
    }, 0);

    return () => clearTimeout(kickoff);
  }, [fetchUsers, onUsersUpdated]);

  // 🔥 IMAGE UPLOAD (UI SAME)
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

  // 🔥 ADD USER (BACKEND)
  const handleAddUser = async () => {
    if (!newUser.fullName || !newUser.email || !newUser.password) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await fetch("https://your-backend.up.railway.app/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: newUser.fullName,
          email: newUser.email.toLowerCase(),
          password: newUser.password,
          role: newUser.role.toUpperCase(),
        }),
      });

      setShowModal(false);
      fetchUsers();

      setNewUser({
        fullName: "",
        email: "",
        role: "citizen",
        profileImage: "",
        password: "",
      });

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 DELETE USER
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await fetch(`https://your-backend.up.railway.app/api/users/${id}`, {
      method: "DELETE",
    });

    fetchUsers();
  };

  // 🔥 BLOCK / UNBLOCK
  const toggleBlock = async (id) => {
    await fetch(`https://your-backend.up.railway.app/api/users/block/${id}`, {
      method: "PUT",
    });

    fetchUsers();
  };

  // 🔥 CHANGE ROLE
  const changeRole = async (id, role) => {
    await fetch(
      `https://your-backend.up.railway.app/api/users/role/${id}?role=${role}`,
      {
        method: "PUT",
      }
    );

    fetchUsers();
  };

  // 🔥 FILTER (UI SAME)
  const filteredUsers = users
    .filter((u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((u) =>
      filterRole === "all"
        ? true
        : u.role?.toLowerCase() === filterRole
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

            <h3>{user.fullName}</h3>
            <p className="email">{user.email}</p>

            <select
              value={user.role?.toLowerCase()}
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

      {/* MODAL SAME UI */}
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

            <input type="file" accept="image/*" onChange={handleImageUpload} />

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