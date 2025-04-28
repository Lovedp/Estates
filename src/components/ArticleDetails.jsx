import { useLocation, useNavigate } from "react-router-dom";

export default function ArticleDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const article = state?.article;

  if (!article) {
    return (
      <div className="w-full bg-white py-16 text-center">
        <h2 className="text-2xl font-bold">Article not found</h2>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Back to News
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-16 mt-4">
      <div className="max-w-4xl mx-auto px-6">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 text-purple-600 hover:underline flex items-center"
        >
          ← Back to News
        </button>

        <div className="mb-8">
          <p className="text-sm text-gray-600">
            {article.type} • {article.date} • {article.readTime}
          </p>
          <h1 className="text-3xl font-bold mt-2 text-gray-900">{article.title}</h1>
          <p className="text-gray-600 mt-2">By {article.author}</p>
        </div>

        <div className="w-full h-96 rounded-lg overflow-hidden mb-8">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">{article.content}</p>
          {/* Add more content paragraphs as needed */}
        </div>
      </div>
    </div>
  );
}