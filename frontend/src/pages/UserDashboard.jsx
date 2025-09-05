import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import { requestService } from "../services/requestService";
import { assetService } from "../services/assetService";

export default function UserDashboard() {
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assetsData, requestsData] = await Promise.all([
        assetService.getAssets(),
        requestService.getUserRequests(1),
      ]);
      setAssets(assetsData.filter((a) => a.status === "Available"));
      setRequests(requestsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalApproved = requests.filter((r) => r.status === "Approved").length;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Navbar user="User" />
      <main className="container py-4">
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <StatsCard
              title="Available Assets"
              value={assets.length}
              bg="info"
            />
          </div>
          <div className="col-md-4">
            <StatsCard
              title="Total Requests"
              value={requests.length}
              bg="primary"
            />
          </div>
          <div className="col-md-4">
            <StatsCard
              title="Approved Requests"
              value={totalApproved}
              bg="success"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
