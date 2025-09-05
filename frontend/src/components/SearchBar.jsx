import { useState } from "react";
import { assetService } from "../services/assetService";
import { requestService } from "../services/requestService";

export default function SearchBar({ type, role, onResults }) {
  const [query, setQuery] = useState({
    name: "",
    serialNumber: "",
    category: "",
    status: "",
    reason: "",
    assetName: "",
    userName: "",
  });

  const handleChange = (e) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      let results = [];

      if (type === "assets") {
        const filters = {
          name: query.name,
          serialNumber: query.serialNumber,
          category: query.category,
          status: role === "Admin" ? query.status : "Available",
        };
        results = await assetService.searchAssets(filters);
      } else if (type === "requests") {
        const filters = {
          assetName: query.assetName,
          status: query.status,
          reason: query.reason,
          ...(role === "Admin" && { userName: query.userName }),
        };
        results = await requestService.searchRequests(filters);
      }

      onResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div className="mb-4">
      <div className="row g-2">
        {type === "assets" ? (
          <>
            <div className="col">
              <input
                type="text"
                name="name"
                placeholder="Asset Name"
                className="form-control"
                value={query.name}
                onChange={handleChange}
              />
            </div>

            <div className="col">
              <input
                type="text"
                name="serialNumber"
                placeholder="Serial Number"
                className="form-control"
                value={query.serialNumber}
                onChange={handleChange}
              />
            </div>

            <div className="col">
              <select
                name="category"
                className="form-select"
                value={query.category}
                onChange={handleChange}
              >
                <option value="">All Categories</option>
                <option value="Laptop">Laptop</option>
                <option value="Phone">Phone</option>
                <option value="Monitor">Monitor</option>
                <option value="Cable">Cable</option>
              </select>
            </div>

            {role === "Admin" && (
              <div className="col">
                <select
                  name="status"
                  className="form-select"
                  value={query.status}
                  onChange={handleChange}
                >
                  <option value="">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="col">
              <input
                type="text"
                name="assetName"
                placeholder="Asset Name"
                className="form-control"
                value={query.assetName}
                onChange={handleChange}
              />
            </div>

            {role === "Admin" && (
              <div className="col">
                <input
                  type="text"
                  name="userName"
                  placeholder="User Name"
                  className="form-control"
                  value={query.userName}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="col">
              <select
                name="status"
                className="form-select"
                value={query.status}
                onChange={handleChange}
              >
                <option value="">All Statuses</option>
                <option value="Requested">Requested</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="col">
              <input
                type="text"
                name="reason"
                placeholder="Reason"
                className="form-control"
                value={query.reason}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <div className="col-auto">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
