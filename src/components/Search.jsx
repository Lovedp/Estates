import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const PropertySearchForm = () => {
  const [searchParams, setSearchParams] = useState({
    city: '',
    type: '',
    listingType: '' // 'sale' or 'rent'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API}/api/listing/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server returned: ${text.substring(0, 100)}...`);
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }
      
      // Navigate to results page with data
      navigate('/search-results', { 
        state: { 
          results: data.data,
          searchParams // Pass the original search parameters
        } 
      });
      
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Search for Your Next Property
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* City Input */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">City</label>
          <input
            type="text"
            name="city"
            placeholder="Enter city"
            value={searchParams.city}
            onChange={handleInputChange}
            className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Property Type Dropdown */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Property Type</label>
          <select
            name="type"
            value={searchParams.type}
            onChange={handleInputChange}
            className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Types</option>
            <option>Apartment</option>
            <option>Town House</option>
            <option>Office</option>
            <option>Land</option>
            <option>Modern Villa</option>
          </select>
        </div>

        {/* Sale/Rent Dropdown */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Listing Type</label>
          <select
            name="listingType"
            value={searchParams.listingType}
            onChange={handleInputChange}
            className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Listings</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>

        {/* Search Button - spans full width */}
        <div className="flex items-end col-span-1 sm:col-span-3">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex w-full items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Searching...' : (
              <>
                <FaSearch /> Search
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertySearchForm;