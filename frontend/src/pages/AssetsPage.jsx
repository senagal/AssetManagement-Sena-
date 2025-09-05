import { useEffect, useState } from "react";
import { assetService } from "../lib/assetService";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ListCard from "../components/ListCard";
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
  const [results, setResults] = useState([]);
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
      setResults([]);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
    } finally {
      setLoading(false);
    }
  };

  const displayedAssets = results.length > 0 ? results : assets;

  if (!user) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-vh-100 bg-light">
      <Navbar user={user.firstName} />
      <main className="container py-4">
        <div>
          <SearchBar type="assets" role={user.role} onResults={setResults} />
        </div>
        <h2 className="h5 mb-3">Available Assets</h2>

        {selectedAsset ? (
          formMode === "request" ? (
            <RequestForm
              asset={selectedAsset}
              onClose={() => {
                setSelectedAsset(null);
                setFormMode(null);
              }}
              onRequestSuccess={loadAssets}
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
          <p className="text-muted">No assets available.</p>
        ) : (
          displayedAssets.map((asset) => (
            <ListCard
              key={asset.id}
              title={asset.name}
              subtitle={asset.category}
              status={asset.status}
              extraFields={[
                { label: "Serial", value: asset.serialNumber },
                {
                  label: "Purchase Date",
                  value: new Date(asset.purchaseDate).toLocaleDateString(),
                },
              ]}
              actions={
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
          ))
        )}
      </main>
    </div>
  );
}
