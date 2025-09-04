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
        return "bg-green-100 text-green-800";
      case "in-use":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "retired":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border rounded-lg shadow-sm p-4 hover:shadow-md transition flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h5 className="font-semibold">{title}</h5>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {status && (
          <span
            className={`px-2 py-1 rounded text-xs ${getStatusClass(status)}`}
          >
            {status}
          </span>
        )}
      </div>
      {description && <p className="text-sm mb-2">{description}</p>}
      {extraFields?.map((f) => (
        <div className="flex justify-between text-sm mb-1" key={f.label}>
          <span className="text-gray-500">{f.label}:</span>
          <span className="font-medium">{f.value}</span>
        </div>
      ))}
      {actions && <div className="mt-auto">{actions}</div>}
    </div>
  );
}
