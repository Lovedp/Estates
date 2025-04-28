import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ListingsPage = () => {
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Parse query params
  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get("city") || "";
  const propertyType = queryParams.get("propertyType") || "";
  const priceRange = queryParams.get("priceRange") || "";

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/listing/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city, propertyType, priceRange }),
        });
        const data = await response.json();
        setListings(data.listings || []);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [city, propertyType, priceRange]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Listings</h1>

      {loading && <p className="text-center">Loading listings...</p>}

      {!loading && listings.length === 0 && (
        <p className="text-center text-gray-500">No listings found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div key={listing._id} className="border rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-2">{listing.name}</h2>
            <p className="mb-1">{listing.address}</p>
            <p className="mb-1">
              Price: ${listing.regularPrice.toLocaleString()}
            </p>
            <p className="mb-1">
              Bedrooms: {listing.bedrooms}, Bathrooms: {listing.bathrooms}
            </p>
            {/* Optionally add image or more details */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingsPage;
