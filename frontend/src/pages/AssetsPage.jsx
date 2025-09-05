import { useEffect, useState } from "react";
import { assetService } from "../services/assetService";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import AssetList from "../components/AssetList";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import RequestForm from "../forms/RequestForm";
import ManageAssetForm from "../forms/ManageAssetForm";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";

export default function AssetsPage() {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [results, setResults] = useState(null);
  const [formMode, setFormMode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    loadAssets();
  }, [user]);

  const loadAssets = async () => {
    if (!user?.role) return;

    try {
      const data =
        user.role === "Admin"
          ? await assetService.getAssets()
          : await assetService.getAvailableAssets();
      setAssets(data);
      setResults(null);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
    } finally {
      setLoading(false);
    }
  };

  const displayedAssets = results !== null ? results : assets;

  if (!user) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-vh-100 bg-light">
      <Navbar user={user.firstName} />
      <main className="container py-4">
        <div>
          <SearchBar type="assets" role={user.role} onResults={setResults} />
          {user.role === "Admin" && !selectedAsset && (
            <div className="mb-3 d-flex justify-content-end">
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedAsset({
                    name: "",
                    category: "",
                    status: "Available",
                  });
                  setFormMode("manage");
                }}
              >
                + Add Asset
              </Button>
            </div>
          )}
        </div>
        <h2 className="h5 mb-3">Available Assets</h2>

        {selectedAsset ? (
          formMode === "request" ? (
            <RequestForm
              asset={selectedAsset}
              onRequestSubmitted={() => {
                setSelectedAsset(null);
                setFormMode(null);
                loadAssets();
              }}
            />
          ) : (
            <ManageAssetForm
              asset={selectedAsset}
              onClose={() => {
                setSelectedAsset(null);
                setFormMode(null);
              }}
              onUpdateSuccess={loadAssets}
            />
          )
        ) : displayedAssets.length === 0 ? (
          <p className="text-muted">
            {results !== null ? "No results found." : "No assets available."}
          </p>
        ) : (
          <AssetList
            assets={displayedAssets}
            actionRenderer={(asset) =>
              user.role === "Employee" ? (
                <Button
                  onClick={() => {
                    setSelectedAsset(asset);
                    setFormMode("request");
                  }}
                >
                  Request Asset
                </Button>
              ) : (
                <Button
                  variant="info"
                  onClick={() => {
                    setSelectedAsset(asset);
                    setFormMode("manage");
                  }}
                >
                  Manage
                </Button>
              )
            }
          />
        )}
      </main>
    </div>
  );
}
