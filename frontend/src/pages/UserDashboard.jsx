import { useState, useEffect } from "react";

export default function UserDashboard({ user, onLogout }) {
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const assetsData = [];
      const requestsData = [];
      setAssets(assetsData.filter((asset) => asset.status === "Available"));
      setRequests(requestsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAsset = (assetId) => {
    alert(`Request sent for asset ID: ${assetId}`);
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case "Approved":
        return "badge bg-success";
      case "Rejected":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <nav className="navbar navbar-light bg-light border-bottom">
        <div className="container">
          <span className="navbar-brand mb-0 h1">Asset Management</span>
          <div>
            <span className="me-3">Welcome, {user.email}</span>
            <button className="btn btn-outline-primary" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container my-4">
        <div className="row">
          <div className="col-lg-6 mb-4">
            <h4>Available Assets</h4>
            {assets.length === 0 && <p>No available assets at the moment.</p>}
            {assets.map((asset) => (
              <div key={asset.id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="card-title">{asset.name}</h5>
                      <p className="card-subtitle text-muted">
                        {asset.category}
                      </p>
                    </div>
                    <span className="badge bg-secondary">{asset.status}</span>
                  </div>
                  <p className="mb-1">
                    <strong>Serial:</strong> {asset.serialNumber}
                  </p>
                  <p className="mb-2">
                    <strong>Purchase Date:</strong>{" "}
                    {new Date(asset.purchaseDate).toLocaleDateString()}
                  </p>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handleRequestAsset(asset.id)}
                  >
                    Request Asset
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-6 mb-4">
            <h4>My Requests</h4>
            {requests.length === 0 && <p>No requests yet.</p>}
            {requests.map((request) => (
              <div key={request.id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="card-title">{request.assetName}</h5>
                      <p className="card-subtitle text-muted">
                        Requested on{" "}
                        {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={getBadgeClass(request.status)}>
                      {request.status}
                    </span>
                  </div>
                  {request.adminNotes && (
                    <p>
                      <strong>Admin Notes:</strong> {request.adminNotes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
