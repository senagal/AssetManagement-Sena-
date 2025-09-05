import ListCard from "../components/ListCard";

export default function AssetList({ assets, actionRenderer }) {
  if (!assets || assets.length === 0) {
    return <p className="text-muted">No assets available.</p>;
  }

  return assets.map((asset) => (
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
      actions={actionRenderer ? actionRenderer(asset) : null}
    />
  ));
}
