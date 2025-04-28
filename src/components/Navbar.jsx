import React, { useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link
import { useSelector } from "react-redux";
import White from "../assets/White.svg";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="absolute top-0 left-0 w-full z-10 text-white bg-black shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6 md:px-16 lg:px-24">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img src={White} alt="Logo" />
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex flex-grow justify-center gap-7 text-lg md:text-xl font-semibold">
          <li><a href="/" className="cursor-pointer hover:text-gray-400">Home</a></li>
          <li><a href="/about" className="cursor-pointer hover:text-gray-400">About</a></li>
          <li><a href="/all-listings" className="cursor-pointer hover:text-gray-400">Project</a></li>
          <li><a href="/testimonials" className="cursor-pointer hover:text-gray-400">Testimonials</a></li>
        </ul>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-6">
          {/* Profile Icon (Visible when signed in) */}
          {currentUser && (
            <Link to="/profile" className="relative ml-5 w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border border-white-300">
              <img src={currentUser.avatar} alt="profile" className="w-full h-full object-cover" />
            </Link>
          )}

          {/* Phone Icon & Number */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Phone size={20} />
            <span className="hidden sm:block">+123 456 7890</span>
          </div>

          {/* Sign In Button (Only when not signed in) */}
          {!currentUser && (
            <Link to="/signin" className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition flex-shrink-0">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black shadow-md absolute w-full left-0 top-[60px] py-4 px-6 flex flex-col items-center gap-6">
          <ul className="flex flex-col items-center gap-6 text-lg font-semibold">
            <li><a href="#" className="cursor-pointer hover:text-gray-400">Home</a></li>
            <li><a href="#" className="cursor-pointer hover:text-gray-400">About</a></li>
            <li><a href="#" className="cursor-pointer hover:text-gray-400">Project</a></li>
            <li><a href="#" className="cursor-pointer hover:text-gray-400">Testimonials</a></li>
          </ul>

          {/* Mobile Right Section */}
          <div className="flex flex-col items-center gap-6 mt-4">
            {currentUser && (
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-300">
                <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex items-center gap-3">
              <Phone size={20} />
              <span>+234 80675692</span>
            </div>
            {!currentUser && (
              <Link to="/signin" className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;