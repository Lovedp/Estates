import React, { useState } from 'react';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import client1 from '../assets/client1.jpg';
import client2 from '../assets/client2.jpg';
import client3 from '../assets/client3.jpg';
import client4 from '../assets/client4.jpg';
import { MdLocationOn } from 'react-icons/md';
import {  FaPlay } from 'react-icons/fa';

const TestimonialsPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah & Michael Johnson',
      role: 'First-Time Homebuyers',
      content: 'We were nervous first-time buyers, but our agent made the process so smooth. They explained everything clearly and fought to get us the perfect home in our budget. We couldn\'t be happier with our new place!',
      rating: 5,
      image: client1,
      location: 'San Francisco, CA'
    },
    {
      id: 2,
      name: 'David Chen',
      role: 'Investor',
      content: 'As a real estate investor, I need an agency that understands the market deeply. They identified properties with great potential that others overlooked. My portfolio has grown 40% in two years working with them.',
      rating: 5,
      image: client2,
      location: 'New York, NY'
    },
    {
      id: 3,
      name: 'The Rodriguez Family',
      role: 'Relocating Family',
      content: 'Moving cross-country with three kids was daunting, but our agent found us the perfect family home near great schools. They even connected us with local services to make our transition easier.',
      rating: 5,
      image: client3,
      location: 'Austin, TX'
    },
    {
      id: 4,
      name: 'Emily Wilson',
      role: 'Luxury Home Seller',
      content: 'They marketed my property beautifully and negotiated an offer above asking price. The professional photography and virtual tours brought serious buyers. The entire sale was handled with absolute discretion.',
      rating: 5,
      image: client4,
      location: 'Miami, FL'
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen mt-[110px]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Client Success Stories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl max-w-3xl mx-auto"
          >
            Don't just take our word for it - hear what our clients say about their real estate journey with us
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50 transform skew-y-1 -mb-8"></div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden"
          >
            <div className="md:flex">
              <div className="md:w-1/3 bg-blue-600 p-8 flex flex-col justify-center items-center text-white">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden mb-6">
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{testimonials[currentIndex].name}</h3>
                <p className="text-blue-100 mb-2">{testimonials[currentIndex].role}</p>
                <p className="text-blue-100 flex items-center">
                  <MdLocationOn className="mr-1" />
                  {testimonials[currentIndex].location}
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`${i < testimonials[currentIndex].rating ? 'text-yellow-300' : 'text-blue-200'} text-xl`}
                    />
                  ))}
                </div>
              </div>
              <div className="md:w-2/3 p-8 md:p-12">
                <FaQuoteLeft className="text-blue-600 text-3xl mb-6 opacity-20" />
                <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                  {testimonials[currentIndex].content}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div className="flex space-x-4">
                    <button 
                      onClick={prevTestimonial}
                      className="p-2 rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white transition-colors duration-300"
                      aria-label="Previous testimonial"
                    >
                      <FaChevronLeft />
                    </button>
                    <button 
                      onClick={nextTestimonial}
                      className="p-2 rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white transition-colors duration-300"
                      aria-label="Next testimonial"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Testimonials Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Video Testimonials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="relative pt-[56.25%] bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <FaPlay />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">The Thompson Family's Story</h3>
                <p className="text-gray-600">Watch how we helped them find their dream home</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="relative pt-[56.25%] bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <FaPlay />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Investor Success: Mark's Portfolio</h3>
                <p className="text-gray-600">How strategic purchases doubled his returns</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start your success story?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our clients' satisfaction is our greatest achievement. Let us help you with your real estate goals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition duration-300 shadow-lg">
              Contact Our Team
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-700 font-bold py-3 px-8 rounded-lg transition duration-300 shadow-lg">
              Browse Properties
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestimonialsPage;