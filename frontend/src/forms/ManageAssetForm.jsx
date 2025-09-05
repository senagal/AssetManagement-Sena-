import { useState, useEffect } from "react";
import { assetService } from "../services/assetService";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import AssetFormFields from "./AssetFormFields";
import ToastMessage from "../components/ToastMessage";
import DeleteConfirmation from "../components/DeleteConfirmation";

export default function ManageAssetForm({ asset, onClose, onUpdateSuccess }) {
  const [formData, setFormData] = useState({ ...asset, image: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validated, setValidated] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isNew = !asset?.id;

  const handleChange = (e, isFile = false) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: isFile ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    let imageUrl = asset.imageUrl || "";

    try {
      if (formData.image) {
        imageUrl = await assetService.uploadImage(formData.image);
      }

      const normalizedData = {
        ...formData,
        imageUrl,
        purchaseDate: formData.purchaseDate
          ? new Date(formData.purchaseDate).toISOString()
          : null,
      };

      if (isNew) {
        await assetService.createAsset(normalizedData);
        setSuccess("Asset added successfully.");
      } else {
        await assetService.updateAsset(asset.id, normalizedData);
        setSuccess("Asset updated successfully.");
      }

      setTimeout(() => {
        if (onUpdateSuccess) onUpdateSuccess();
        if (onClose) onClose();
        setSuccess("");
      }, 2000);
    } catch (err) {
      if (err.response?.status === 409) {
        setError(err.response.data);
      } else {
        setError(isNew ? "Failed to add asset." : "Failed to update asset.");
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmAndDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await assetService.deleteAsset(asset.id);
      setSuccess("Asset deleted successfully.");
      setTimeout(() => {
        if (onUpdateSuccess) onUpdateSuccess();
        if (onClose) onClose();
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError("Failed to delete asset.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="min-vh-100 bg-light">
      <main className="container py-4">
        <h2 className="h5 mb-3">
          {isNew ? "Add New Asset" : `Manage Asset: ${asset.name}`}
        </h2>

        <div className="card shadow-sm">
          <div className="card-body">
            {loading && <LoadingSpinner />}

            <form
              noValidate
              className={validated ? "was-validated" : ""}
              onSubmit={handleSubmit}
            >
              <AssetFormFields
                formData={formData}
                handleChange={handleChange}
                validated={validated}
              />

              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  Asset Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => handleChange(e, true)}
                />
              </div>

              {formData.image && (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="img-thumbnail mb-3"
                  style={{ maxHeight: "150px" }}
                />
              )}

              <div className="d-flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading
                    ? isNew
                      ? "Adding..."
                      : "Saving..."
                    : isNew
                    ? "Add Asset"
                    : "Save Changes"}
                </Button>

                {!isNew && (
                  <Button
                    variant="danger"
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                  >
                    Delete Asset
                  </Button>
                )}

                <Button variant="secondary" type="button" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>

            {confirmDelete && !isNew && (
              <DeleteConfirmation
                itemName={asset.name}
                onConfirm={confirmAndDelete}
                onCancel={() => setConfirmDelete(false)}
                loading={loading}
              />
            )}

            <ToastMessage
              message={success || error}
              type={success ? "success" : "danger"}
              onClose={() => {
                setSuccess("");
                setError("");
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
