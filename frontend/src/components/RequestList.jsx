export default function RequestList({ requests }) {
  const getStatusBadgeClass = (status) => {
    if (typeof status !== "string") return "badge bg-secondary"; // safeguard

    switch (status) {
      case "Requested":
      case "Pending":
        return "badge bg-warning text-dark";
      case "Approved":
        return "badge bg-success";
      case "Rejected":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  if (!requests || requests.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center text-muted">No requests yet.</div>
      </div>
    );
  }

  return requests.map((request) => (
    <div className="card mb-3" key={request.id}>
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div>
            <h5 className="card-title mb-1">{request.assetName}</h5>
            <h6 className="card-subtitle text-muted">
              Requested on{" "}
              {new Date(
                request.requestedOn || request.requestDate
              ).toLocaleDateString()}
            </h6>
          </div>
          <span className={getStatusBadgeClass(request.status)}>
            {request.status || "Unknown"}
          </span>
        </div>
        {request.reason && (
          <p className="mt-2 mb-0">
            <strong>Reason:</strong> {request.reason}
          </p>
        )}
        {request.adminName && (
          <p className="mt-1 mb-0 text-muted">
            <strong>Handled by:</strong> {request.adminName}
          </p>
        )}
      </div>
    </div>
  ));
}
