import Apartment from "../assets/Apartment.jpg";

export default function ExclusiveProperty() {
  return (
    <div className="bg-blue-900 min-h-screen flex items-center justify-center p-6">
      <div className="max-w-6xl w-full text-white text-center">
        {/* Text Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold">Exclusive Property</h2>
          <p className="text-lg mt-2 max-w-xl mx-auto">
            Discover the finest selection of luxury properties designed for your comfort and style.
          </p>
        </div>

        {/* Image Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between space-y-6 lg:space-y-0 lg:space-x-6">
          {/* Full Image Card (Left Side) */}
          <div className="w-full lg:w-2/3 h-64 lg:h-96 bg-gray-400 rounded-2xl overflow-hidden shadow-xl">
            <img src={Apartment} alt="Property" className="w-full h-full object-cover" />
          </div>

          {/* Right Side - Two Image Cards (Taking Remaining Space) */}
          <div className="w-full lg:w-1/3 flex flex-col space-y-4">
            <div className="w-full h-40 bg-gray-300 rounded-xl overflow-hidden shadow-md">
              <img src={Apartment} alt="Property 1" className="w-full h-full object-cover" />
            </div>
            <div className="w-full h-40 bg-gray-300 rounded-xl overflow-hidden shadow-md">
              <img src={Apartment} alt="Property 2" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
