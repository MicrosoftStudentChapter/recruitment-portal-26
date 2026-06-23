export default function ConfirmDialog({ dialog, onConfirm, onCancel }) {
  if (!dialog) return null;

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div
        className={`confirm-dialog confirm-dialog--${dialog.variant || "danger"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-icon">
          {dialog.variant === "warning" ? "⚠" : "⚠"}
        </div>

        <h3 className="confirm-title">{dialog.title}</h3>
        <p className="confirm-message">{dialog.message}</p>

        <div className="confirm-actions">
          <button className="confirm-btn confirm-btn--cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`confirm-btn confirm-btn--${dialog.variant || "danger"}`}
            onClick={onConfirm}
          >
            {dialog.confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
