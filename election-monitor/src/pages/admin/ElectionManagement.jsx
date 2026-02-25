import React, { useState } from "react";
import "./ElectionManagement.css";

function ElectionManagement() {

  const getSystemData = () => {
    return JSON.parse(localStorage.getItem("electionSystem")) || {
      users: [],
      elections: [],
      reports: [],
      notifications: [],
    };
  };

  const [elections, setElections] = useState(() => {
    const systemData = getSystemData();
    return systemData.elections || [];
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

  const updateStorage = (updatedElections) => {
    const systemData = getSystemData();
    systemData.elections = updatedElections;

    localStorage.setItem(
      "electionSystem",
      JSON.stringify(systemData)
    );

    setElections(updatedElections);
  };

  const handleCreate = () => {
    if (!newElection.title || !newElection.startDate || !newElection.endDate) {
      alert("Please fill all required fields");
      return;
    }

    const formattedElection = {
      id: Date.now(),
      ...newElection,
      candidates: newElection.candidates
        .split(",")
        .map((c) => c.trim()),
      observers: newElection.observers
        .split(",")
        .map((o) => o.trim()),
      active: false,
      createdAt: new Date().toLocaleDateString(),
    };

    const updated = [...elections, formattedElection];
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

  const toggleActive = (id) => {
    const updated = elections.map((election) =>
      election.id === id
        ? { ...election, active: !election.active }
        : election
    );

    updateStorage(updated);
  };

  const deleteElection = (id) => {
    const updated = elections.filter(
      (election) => election.id !== id
    );

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
          {elections.map((election) => (
            <tr key={election.id}>
              <td>{election.title}</td>
              <td>{election.startDate}</td>
              <td>{election.endDate}</td>
              <td>
                {Array.isArray(election.candidates)
                  ? election.candidates.join(", ")
                  : election.candidates}
              </td>
              <td>
                {Array.isArray(election.observers)
                  ? election.observers.join(", ")
                  : election.observers}
              </td>
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
                  onClick={() => toggleActive(election.id)}
                >
                  {election.active ? "Deactivate" : "Activate"}
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteElection(election.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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