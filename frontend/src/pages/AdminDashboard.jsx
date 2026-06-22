import { useEffect, useState } from "react";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5000/api/admin";

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0,
  });

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");

    if (!isAdmin) {
      alert("Unauthorized Access");
      window.location.reload();
      return;
    }

    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/candidates`
      );

      const data = await response.json();

      setCandidates(data);

      setStats({
        total: data.length,
        pending: data.filter(
          (c) => c.application_status === "Pending"
        ).length,
        shortlisted: data.filter(
          (c) => c.application_status === "Shortlisted"
        ).length,
        rejected: data.filter(
          (c) => c.application_status === "Rejected"
        ).length,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to load candidates.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${API_URL}/candidates/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      await fetchCandidates();

      setSelectedCandidate((prev) =>
        prev
          ? {
              ...prev,
              application_status: status,
            }
          : prev
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update status.");
    }
  };

  const logout = () => {
    localStorage.removeItem("isAdmin");
    window.location.reload();
  };

  const filteredCandidates = candidates.filter((candidate) =>
    `${candidate.full_name}
     ${candidate.email}
     ${candidate.application_number}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <div className="header">
        <div>
          <h1>MLSC Recruitment Dashboard</h1>
          <p>Manage Recruitment Applications</p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button
            onClick={fetchCandidates}
            style={{ width: "auto" }}
          >
            Refresh
          </button>

          <button
            onClick={logout}
            style={{ width: "auto" }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{stats.total}</p>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <p>{stats.pending}</p>
        </div>

        <div className="stat-card">
          <h3>Shortlisted</h3>
          <p>{stats.shortlisted}</p>
        </div>

        <div className="stat-card">
          <h3>Rejected</h3>
          <p>{stats.rejected}</p>
        </div>
      </div>

      {loading ? (
        <h2>Loading Candidates...</h2>
      ) : (
        <div className="cards-container">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="applicant-card"
              onClick={() =>
                setSelectedCandidate(candidate)
              }
            >
              <div className="profile">
                <div className="avatar">
                  {candidate.full_name
                    ?.split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div>
                  <h2>{candidate.full_name}</h2>
                  <p>{candidate.email}</p>
                </div>
              </div>

              <div className="tags">
                <span className="tag technical">
                  {candidate.primary_department}
                </span>

                <span
                  className={`status ${
                    candidate.application_status?.toLowerCase()
                  }`}
                >
                  {candidate.application_status}
                </span>
              </div>

              <div className="info">
                <p>
                  App No:{" "}
                  {candidate.application_number}
                </p>

                <p>
                  Primary:{" "}
                  {candidate.primary_department}
                </p>
              </div>

              <button>
                View Application
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedCandidate && (
        <div className="drawer open">
          <span
            className="close"
            onClick={() =>
              setSelectedCandidate(null)
            }
          >
            ×
          </span>

          <div className="drawer-profile">
            <div className="big-avatar">
              {selectedCandidate.full_name
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </div>

            <h1>
              {selectedCandidate.full_name}
            </h1>

            <p>{selectedCandidate.email}</p>
          </div>

          <div className="details">
            <h4>Application Number</h4>
            <p>
              {
                selectedCandidate.application_number
              }
            </p>

            <h4>Date Of Birth</h4>
            <p>
              {selectedCandidate.date_of_birth}
            </p>

            <h4>Attendance</h4>
            <p>{selectedCandidate.attendance}</p>

            <h4>Why MLSC?</h4>
            <p>{selectedCandidate.join_reason}</p>

            <h4>Primary Department</h4>
            <p>
              {
                selectedCandidate.primary_department
              }
            </p>

            <h4>Secondary Department</h4>
            <p>
              {
                selectedCandidate.secondary_department
              }
            </p>

            <h4>Other Societies</h4>
            <p>
              {
                selectedCandidate.other_societies
              }
            </p>

            <h4>
              Why Should We Recruit You?
            </h4>
            <p>
              {selectedCandidate.recruit_reason}
            </p>

            <h4>Current Status</h4>
            <p>
              {
                selectedCandidate.application_status
              }
            </p>
          </div>

          <div className="actions">
            <button
              className="accept"
              onClick={() =>
                updateStatus(
                  selectedCandidate.id,
                  "Shortlisted"
                )
              }
            >
              Shortlist
            </button>

            <button
              className="reject"
              onClick={() =>
                updateStatus(
                  selectedCandidate.id,
                  "Rejected"
                )
              }
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}