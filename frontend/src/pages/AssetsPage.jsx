import { useEffect, useState } from "react";
import { assetService } from "../lib/assetService";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ListCard from "../components/ListCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import RequestForm from "../forms/RequestForm";

export default function AssetsPage() {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const data = await assetService.getAvailableAssets();
      setAssets(data);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-vh-100 bg-light">
      <Navbar user={user.firstName} />
      <main className="container py-4">
        <h2 className="h5 mb-3">Available Assets</h2>

        {selectedAsset ? (
          <RequestForm
            asset={selectedAsset}
            onClose={() => setSelectedAsset(null)}
            onRequestSuccess={loadAssets}
          />
        ) : assets.length === 0 ? (
          <p className="text-muted">No assets available.</p>
        ) : (
          assets.map((asset) => (
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
                  <Button onClick={() => setSelectedAsset(asset)}>
                    Request Asset
                  </Button>
                ) : (
                  <span className="badge bg-info">Admin manages</span>
                )
              }
            />
          ))
        )}
      </main>
    </div>
  );
}
