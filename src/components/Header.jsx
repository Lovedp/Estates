import React from 'react';
import Navbar from './Navbar';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Header = () => {
  const navigate = useNavigate(); // Initialize navigate

  // Function to handle navigation
  const handleBecomeAgentClick = () => {
    navigate('/listing-form'); // Navigate to Create Listing page
  };

  const handleProjects = () => {
    navigate('/all-listings'); // Navigate to Create Listing page
  };


  return (
    <div
      className="min-h-screen mb-4 bg-cover bg-center flex items-center w-full overflow-hidden relative"
      style={{ backgroundImage: "url('/tesa.jpg')" }}
    >
      <Navbar />
      <div className="container text-center mx-auto py-4 px-6 md:px-20 lg:px-32">
        <h2 className="text-5xl font-bold sm:text-6xl md:text-[82px] inline-block pt-20 tracking-wide text-white">
          Welcome to <span className="text-blue-600">Valkyrie Homes</span>
        </h2>

        {/* Navigation Buttons */}
        <div className="mt-6 space-x-6">
          <button onClick={handleProjects}
            
            className="px-6 py-2 text-lg font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition duration-300"
          >
            Projects
          </button>
          <button
            onClick={handleBecomeAgentClick}
            className="px-6 py-2 text-lg font-bold rounded-lg border-2 border-purple-600 text-white hover:bg-purple-600 hover:text-white transition duration-300"
          >
            Become our Agent
          </button>
        </div>
      </div>

      {/* Social Media Stats */}
      <div className="absolute bottom-0 left-0 bg-black text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-x-6 sm:gap-x-4 md:gap-x-3">
        <div className="flex items-center gap-x-2 sm:gap-x-1">
          <FaFacebook className="text-blue-500" size={30} sm={24} md={20} />
          <span className="text-xl font-bold sm:text-lg md:text-base">60M</span>
        </div>
        <div className="flex items-center gap-x-2 sm:gap-x-1">
          <FaInstagram className="text-pink-500" size={30} sm={24} md={20} />
          <span className="text-xl font-bold sm:text-lg md:text-base">120M</span>
        </div>
        <div className="flex items-center gap-x-2 sm:gap-x-1">
          <FaTwitter className="text-blue-400" size={30} sm={24} md={20} />
          <span className="text-xl font-bold sm:text-lg md:text-base">30M</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
