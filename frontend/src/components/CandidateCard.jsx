const STATUS_CLASS = {
  pending: "status--pending",
  shortlisted: "status--shortlisted",
  rejected: "status--rejected",
};

// Unique color per department
const DEPT_CLASS = {
  Tech: "tag--tech",
  Technical: "tag--tech",
  Design: "tag--design",
  Marketing: "tag--marketing",
  Content: "tag--content",
  Media: "tag--media",
};

export default function CandidateCard({ candidate, onSelect }) {
  const initials = candidate.full_name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  const statusKey = candidate.application_status?.toLowerCase();

  return (
    <div
      className="applicant-card"
      onClick={() => onSelect(candidate)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(candidate)}
    >
      {/* Top row: avatar + name + status badge */}
      <div className="card-header">
        <div className="avatar" aria-hidden="true">
          {initials}
        </div>
        <div className="card-meta">
          <h2 className="card-name">{candidate.full_name}</h2>
          <p className="card-email">{candidate.email}</p>
        </div>
        <span className={`status-badge ${STATUS_CLASS[statusKey] ?? ""}`}>
          {candidate.application_status}
        </span>
      </div>

      {/* Department tags */}
      <div className="tags">
        {candidate.primary_department && (
          <span
            className={`tag ${DEPT_CLASS[candidate.primary_department] ?? "tag--tech"}`}
          >
            {candidate.primary_department}
          </span>
        )}
        {candidate.secondary_department && (
          <span
            className={`tag ${DEPT_CLASS[candidate.secondary_department] ?? "tag--tech"} tag--secondary-dept`}
          >
            {candidate.secondary_department}
          </span>
        )}
      </div>

      {/* Footer: app number */}
      <div className="card-footer">
        <span className="card-app-no">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          #{candidate.application_number}
        </span>
        <span className="card-cta" aria-hidden="true">
          View details →
        </span>
      </div>
    </div>
  );
}
