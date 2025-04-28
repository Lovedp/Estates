import { Home, Key, ShieldCheck } from "lucide-react";

const WhyWorkWithUs = () => {
  const reasons = [
    {
      icon: <Home size={40} className="text-gray-800 mx-auto" />, 
      title: "We Offer Wide Range of Properties",
      description: "Explore a vast selection of properties that fit every lifestyle and budget."
    },
    {
      icon: <Key size={40} className="text-gray-800 mx-auto" />, 
      title: "Buy or Rent Houses",
      description: "Whether you're looking to buy or rent, we have options tailored for you."
    },
    {
      icon: <ShieldCheck size={40} className="text-gray-800 mx-auto" />, 
      title: "Trusted by Millions",
      description: "Join millions of satisfied customers who found their dream homes with us."
    }
  ];

  return (
    <section className="p-8 bg-gray-100 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Why You Should Work With Us</h2>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
        Discover why thousands of people trust us for their real estate needs. We provide quality, reliability, and a seamless experience.
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-8">
        {reasons.map((reason, index) => (
          <div key={index} className="p-6 flex-1 text-center">
            <div className="mb-4 flex justify-center">{reason.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{reason.title}</h3>
            <p className="text-gray-600">{reason.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyWorkWithUs;