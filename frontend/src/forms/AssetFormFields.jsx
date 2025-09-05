export default function AssetFormFields({ formData, handleChange, validated }) {
  return (
    <>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Asset Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="form-control"
          value={formData.name || ""}
          onChange={handleChange}
          required
        />
        <div className="invalid-feedback">Name is required.</div>
      </div>

      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        <select
          id="category"
          name="category"
          className="form-select"
          value={formData.category || ""}
          onChange={handleChange}
          required
        >
          <option value="Laptop">Laptop</option>
          <option value="Phone">Phone</option>
          <option value="Monitor">Monitor</option>
          <option value="Cable">Cable</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="serialNumber" className="form-label">
          Serial Number
        </label>
        <input
          type="text"
          id="serialNumber"
          name="serialNumber"
          className="form-control"
          value={formData.serialNumber || ""}
          onChange={handleChange}
          required
        />
        <div className="invalid-feedback">Serial number is required.</div>
      </div>

      <div className="mb-3">
        <label htmlFor="purchaseDate" className="form-label">
          Purchase Date
        </label>
        <input
          type="datetime-local"
          id="purchaseDate"
          name="purchaseDate"
          className="form-control"
          value={formData.purchaseDate || ""}
          onChange={handleChange}
          required
        />
        <div className="invalid-feedback">Purchase date is required.</div>
      </div>

      <div className="mb-3">
        <label htmlFor="status" className="form-label">
          Status
        </label>
        <select
          id="status"
          name="status"
          className="form-select"
          value={formData.status || ""}
          onChange={handleChange}
          required
        >
          <option value="Available">Available</option>
          <option value="Assigned">Assigned</option>
        </select>
        <div className="invalid-feedback">Status is required.</div>
      </div>
    </>
  );
}
