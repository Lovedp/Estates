import { PhoneIcon } from "lucide-react";
import Apartment from "../assets/Apartment.jpg";

export default function BecomeAgent() {
  const whatsappNumber = "08168168207";
  const whatsappMessage = "Hello, I'm interested in becoming a real estate agent with your company.";
  
  // Create WhatsApp link
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="w-full bg-gray-200 py-16">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-start lg:justify-between text-gray-900 space-y-8 lg:space-y-0 lg:space-x-16">
        {/* Left Side - Text and Register Button */}
        <div className="lg:w-2/5 text-center lg:text-left px-6">
          <h2 className="text-4xl font-bold">Become a Real Estate Agent</h2>
          <p className="text-lg mt-4 max-w-lg">
            Join our team and start selling luxury properties today. Get access to top-tier clients and premium listings.
          </p>

          {/* Register Button and Phone */}
          <div className="mt-6 flex items-center justify-center lg:justify-start space-x-6">
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition-colors duration-300"
            >
              Register Now
            </a>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="w-6 h-6 text-purple-600" />
              <span className="text-lg font-semibold">+234 816 816 8207</span>
            </div>
          </div>
        </div>

        {/* Right Side - Full-Width Company Image */}
        <div className="w-full lg:w-3/5 h-80 bg-gray-400 rounded-2xl overflow-hidden shadow-xl">
          <img src={Apartment} alt="Company" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}