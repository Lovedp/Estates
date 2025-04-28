const HeroSection = () => {
    return (
      <section
        className="relative w-full h-screen bg-cover bg-center flex items-center justify-center text-center text-white px-6"
        style={{ backgroundImage: "url('/House.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 p-8 rounded-lg max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Discover a Place You Will Love to Live</h1>
          <p className="text-lg md:text-xl mb-6">
            Explore our wide range of properties and find your dream home with ease and confidence.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition">
            View Properties
          </button>
        </div>
      </section>
    );
  };
  
  export default HeroSection;
  