import { useState } from "react";
import { assetService } from "../lib/assetService";
import { requestService } from "../lib/requestService";

export default function SearchBar({ type, role, onResults }) {
  const [query, setQuery] = useState({
    name: "",
    serialNumber: "",
    category: "",
    status: "",
    reason: "",
    userName: "",
    assetName: "",
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
          userName: query.userName,
          status: query.status,
          reason: query.reason,
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
            <input
              type="text"
              name="name"
              placeholder="Asset Name"
              className="form-control col"
              value={query.name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="serialNumber"
              placeholder="Serial Number"
              className="form-control col"
              value={query.serialNumber}
              onChange={handleChange}
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              className="form-control col"
              value={query.category}
              onChange={handleChange}
            />
            {role === "Admin" && (
              <input
                type="text"
                name="status"
                placeholder="Status"
                className="form-control col"
                value={query.status}
                onChange={handleChange}
              />
            )}
          </>
        ) : (
          <>
            <input
              type="text"
              name="assetName"
              placeholder="Asset Name"
              className="form-control col"
              value={query.assetName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="userName"
              placeholder="User Name"
              className="form-control col"
              value={query.userName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="status"
              placeholder="Status"
              className="form-control col"
              value={query.status}
              onChange={handleChange}
            />
            <input
              type="text"
              name="reason"
              placeholder="Reason"
              className="form-control col"
              value={query.reason}
              onChange={handleChange}
            />
          </>
        )}
        <button className="btn btn-primary col-auto" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
}
