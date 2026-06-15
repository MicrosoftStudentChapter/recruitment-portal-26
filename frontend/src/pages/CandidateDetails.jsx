import { useState } from "react";
import MLSCLogo from "../assets/MLSC-logo.png";
import "../App.css";

export default function CandidateDetails({ registrationData, onBackToSignup }) {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [email, setEmail] = useState(registrationData?.email ?? "");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [attendance, setAttendance] = useState("");
  const [joinReason, setJoinReason] = useState("");
  const [primaryDepartment, setPrimaryDepartment] = useState("");
  const [secondaryDepartment, setSecondaryDepartment] = useState("");
  const [otherSocieties, setOtherSocieties] = useState("");
  const [recruitReason, setRecruitReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Candidate details:", {
      applicationNumber,
      email,
      name,
      dob,
      attendance,
      joinReason,
      primaryDepartment,
      secondaryDepartment,
      otherSocieties,
      recruitReason,
    });
  };

  return (
    <main className="auth-page candidate-page">
      <section
        className="auth-panel candidate-panel"
        aria-labelledby="candidate-title"
      >
        <div className="panel-header">
          <img className="panel-logo" src={MLSCLogo} alt="MLSC logo" />
          <h2 id="candidate-title">Candidate details</h2>
          <p className="panel-copy">
            Complete the profile information needed for the recruitment process.
          </p>
        </div>

        <form className="auth-form candidate-form" onSubmit={handleSubmit}>
          <div className="details-grid">
            <div className="form-group">
              <label htmlFor="candidate-name">Name</label>
              <input
                id="candidate-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="candidate-email">Email</label>
              <input
                id="candidate-email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="application-number">Application Number</label>
              <input
                id="application-number"
                type="text"
                placeholder="Enter application number"
                value={applicationNumber}
                onChange={(e) => setApplicationNumber(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="attendance">
                Did you attended the Tech meet and Society fair?
              </label>
              <select
                id="attendance"
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
              >
                <option value="">Select one option</option>
                <option value="only-soc-fair">Only Society fair</option>
                <option value="only-tech-meet">Only Tech meet</option>
                <option value="both">Both</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="join-reason">Why do you want to join MLSC?</label>
            <textarea
              id="join-reason"
              rows="4"
              placeholder="Write your reason"
              value={joinReason}
              onChange={(e) => setJoinReason(e.target.value)}
            />
          </div>

          <div className="details-grid">
            <div className="form-group">
              <label htmlFor="primary-department">
                Your Primary Department
              </label>
              <input
                id="primary-department"
                type="text"
                placeholder="Enter primary department"
                value={primaryDepartment}
                onChange={(e) => setPrimaryDepartment(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="secondary-department">
                Your Secondary Department
              </label>
              <input
                id="secondary-department"
                type="text"
                placeholder="Enter secondary department"
                value={secondaryDepartment}
                onChange={(e) => setSecondaryDepartment(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="other-societies">
              Which other Societies you are currently in Thapar except MLSC?
            </label>
            <input
              id="other-societies"
              rows="3"
              placeholder="List other societies"
              value={otherSocieties}
              onChange={(e) => setOtherSocieties(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="recruit-reason">Why should we recruit you?</label>
            <textarea
              id="recruit-reason"
              rows="4"
              placeholder="Share why you are a strong fit"
              value={recruitReason}
              onChange={(e) => setRecruitReason(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onBackToSignup}
            >
              Back to signup
            </button>
            <button type="submit" className="primary-button">
              Save candidate details
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
