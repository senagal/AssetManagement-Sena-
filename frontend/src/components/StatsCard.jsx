export default function StatsCard({ title, value, bg = "primary" }) {
  return (
    <div className={`card text-white bg-${bg} mb-3`}>
      <div className="card-body text-center">
        <h5 className="card-title">{title}</h5>
        <h2 className="mb-0">{value}</h2>
      </div>
    </div>
  );
}
