import { useState, useEffect } from "react";
import { requestService } from "../services/requestService";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import ToastMessage from "../components/ToastMessage";

export default function RequestForm({ asset, onRequestSubmitted }) {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await requestService.requestAsset(asset.id, reason);
      setSuccess("Request submitted successfully!");
      setReason("");
      setValidated(false);

      setTimeout(() => {
        if (onRequestSubmitted) onRequestSubmitted();
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to submit request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <main className="container py-4">
        <h2 className="h5 mb-3">Request Asset</h2>
        <div className="card mb-3">
          <div className="card-body">
            <h5>{asset.name}</h5>
            <p className="mb-1">Category: {asset.category}</p>
            <p className="mb-1">Serial Number: {asset.serialNumber}</p>
            <p className="mb-1">Status: {asset.status}</p>
            <p className="mb-0">
              Purchase Date: {new Date(asset.purchaseDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="card shadow-sm">
          <div className="card-body">
            {loading && <LoadingSpinner />}
            <form
              noValidate
              className={validated ? "was-validated" : ""}
              onSubmit={handleSubmit}
            >
              <div className="mb-3">
                <label htmlFor="reason" className="form-label">
                  Reason for Request
                </label>
                <input
                  type="text"
                  id="reason"
                  className="form-control"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter your reason"
                  required
                />
                <div className="invalid-feedback">
                  Please provide a reason for your request.
                </div>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </div>
        </div>

        <ToastMessage
          message={success || error}
          type={success ? "success" : "danger"}
          onClose={() => {
            setSuccess("");
            setError("");
          }}
        />
      </main>
    </div>
  );
}
