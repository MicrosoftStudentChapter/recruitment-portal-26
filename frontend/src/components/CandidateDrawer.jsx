import { useEffect, useRef, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

export default function CandidateDrawer({
  candidate,
  onClose,
  onUpdateStatus,
  onUpdateAttendance,
  onDelete,
}) {
  const [dialog, setDialog] = useState(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!candidate) return;

    scrollYRef.current = window.scrollY;
    document.body.classList.add("drawer-open");
    document.body.style.top = `-${scrollYRef.current}px`;

    return () => {
      document.body.classList.remove("drawer-open");
      document.body.style.top = "";
      window.scrollTo({ top: scrollYRef.current, behavior: "instant" });
    };
  }, [candidate]);

  if (!candidate) return null;

  const isPresent = candidate.quiz_attended === true;

  function confirmAction(config, action) {
    setDialog({ ...config, _action: action });
  }

  function handleConfirm() {
    const action = dialog._action;
    setDialog(null);
    action();
  }

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />

      <div className="drawer open">
        <div className="drawer-body">
          <div className="drawer-profile">
            <div className="big-avatar">
              {candidate.full_name
                ?.split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)}
            </div>
            <h1>{candidate.full_name}</h1>
            <p>{candidate.email}</p>
          </div>

          <div className="details-grid-modal">
            <div className="detail-item">
              <h4>Application Number</h4>
              <p>{candidate.application_number}</p>
            </div>

            <div className="detail-item">
              <h4>Date Of Birth</h4>
              <p>{candidate.date_of_birth}</p>
            </div>

            <div className="detail-item">
              <h4>Attendance</h4>
              <p>{candidate.attendance}</p>
            </div>

            <div className="detail-item">
              <h4>Current Status</h4>
              <p
                className={`status ${candidate.application_status?.toLowerCase()}`}
              >
                {candidate.application_status}
              </p>
            </div>

            <div className="detail-item">
              <h4>Primary Department</h4>
              <p>{candidate.primary_department}</p>
            </div>

            <div className="detail-item">
              <h4>Secondary Department</h4>
              <p>{candidate.secondary_department}</p>
            </div>

            <div className="detail-item detail-item--wide">
              <h4>Why MLSC?</h4>
              <p>{candidate.join_reason}</p>
            </div>

            <div className="detail-item detail-item--wide">
              <h4>Other Societies</h4>
              <p>{candidate.other_societies}</p>
            </div>

            <div className="detail-item detail-item--wide">
              <h4>Why Should We Recruit You?</h4>
              <p>{candidate.recruit_reason}</p>
            </div>
          </div>

          <div className="drawer-section-label">Application Status</div>
          <div className="actions">
            <button
              className="accept"
              onClick={() =>
                confirmAction(
                  {
                    variant: "warning",
                    title: "Shortlist Candidate?",
                    message: `This will mark ${candidate.full_name} as Shortlisted. You can change this later.`,
                    confirmLabel: "Shortlist",
                  },
                  () => onUpdateStatus(candidate.id, "Shortlisted"),
                )
              }
            >
              Shortlist
            </button>

            <button
              className="reject"
              onClick={() =>
                confirmAction(
                  {
                    variant: "danger",
                    title: "Reject Candidate?",
                    message: `This will mark ${candidate.full_name} as Rejected. You can change this later.`,
                    confirmLabel: "Reject",
                  },
                  () => onUpdateStatus(candidate.id, "Rejected"),
                )
              }
            >
              Reject
            </button>
          </div>

          <div className="drawer-section-label">Quiz Attendance</div>
          <div className="actions">
            <button
              className={isPresent ? "attend-neutral" : "attend-present"}
              disabled={isPresent}
              onClick={() =>
                confirmAction(
                  {
                    variant: "warning",
                    title: "Mark as Present?",
                    message: `Manually mark ${candidate.full_name} as present for the quiz. This overrides QR scanning.`,
                    confirmLabel: "Mark Present",
                  },
                  () => onUpdateAttendance(candidate.id, true),
                )
              }
            >
              {isPresent ? "✓ Already Present" : "Mark Present"}
            </button>

            <button
              className={!isPresent ? "attend-neutral" : "attend-absent"}
              disabled={!isPresent}
              onClick={() =>
                confirmAction(
                  {
                    variant: "danger",
                    title: "Mark as Absent?",
                    message: `This will revert ${candidate.full_name}'s attendance to absent. Only do this if it was marked incorrectly.`,
                    confirmLabel: "Mark Absent",
                  },
                  () => onUpdateAttendance(candidate.id, false),
                )
              }
            >
              {!isPresent ? "✗ Already Absent" : "Mark Absent"}
            </button>
          </div>

          <div className="drawer-section-label drawer-section-label--danger">
            Danger Zone
          </div>
          <div className="actions">
            <button
              className="delete-btn"
              onClick={() =>
                confirmAction(
                  {
                    variant: "danger",
                    title: "Delete Candidate?",
                    message: `This will permanently delete ${candidate.full_name}'s entire application and cannot be undone.`,
                    confirmLabel: "Delete Permanently",
                  },
                  () => onDelete(candidate.id),
                )
              }
            >
              Delete Candidate
            </button>
          </div>
        </div>

        <div className="drawer-footer">
          <button className="drawer-close-btn" onClick={onClose}>
            ✕ Close
          </button>
        </div>
      </div>

      <ConfirmDialog
        dialog={dialog}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />
    </>
  );
}
