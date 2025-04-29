import { useLocation, useNavigate } from "react-router-dom";
import { FaBed, FaBath, FaHeart } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useState } from "react";

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const PropertyCard = ({ 
  property, 
  isFavorite, 
  onFavoriteToggle, 
  onClick 
}) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/600x400?text=Property+Image';
    e.target.className = 'w-full h-full object-contain bg-gray-100';
  };
  

  return (
    <div 
      className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => onClick(property._id)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${property.name}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick(property._id)}
    >
      <div className="relative h-64 bg-gray-100">
        {property.imageUrls?.length > 0 ? (
          <img 
            src={`${API}${property.imageUrls[0]}`}
            alt={property.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow">
          {property.type === 'rent' ? 'For Rent' : 'For Sale'}
        </div>
        <button 
          className={`absolute top-4 right-4 p-2 rounded-full shadow ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(property._id);
          }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FaHeart />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-center text-gray-600 mb-1">
          <MdLocationOn className="mr-1" />
          <span className="truncate">{property.address || 'Address not available'}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 truncate">
          {property.name || 'Untitled Property'}
        </h3>
        
        <PriceDisplay 
          regularPrice={property.regularPrice} 
          discountPrice={property.discountPrice} 
          type={property.type} 
        />

        <PropertyFeatures 
          bedrooms={property.bedrooms} 
          bathrooms={property.bathrooms} 
        />
      </div>
    </div>
  );
};

const PriceDisplay = ({ regularPrice, discountPrice, type }) => {
  const formatPrice = (price, type) => {
    if (!price) return 'Price not available';
    return type === 'rent' ? `$${price}/mo` : `$${price}`;
  };

  return (
    <div className="flex items-center mb-4">
      <span className="text-2xl font-bold text-blue-600">
        {formatPrice(regularPrice, type)}
      </span>
      {discountPrice > 0 && (
        <span className="ml-2 text-gray-500 line-through">
          ${discountPrice}
        </span>
      )}
    </div>
  );
};

const PropertyFeatures = ({ bedrooms, bathrooms }) => (
  <div className="flex justify-between text-gray-600 border-t pt-3">
    <div className="flex items-center">
      <FaBed className="mr-1" />
      <span>{bedrooms || 'N/A'} beds</span>
    </div>
    <div className="flex items-center">
      <FaBath className="mr-1" />
      <span>{bathrooms || 'N/A'} baths</span>
    </div>
  </div>
);

const NoResults = ({ onBackClick }) => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-bold text-gray-700 mb-4">
      No properties found
    </h2>
    <button 
      onClick={onBackClick}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Back to Search
    </button>
  </div>
);

const SearchResultsPage = () => {
  const { state } = useLocation();
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const results = state?.results || [];

  const handlePropertyClick = (id) => {
    navigate(`/listings/${id}`);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {results.length} {results.length === 1 ? 'Property' : 'Properties'} Found
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            isFavorite={favorites.includes(property._id)}
            onFavoriteToggle={toggleFavorite}
            onClick={handlePropertyClick}
          />
        ))}
      </div>

      {results.length === 0 && <NoResults onBackClick={() => navigate('/')} />}
    </div>
  );
};

export default SearchResultsPage;
