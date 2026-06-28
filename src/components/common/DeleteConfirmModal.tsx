import Modal from "./Modal";

const DeleteConfirmModal = ({
    title,
    description,
  onClose,
  handleSubmit,
}: {
    title: string;
    description: string;
  onClose: () => void;
  handleSubmit: () => void;
}) => {
  return (
    <Modal title={title} onClose={onClose}>
      <div style={{ color: "var(--ink)", marginBottom: "20px" }}>
        <p>{`Are you sure you want to delete this ${description}?`}</p>
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--ink-soft)",
            marginTop: "10px",
          }}
        >
          This action cannot be undone.
        </p>
      </div>
      <div className="form-actions">
        <button
        style={{color: "var(--ink)"}}
          className="button secondary"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="button primary"
          style={{ backgroundColor: "#ef4444" }}
          onClick={handleSubmit}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};
export default DeleteConfirmModal;
