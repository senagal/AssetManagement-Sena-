import { useEffect, useState } from "react";
import { requestService } from "../lib/requestService";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ListCard from "../components/ListCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function RequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await requestService.getUserRequests();
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-vh-100 bg-light">
      <Navbar user={user.firstName} />
      <main className="container py-4">
        <h2 className="h5 mb-3">My Asset Requests</h2>

        {requests.length === 0 ? (
          <p className="text-muted">No requests yet.</p>
        ) : (
          requests.map((request) => (
            <ListCard
              key={request.id}
              title={request.assetName}
              subtitle={`Requested on: ${new Date(
                request.requestedOn
              ).toLocaleDateString()}`}
              status={request.status}
              extraFields={[
                { label: "Reason", value: request.reason || "N/A" },
                { label: "Handled By", value: request.adminName || "Pending" },
                {
                  label: "Handled On",
                  value: request.handledOn
                    ? new Date(request.handledOn).toLocaleDateString()
                    : "Pending",
                },
              ]}
            />
          ))
        )}
      </main>
    </div>
  );
}
