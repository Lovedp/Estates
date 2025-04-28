import React from "react";
import { Star } from "lucide-react";
import diimeji from "../assets/dimejii.jpg";
import techygirl from "../assets/techygirl.jpg";
import jacob from "../assets/jacob.jpg"


const testimonials = [
  {
    name: "John Doe",
    job: "Software Engineer",
    comment: "This platform is amazing! It made finding a property so easy and seamless.",
    image: diimeji,
  },
  {
    name: "Jane Smith",
    job: "Real Estate Agent",
    comment: "Great experience! The service was top-notch, and I highly recommend it.",
    image: techygirl,
  },
  {
    name: "Michael Johnson",
    job: "Architect",
    comment: "A user-friendly interface and excellent customer support made my experience wonderful.",
    image: jacob,
  },
];

const TestimonialsSection = () => {
  return (
    <div className="container mx-auto px-6 md:px-20 lg:px-32 py-12">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold">What are customers saying?</h2>
        <div className="text-right flex flex-col items-end">
          <div className="text-4xl font-bold text-purple-600">10M+</div>
          <span className="text-gray-600 text-lg">Happy People</span>
          <div className="flex mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="text-yellow-500" />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-gray-200 p-8 rounded-lg shadow-md h-full flex flex-col">
            <div className="flex items-center mb-4">
              <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full mr-4" />
              <div>
                <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                <p className="text-gray-600">{testimonial.job}</p>
              </div>
            </div>
            <p className="text-gray-800 text-lg leading-relaxed">"{testimonial.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
