import { useState } from "react";
import { requestService } from "../lib/requestService";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import InputField from "../components/InputField";
import LoadingSpinner from "../components/LoadingSpinner";

export default function RequestForm({ asset, onRequestSubmitted }) {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await requestService.requestAsset(user.id, asset.id, reason);
      setSuccess("Request submitted successfully!");
      setReason("");
      if (onRequestSubmitted) onRequestSubmitted();
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
      <Navbar user={user.firstName} />
      <main className="container py-4">
        <h2 className="h5 mb-3">Request Asset: {asset.name}</h2>

        <div className="card shadow p-4">
          {loading && <LoadingSpinner />}

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <InputField
              label="Reason for Request"
              id="reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter your reason"
              required
            />

            <div className="mt-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
