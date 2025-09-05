import Button from "./Button";

export default function ListCard({
  title,
  subtitle,
  status,
  description,
  extraFields,
  actions,
}) {
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-success text-white";
      case "Assigned":
        return "bg-secondary text-white";
      case "requested":
        return "bg-warning text-dark";
      case "approved":
        return "bg-success text-white";
      case "rejected":
        return "bg-danger text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h5 className="card-title">{title}</h5>
            {subtitle && <p className="card-subtitle text-muted">{subtitle}</p>}
          </div>
          {status && (
            <span className={`badge ${getStatusClass(status)}`}>{status}</span>
          )}
        </div>
        {description && <p className="card-text">{description}</p>}
        {extraFields?.map((f) => (
          <div
            className="d-flex justify-content-between text-muted mb-1"
            key={f.label}
          >
            <span>{f.label}:</span>
            <span className="fw-semibold">{f.value}</span>
          </div>
        ))}
        {actions && <div className="mt-auto">{actions}</div>}
      </div>
    </div>
  );
}
