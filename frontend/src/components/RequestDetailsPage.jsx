import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { requestService } from "../services/requestService";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import ToastMessage from "../components/ToastMessage";
import Button from "../components/Button";

export default function RequestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const data = await requestService.getRequestById(id);
        setRequest(data);
      } catch (err) {
        setToast("Failed to load request details.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const submitDecision = async () => {
    if (!reason.trim()) {
      setToast("Please provide a reason.");
      return;
    }

    setSubmitting(true);
    try {
      await requestService.handleRequest(id, decision, reason);
      setToast(`Request ${decision.toLowerCase()} successfully.`);
      setTimeout(() => navigate("/requests"), 2000);
    } catch (err) {
      setToast("Failed to handle request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!request) return <p className="text-danger">Request not found.</p>;

  return (
    <div className="min-vh-100 bg-light">
      <Navbar user={user?.firstName} />
      <main className="container py-4">
        <h2 className="h5 mb-3">Request Details</h2>

        <div className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5>{request.assetName}</h5>
            {request.assetImageUrl && (
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}${request.assetImageUrl}`}
                alt={request.assetName}
                className="img-fluid rounded mb-3"
                style={{
                  maxHeight: "200px",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                  border: "1px solid #dee2e6",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${process.env.REACT_APP_API_BASE_URL}/images/default-placeholder.jpeg`;
                }}
              />
            )}

            <p>Category: {request.assetCategory}</p>
            <p>Serial Number: {request.assetSerialNumber}</p>
            <p>Status: {request.status}</p>
            <p>Requested By: {request.userName}</p>
            <p>Reason: {request.reason || "N/A"}</p>
            <p>
              Requested On: {new Date(request.requestedOn).toLocaleDateString()}
            </p>
            <p>Handled By: {request.adminName || "Pending"}</p>
            <p>
              Handled On:{" "}
              {request.handledOn
                ? new Date(request.handledOn).toLocaleDateString()
                : "Pending"}
            </p>
          </div>
        </div>

        {request.status === "Requested" && !decision && (
          <div className="d-flex gap-2">
            <Button variant="success" onClick={() => setDecision("Approved")}>
              Approve
            </Button>
            <Button variant="danger" onClick={() => setDecision("Rejected")}>
              Reject
            </Button>
          </div>
        )}

        {decision && (
          <div className="card mt-3">
            <div className="card-body">
              <h6 className="mb-2">Confirm {decision}</h6>
              <div className="mb-3">
                <label htmlFor="reason" className="form-label">
                  Reason
                </label>
                <textarea
                  id="reason"
                  className="form-control"
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={submitting}
                />
              </div>
              <div className="d-flex gap-2">
                <Button onClick={submitDecision} disabled={submitting}>
                  {submitting ? "Submitting..." : `Confirm ${decision}`}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setDecision("");
                    setReason("");
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <ToastMessage
          message={toast}
          type={toast.includes("successfully") ? "success" : "danger"}
          onClose={() => setToast("")}
        />
      </main>
    </div>
  );
}
