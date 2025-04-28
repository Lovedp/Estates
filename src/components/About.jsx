import React from 'react';
import { FaBuilding, FaHome, FaHandshake, FaChartLine, FaUsers } from 'react-icons/fa';
import { MdLocationCity } from 'react-icons/md';
import teamPhoto from '../assets/team.jpg';
import  officePhoto from '../assets/office.jpeg';

const About = () => {
  return (
    <div className="bg-white mt-5">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-20 mt-[110px]">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Transforming real estate experiences with integrity, innovation, and 
            exceptional service since 2010.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white transform skew-y-1 -mb-8"></div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-6 text-lg">
                To empower people by making property transactions simple, 
                transparent, and rewarding. We believe everyone deserves 
                a home that brings them joy and security.
              </p>
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-800 italic">
                  "We don't just sell properties - we help build communities 
                  and create lasting relationships."
                </p>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src={officePhoto} 
                alt="Our office" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
            By The Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem icon={<FaBuilding size={40} />} number="5,000+" label="Properties Sold" />
            <StatItem icon={<FaUsers size={40} />} number="10,000+" label="Happy Clients" />
            <StatItem icon={<MdLocationCity size={40} />} number="25+" label="Cities Served" />
            <StatItem icon={<FaHandshake size={40} />} number="15+" label="Years Experience" />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <img 
                src={teamPhoto} 
                alt="Our team" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 md:pl-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Meet Our Team</h2>
              <p className="text-gray-600 mb-6 text-lg">
                Our team of passionate professionals brings together decades 
                of experience in real estate, finance, and customer service. 
                We're united by our commitment to excellence and our love for 
                helping people find their perfect space.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                View Our Agents
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <ValueCard 
              icon={<FaHandshake size={30} className="text-blue-600" />}
              title="Integrity"
              description="We believe in doing what's right, not just what's easy. Honesty and transparency guide every decision."
            />
            <ValueCard 
              icon={<FaHome size={30} className="text-blue-600" />}
              title="Client Focus"
              description="Your needs come first. We listen carefully and work tirelessly to exceed your expectations."
            />
            <ValueCard 
              icon={<FaChartLine size={30} className="text-blue-600" />}
              title="Innovation"
              description="We embrace technology and creative solutions to make your real estate journey seamless."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to find your dream property?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our expert agents are here to guide you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition duration-300">
              Browse Properties
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-700 font-bold py-3 px-8 rounded-lg transition duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Reusable Stat Component
const StatItem = ({ icon, number, label }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
    <div className="text-blue-600 mb-4 flex justify-center">{icon}</div>
    <h3 className="text-3xl font-bold text-gray-800 mb-2">{number}</h3>
    <p className="text-gray-600">{label}</p>
  </div>
);

// Reusable Value Card Component
const ValueCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
    <div className="flex items-center mb-4">
      <div className="mr-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default About;