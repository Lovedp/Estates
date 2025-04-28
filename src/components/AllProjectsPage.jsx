import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

const AllProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/listing/all-projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        setProjects(data.data || []); // Ensure data.data exists or default to empty array
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProjects();
  }, []);

  const handlePropertyClick = (id) => {
    if (!id) {
      console.error("No ID provided for listing");
      return;
    }
    navigate(`/listings/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p>Error loading projects: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-[110px]">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">All Projects</h1>
      
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No projects found. Be the first to create one!</p>
          <Link 
            to="/create-project" 
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              {project.imageUrl && project.imageUrl.length > 0 && (
                <img 
                  src={project.imageUrl[0]} 
                  alt={project.title} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/600x400?text=Project+Image';
                  }}
                />
              )}
              
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{project.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <FaUser className="mr-2" />
                  <span>
                    Created by: {project.createdBy?.name || 'Unknown user'}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <FaCalendarAlt className="mr-2" />
                  <span>
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Date not available'}
                  </span>
                </div>
                
                <button
                  onClick={() => handlePropertyClick(project._id)} // Pass project.id here
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition"
                >
                  View Details <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProjectsPage;