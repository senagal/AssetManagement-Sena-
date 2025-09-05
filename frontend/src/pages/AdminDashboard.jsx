import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import { requestService } from "../services/requestService";
import { assetService } from "../services/assetService";

export default function AdminDashboard() {
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
        requestService.getAllRequests(),
      ]);
      setAssets(assetsData);
      setRequests(requestsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const availableAssets = assets.filter((a) => a.status === "Available").length;
  const AssignedAssets = assets.filter((a) => a.status === "Assigned").length;

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
      <Navbar user="Admin" />
      <main className="container py-4">
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <StatsCard
              title="Available Assets"
              value={availableAssets}
              bg="success"
            />
          </div>
          <div className="col-md-4">
            <StatsCard
              title="Assigned Assets"
              value={AssignedAssets}
              bg="danger"
            />
          </div>
          <div className="col-md-4">
            <StatsCard
              title="Total Requests"
              value={requests.length}
              bg="primary"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
