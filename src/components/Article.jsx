import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Apartment from "../assets/Apartment.jpg";

export default function RecentNews() {
  const navigate = useNavigate();

  // News data with full content
  const news = [
    {
      id: 1,
      image: Apartment,
      type: "Luxury Apartment",
      date: "Jan 25, 2025",
      title: "Discover the latest trends in real estate",
      content: "Full article content about real estate trends...",
      author: "Jane Doe",
      readTime: "5 min read"
    },
    {
      id: 2,
      image: Apartment,
      type: "Modern Villa",
      date: "Feb 10, 2025",
      title: "Why modern homes are in high demand",
      content: "Full article content about modern villas...",
      author: "John Smith",
      readTime: "4 min read"
    },
    {
      id: 3,
      image: Apartment,
      type: "Beachfront Property",
      date: "Mar 5, 2025",
      title: "Top 5 beachfront properties to invest in",
      content: "Full article content about beachfront properties...",
      author: "Sarah Johnson",
      readTime: "7 min read"
    },
    {
      id: 4,
      image: Apartment,
      type: "Penthouse Suite",
      date: "Apr 15, 2025",
      title: "The rise of penthouses in urban areas",
      content: "Full article content about penthouses...",
      author: "Michael Brown",
      readTime: "6 min read"
    },
  ];

  const handleReadMore = (articleId) => {
    navigate(`/${articleId}`, { state: { article: news.find(a => a.id === articleId) } });
  };

  const handleViewAll = () => {
    navigate('/');
  };

  return (
    <div className="w-full bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900">Recent Articles and News</h2>
          <button 
            onClick={handleViewAll}
            className="text-purple-600 text-lg font-semibold hover:underline cursor-pointer"
          >
            View All News
          </button>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((article) => (
            <div key={article.id} className="bg-gray-100 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="w-full h-48 rounded-lg overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Type & Date */}
              <p className="text-sm text-gray-600 mt-3">
                {article.type} • {article.date}
              </p>

              {/* Title */}
              <h3 className="text-lg font-semibold mt-2 text-gray-900">{article.title}</h3>

              {/* Read More Link */}
              <button
                onClick={() => handleReadMore(article.id)}
                className="text-purple-600 flex items-center mt-2 font-medium hover:underline cursor-pointer"
              >
                Read More <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}