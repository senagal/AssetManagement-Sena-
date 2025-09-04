import Button from "./Button";

export default function FilterHeader({
  searchValue,
  onSearchChange,
  filters,
  filterValue,
  onFilterChange,
  button,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between mb-4">
      <input
        type="text"
        className="border rounded px-3 py-2 flex-1"
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {filters && onFilterChange && (
        <select
          className="border rounded px-2 py-2 sm:ml-2"
          value={filterValue}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          {filters.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      )}
      {button && (
        <Button onClick={button.onClick} className="sm:ml-2">
          {button.label}
        </Button>
      )}
    </div>
  );
}
