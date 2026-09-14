import Button from "../ui/Button";

export default function DocumentCard({ document }) {
  const handleViewDocument = () => {
    if (document.status === "Available" && document.documentUrl) {
      window.open(document.documentUrl, "_blank");
    } else {
      alert("This document is registered on file.");
    }
  };

  return (
    <div className="card p-5">

      <h3 className="font-bold text-red-800 text-2xl">
        {document.title}
      </h3>

      <p className="mt-2 font-semibold">
        {document.value}
      </p>

      <p className="mt-2 text-sm text-gray-600">
        {document.description}
      </p>

      <Button
        variant="outline"
        className="mt-4 w-full text-green-700"
        onClick={handleViewDocument}
      >
        {document.status === "Available"
          ? "View Details"
          : "Unavailable"}
      </Button>

    </div>
  );
}