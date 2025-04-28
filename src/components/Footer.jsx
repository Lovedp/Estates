import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import Valkyrie from "../assets/Valkyrie.svg";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-200 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between space-y-6 sm:space-y-0">
        
        {/* Copyright Section */}
        <p className="text-gray-800 text-lg font-semibold text-center sm:text-left">
          &copy; {new Date().getFullYear()} Valkyrie Homes. All rights reserved.
        </p>

        {/* Company Logo */}
        <div className="flex justify-center">
          <img src={Valkyrie} alt="Company Logo" className="h-14" />
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-6">
          <a href="#" className="text-gray-800 hover:text-purple-600">
            <Facebook className="w-8 h-8" />
          </a>
          <a href="#" className="text-gray-800 hover:text-purple-600">
            <Instagram className="w-8 h-8" />
          </a>
          <a href="#" className="text-gray-800 hover:text-purple-600">
            <Twitter className="w-8 h-8" />
          </a>
          <a href="#" className="text-gray-800 hover:text-purple-600">
            <Linkedin className="w-8 h-8" />
          </a>
        </div>
      </div>
    </footer>
  );
}
