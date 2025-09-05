import { useEffect, useState } from "react";
import { requestService } from "../lib/requestService";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ListCard from "../components/ListCard";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";

export default function RequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    loadRequests();
  }, [user]);

  const loadRequests = async () => {
    if (!user?.role) return;

    try {
      const data =
        user.role === "Admin"
          ? await requestService.getAllRequests()
          : await requestService.getUserRequests();
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  };
  const displayedRequests = results.length > 0 ? results : requests;

  if (!user) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-vh-100 bg-light">
      <Navbar user={user.firstName} />
      <main className="container py-4">
        <div>
          <SearchBar type="requests" role={user.role} onResults={setResults} />
        </div>
        <h2 className="h5 mb-3">
          {user.role === "Admin" ? "All Asset Requests" : "My Asset Requests"}
        </h2>

        {displayedRequests.length === 0 ? (
          <p className="text-muted">No requests yet.</p>
        ) : (
          displayedRequests.map((request) => (
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
