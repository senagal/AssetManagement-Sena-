export default function ToastMessage({ message, type, onClose }) {
  if (!message) return null;

  return (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 9999 }}
    >
      <div
        className={`toast align-items-center text-white bg-${type} border-0 show`}
        role="alert"
      >
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
}
