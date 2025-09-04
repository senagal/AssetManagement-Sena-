export default function AssetList({ assets, onRequest }) {
  if (assets.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center text-muted">
          No available assets at the moment.
        </div>
      </div>
    );
  }

  return assets.map((asset) => (
    <div className="card mb-3" key={asset.id}>
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div>
            <h5 className="card-title mb-1">{asset.name}</h5>
            <h6 className="card-subtitle text-muted">{asset.category}</h6>
          </div>
          <span className="badge bg-secondary">{asset.status}</span>
        </div>
        <p className="mb-1 mt-2">
          <strong>Serial:</strong> {asset.serialNumber}
        </p>
        <p className="mb-3">
          <strong>Purchase Date:</strong>{" "}
          {new Date(asset.purchaseDate).toLocaleDateString()}
        </p>
        <button
          className="btn btn-primary w-100"
          onClick={() => onRequest(asset.id)}
        >
          Request Asset
        </button>
      </div>
    </div>
  ));
}
