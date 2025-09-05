export default function StatsCard({ title, value, bg = "primary" }) {
  return (
    <div className={`card text-white bg-${bg} shadow-sm`}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="display-6 fw-bold mb-0">{value}</p>
      </div>
    </div>
  );
}
