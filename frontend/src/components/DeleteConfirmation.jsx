import Button from "./Button";

export default function DeleteConfirmation({
  itemName,
  onConfirm,
  onCancel,
  loading,
}) {
  return (
    <div className="mt-3 border border-danger rounded p-3 bg-light">
      <p className="text-danger fw-bold mb-2">
        Are you sure you want to delete <strong>{itemName}</strong>?
      </p>
      <div className="d-flex gap-2">
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Deleting..." : "Confirm Delete"}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
