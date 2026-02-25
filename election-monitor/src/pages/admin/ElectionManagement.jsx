import React, { useState } from "react";
import "./ElectionManagement.css";

function ElectionManagement() {

  const [elections, setElections] = useState(() => {
    return JSON.parse(localStorage.getItem("elections")) || [];
  });

  const [showModal, setShowModal] = useState(false);

  const [newElection, setNewElection] = useState({
    title: "",
    startDate: "",
    endDate: "",
    candidates: "",
    observers: "",
    active: false,
  });

  const updateStorage = (updated) => {
    localStorage.setItem("elections", JSON.stringify(updated));
    setElections(updated);
  };

  const handleCreate = () => {
    if (!newElection.title || !newElection.startDate || !newElection.endDate) {
      alert("Please fill all required fields");
      return;
    }

    const updated = [...elections, newElection];
    updateStorage(updated);

    setShowModal(false);
    setNewElection({
      title: "",
      startDate: "",
      endDate: "",
      candidates: "",
      observers: "",
      active: false,
    });
  };

  const toggleActive = (index) => {
    const updated = elections.map((election, i) =>
      i === index ? { ...election, active: !election.active } : election
    );
    updateStorage(updated);
  };

  const deleteElection = (index) => {
    const updated = elections.filter((_, i) => i !== index);
    updateStorage(updated);
  };

  return (
    <div className="election-management">

      <div className="header-row">
        <h2>Election Management</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Create New Election
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Start</th>
            <th>End</th>
            <th>Candidates</th>
            <th>Observers</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {elections.map((election, index) => (
            <tr key={index}>
              <td>{election.title}</td>
              <td>{election.startDate}</td>
              <td>{election.endDate}</td>
              <td>{election.candidates}</td>
              <td>{election.observers}</td>
              <td>
                {election.active ? (
                  <span className="active">Active</span>
                ) : (
                  <span className="inactive">Inactive</span>
                )}
              </td>
              <td>
                <button
                  className="activate-btn"
                  onClick={() => toggleActive(index)}
                >
                  {election.active ? "Deactivate" : "Activate"}
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteElection(index)}
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
            <h3>Create New Election</h3>

            <input
              type="text"
              placeholder="Election Title"
              value={newElection.title}
              onChange={(e) =>
                setNewElection({ ...newElection, title: e.target.value })
              }
            />

            <label>Start Date</label>
            <input
              type="date"
              value={newElection.startDate}
              onChange={(e) =>
                setNewElection({ ...newElection, startDate: e.target.value })
              }
            />

            <label>End Date</label>
            <input
              type="date"
              value={newElection.endDate}
              onChange={(e) =>
                setNewElection({ ...newElection, endDate: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Candidate List (comma separated)"
              value={newElection.candidates}
              onChange={(e) =>
                setNewElection({ ...newElection, candidates: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Assign Observers (comma separated)"
              value={newElection.observers}
              onChange={(e) =>
                setNewElection({ ...newElection, observers: e.target.value })
              }
            />

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleCreate}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
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

export default ElectionManagement;