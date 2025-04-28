import React, { useState } from "react";
import { MapPin, Bed, Bath, Building } from "lucide-react";
import Apartment from "../assets/Apartment.jpg"; // Replace with actual image path

const PropertySection = () => {
  const [status, setStatus] = useState("For Sale"); // Toggle between "For Sale" and "For Rent"

  return (
    <div className="container mx-auto px-6 md:px-16 lg:px-24 py-12 flex flex-col md:flex-row items-center gap-10">
      {/* Right Side - Property Image */}
      <div className="w-full md:w-3/5 flex-shrink-0">
        <img
          src={Apartment}
          alt="Property"
          className="w-full h-[400px] md:h-[500px] rounded-lg shadow-lg object-cover"
        />
      </div>
      
      {/* Left Side - Property Details */}
      <div className="w-full md:w-2/5 space-y-4">
        <span
          className="text-white text-sm font-semibold px-4 py-2 rounded-full"
          style={{ backgroundColor: status === "For Sale" ? "#ff4444" : "#44aa44" }}
        >
          {status}
        </span>

        <h2 className="text-2xl md:text-3xl font-bold">Luxury Apartment in Downtown</h2>
        
        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={18} />
          <span className="text-lg">123 Main St, New York, USA</span>
        </div>
        
        {/* Property Description */}
        <p className="text-gray-500 text-lg">
          This stunning apartment features modern interiors, spacious living areas, and a breathtaking city view.
        </p>

        {/* Property Features */}
        <div className="flex gap-6 mt-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-600">
            <Bed size={20} />
            <span>3 Beds</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Bath size={20} />
            <span>2 Baths</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Building size={20} />
            <span>1,500 sqft</span>
          </div>
        </div>

        {/* Read More Button */}
        <button className="mt-6 px-6 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition">
          Read More
        </button>
      </div>
    </div>
  );
};

export default PropertySection;
