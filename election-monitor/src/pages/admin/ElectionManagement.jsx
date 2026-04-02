import React, { useCallback, useState, useEffect } from "react";
import "./ElectionManagement.css";

function ElectionManagement() {

  const [elections, setElections] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [newElection, setNewElection] = useState({
    title: "",
    startDate: "",
    endDate: "",
    candidates: "",
    observers: "",
    active: false,
  });

  // 🔥 FETCH ELECTIONS
  const fetchElections = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8080/api/elections/all");
      const data = await res.json();
      setElections(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const kickoff = setTimeout(() => {
      void fetchElections();
    }, 0);

    return () => clearTimeout(kickoff);
  }, [fetchElections]);

  // 🔥 CREATE ELECTION
  const handleCreate = async () => {
    if (!newElection.title || !newElection.startDate || !newElection.endDate) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await fetch("http://localhost:8080/api/elections/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newElection.title,
          startDate: newElection.startDate,
          endDate: newElection.endDate,
          active: false,
        }),
      });

      setShowModal(false);
      fetchElections();

      setNewElection({
        title: "",
        startDate: "",
        endDate: "",
        candidates: "",
        observers: "",
        active: false,
      });

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 ACTIVATE / DEACTIVATE
  const toggleActive = async (id) => {
    await fetch(`http://localhost:8080/api/elections/toggle/${id}`, {
      method: "PUT",
    });

    fetchElections();
  };

  // 🔥 DELETE
  const deleteElection = async (id) => {
    if (!window.confirm("Delete this election?")) return;

    await fetch(`http://localhost:8080/api/elections/${id}`, {
      method: "DELETE",
    });

    fetchElections();
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
          {elections.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">
                No Elections Found
              </td>
            </tr>
          ) : (
            elections.map((election) => (
              <tr key={election.id}>

                <td>{election.title}</td>
                <td>{election.startDate}</td>
                <td>{election.endDate}</td>

                <td>-</td>
                <td>-</td>

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
            ))
          )}
        </tbody>
      </table>

      {/* MODAL SAME UI */}
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