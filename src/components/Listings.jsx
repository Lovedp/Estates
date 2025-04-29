import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair, FaExpand, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { MdSell, MdHouse } from 'react-icons/md';
import { useSelector } from 'react-redux';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import Contact from './Contact';
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const Listings = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [contact, setContact] = useState('');
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const handleSendMessage = () => {
    console.log('Message sent:', message);
    alert('Message sent successfully!');
    setMessage('');
  };

  return (
    <main className="max-w-full">
      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full">
            <img
              src={`${API}${fullscreenImage}`}
              alt="Fullscreen view"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <FaTimes className="text-gray-800 text-xl" />
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center my-20">
          <p className="text-3xl font-medium text-gray-700 animate-pulse">Loading Property Details...</p>
        </div>
      )}
      {error && (
        <div className="text-center my-20">
          <p className="text-3xl font-medium text-red-600">Error Loading Property Details</p>
          <p className="text-xl text-gray-600 mt-2">Please try again later</p>
        </div>
      )}
      
      {listing && !loading && !error && (
        <>
          {/* Full-width Image Gallery */}
          <div className="w-full mb-8">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              loop={true}
              className="w-full h-[70vh]"
            >
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div 
                    className='w-full h-full cursor-zoom-in relative'
                    style={{ 
                      background: `url(http://localhost:3000${url}) center no-repeat`,
                      backgroundSize: 'cover'
                    }}
                    onClick={() => setFullscreenImage(url)}
                  >
                    <div className="absolute bottom-6 right-6 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-base flex items-center">
                      <FaExpand className="mr-2 text-lg" />
                      Click to expand
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Property Details Section */}
          <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{listing.name}</h1>
                <div className="flex items-center text-gray-700 mb-6 text-xl">
                  <FaMapMarkerAlt className="mr-3 text-blue-600 text-2xl" />
                  <span>{listing.address}</span>
                </div>
                
                <p className="text-gray-800 text-lg leading-relaxed mb-8">{listing.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-gray-50 p-5 rounded-xl text-center hover:bg-gray-100 transition-colors">
                    <FaBed className="mx-auto text-3xl text-purple-600 mb-3" />
                    <p className="font-semibold text-lg text-gray-800">
                      {listing.bedrooms} Bedroom{listing.bedrooms !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-xl text-center hover:bg-gray-100 transition-colors">
                    <FaBath className="mx-auto text-3xl text-purple-600 mb-3" />
                    <p className="font-semibold text-lg text-gray-800">
                      {listing.bathrooms} Bathroom{listing.bathrooms !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-xl text-center hover:bg-gray-100 transition-colors">
                    <FaParking className="mx-auto text-3xl text-purple-600 mb-3" />
                    <p className="font-semibold text-lg text-gray-800">
                      {listing.parking ? 'Parking' : 'No Parking'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-xl text-center hover:bg-gray-100 transition-colors">
                    <FaChair className="mx-auto text-3xl text-purple-600 mb-3" />
                    <p className="font-semibold text-lg text-gray-800">
                      {listing.furnished ? 'Furnished' : 'Unfurnished'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <span className={`px-5 py-3 rounded-full text-white font-bold text-lg ${
                  listing.type === 'sale' ? 'bg-red-600' : 'bg-blue-600'
                }`}>
                  {listing.type === 'sale' ? (
                    <MdSell className="inline mr-2 text-xl" />
                  ) : (
                    <MdHouse className="inline mr-2 text-xl" />
                  )}
                  {listing.type.toUpperCase()}
                </span>
                <p className="text-3xl font-bold text-gray-900">
                  ${listing.regularPrice.toLocaleString()}
                  {listing.type === 'rent' && (
                    <span className="text-gray-600 text-xl"> / month</span>
                  )}
                </p>
              </div>

              {listing.offer && listing.discountPrice > 0 && (
                <div className="bg-green-100 p-4 rounded-xl mb-6 border border-green-200">
                  <p className="text-green-700 font-bold text-xl text-center">
                    Special Offer: ${listing.discountPrice.toLocaleString()}
                  </p>
                </div>
              )}

              {currentUser && listing.userRef !== currentUser._id && !contact && (
                <>
                <button onClick={()=>setContact(true)}
                  className='bg-blue-600 text-white rounded-lg uppercase hover:opacity-95 p-3'>Contact us</button>
                </>
              )}
              {contact && <Contact listing={listing}/>}

              <div className="mt-6 p-5 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-blue-800 text-lg text-center">
                  <FaMapMarkerAlt className="inline mr-3 text-xl" />
                  {listing.address}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Listings;