import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const propertyCategories = [
    { id: 'family-house', label: 'Family House' },
    { id: 'apartment', label: 'Apartment' },
    { id: 'lands', label: 'Lands' },
    { id: 'modern-villa', label: 'Modern Villa' },
    { id: 'offices', label: 'Offices' }
];

const propertyTypes = [
    { id: 'sale', label: 'Sell' },
    { id: 'rent', label: 'Rent' },
];

const propertyDetails = [
    { id: 'bedrooms', label: 'Bedrooms', min: 1, max: 10 },
    { id: 'bathrooms', label: 'Bathrooms', min: 1, max: 10 },
    { id: 'regularPrice', label: 'Regular Price', min: 1, suffix: '#/month' },
];

export default function ListingForm() {
    const { currentUser } = useSelector(state => state.user);
    const [formData, setFormData] = useState({
        type: 'sale',
        category: '',
        name: '',
        address: '',
        userRef: '',
        offer: false,
        parking: false,
        furnished: false,
        description: '',
        imageUrls: [],
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 0,
        discountPrice: 0,
    });

    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({ ...prev, userRef: currentUser._id }));
        } else {
            // Redirect to sign-in page or handle unauthorized access
            navigate('/sign-in'); // Replace with your sign-in route
            toast.error('You must be signed in to create a listing.');
        }
    }, [currentUser, navigate]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token && currentUser) {
            navigate('/sign-in');
            toast.error('You must be signed in to create a listing.');
        }
    }, [token, currentUser, navigate]);

    const handleInputChange = (e) => {
        const { id, value, type, checked, name } = e.target;

        setFormData(prev => {
            let newValue = type === 'checkbox' ? checked : value;

            if (type === 'number') {
                newValue = parseInt(value) || 0;
            }

            if (type === 'radio') {
                if (name === 'type') {
                    return { ...prev, type: id };
                } else if (name === 'category') {
                    return { ...prev, category: id };
                }
            }

            return { ...prev, [id]: newValue };
        });
    };

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        const totalImages = formData.imageUrls.length + selectedFiles.length;

        if (totalImages > 6) {
            const errorMsg = `Maximum 6 images allowed. You already have ${formData.imageUrls.length} images.`;
            setError(errorMsg);
            toast.error(errorMsg);
            e.target.value = ''; // Clear the file input
            return;
        }

        setFiles(selectedFiles);
        setError(null);
    };

    const handleRemoveImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, index) => index !== indexToRemove)
        }));
        toast.info('Image removed successfully');
    };

    const handleImageSubmit = async (e) => {
      e.preventDefault();

      if (files.length === 0) {
          const errorMsg = 'Please select at least one image';
          setError(errorMsg);
          toast.error(errorMsg);
          return;
      }

      const totalImages = formData.imageUrls.length + files.length;
      if (totalImages > 6) {
          const errorMsg = `Cannot upload ${files.length} images. You can only upload ${6 - formData.imageUrls.length} more images.`;
          setError(errorMsg);
          toast.error(errorMsg);
          return;
      }

      setIsUploading(true);
      setError(null);

      try {
          const uploadPromises = files.map(file => {
              const imageFormData = new FormData();
              imageFormData.append('image', file);
              return fetch('http://localhost:3000/api/listing/upload/', {
                  method: 'POST',
                  headers: { // Add the Authorization header here
                    'Authorization': `Bearer ${token}`
                },
                  body: imageFormData,
              }).then(res => res.json()).then(result => {  // Add this .then() block
                console.log("API Response:", result); // Inspect the entire response
                return result; // Pass the result to the next .then()
                });
          });

          const results = await Promise.all(uploadPromises);
          const uploadedUrls = results.flatMap(result => {
            // Handle both single and array responses
            if (result.urls && Array.isArray(result.urls)) {
              return result.urls;
            }
            return [];
          });
          
          console.log("All image URLs:", uploadedUrls);
          
          setFormData(prev => ({
              ...prev,
              imageUrls: [...prev.imageUrls, ...uploadedUrls]
          }));

          setFiles([]);
          toast.success(`${files.length} image(s) uploaded successfully!`);
      } catch (err) {
          const errorMsg = 'Failed to upload images. Please try again.';
          setError(errorMsg);
          toast.error(errorMsg);
          console.error("Upload error:", err);
      } finally {
          setIsUploading(false);
      }
  };
  const getImageUrl = (url) => {
    // If URL is already absolute (starts with http)
    if (/^https?:\/\//.test(url)) return url;
    
    // For development - use your backend URL
    if (process.env.NODE_ENV === 'development') {
      return `http://localhost:3000${url}`;
    }
    
    // For production - assumes same domain
    return url;
  };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!formData.category) {
                throw new Error('Please select a property category');
            }

            if (formData.imageUrls.length === 0) {
                throw new Error('Please upload at least one image');
            }

            if (formData.offer && (formData.discountPrice >= formData.regularPrice)) {
                throw new Error('Discount price must be less than regular price');
            }

            if (!token) {
                throw new Error('Authentication token is missing.');
            }

            const response = await fetch('/api/listing/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                    discountPrice: formData.offer ? formData.discountPrice : 0
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Validation failed');
            }

            const data = await response.json();
            console.log('Upload successful:', data);
            toast.success('Listing created successfully!');

            // Reset form after successful submission
            setFormData(prev => ({
                ...prev,
                category: '',
                name: '',
                address: '',
                offer: false,
                parking: false,
                furnished: false,
                description: '',
                imageUrls: [],
                bedrooms: 1,
                bathrooms: 1,
                regularPrice: 0,
                discountPrice: 0,
            }));

        } catch (error) {
            console.error('Error:', error);
            const errorMsg = error.message || 'Something went wrong. Please check all required fields.';
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    return (
        <main className='p-4 max-w-4xl mx-auto mt-[120px]'>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <h1 className='text-3xl font-bold text-center my-7 text-gray-800'>
                Create Listing
            </h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {currentUser ? (
                <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
                    {/* Basic Information Section */}
                    <div className='flex flex-col sm:flex-row gap-6'>
                        <div className='flex flex-col gap-4 flex-1'>
                            <div>
                                <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                                    Name
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder='Property name'
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    maxLength='64'
                                    minLength='10'
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-1'>
                                    Description
                                </label>
                                <textarea
                                    id='description'
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder='Detailed description of the property'
                                    className='w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor='address' className='block text-sm font-medium text-gray-700 mb-1'>
                                    Address
                                </label>
                                <input
                                    type='text'
                                    id='address'
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder='Full property address'
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category Selection Section */}
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <h2 className='text-lg font-semibold mb-4 text-gray-800'>Category</h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                            {propertyCategories.map((category) => (
                                <div key={category.id} className='flex items-center gap-2'>
                                    <input
                                        type='radio'
                                        id={category.id}
                                        name='category'
                                        checked={formData.category === category.id}
                                        onChange={handleInputChange}
                                        className='w-5 h-5 text-blue-600 rounded-full focus:ring-blue-500'
                                        required
                                    />
                                    <label htmlFor={category.id} className='text-gray-700'>
                                        {category.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Type Options Section */}
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <h2 className='text-lg font-semibold mb-4 text-gray-800'>Type</h2>
                        <div className='flex flex-wrap gap-6'>
                            {propertyTypes.map((option) => (
                                <div key={option.id} className='flex items-center gap-2'>
                                    <input
                                        type='radio'
                                        id={option.id}
                                        name='type'
                                        checked={formData.type === option.id}
                                        onChange={handleInputChange}
                                        className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500'
                                    />
                                    <label htmlFor={option.id} className='capitalize text-gray-700'>
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <h2 className='text-lg font-semibold mb-4 text-gray-800'>Features</h2>
                        <div className='flex flex-wrap gap-6'>
                            {['offer', 'parking', 'furnished'].map((feature) => (
                                <div key={feature} className='flex items-center gap-2'>
                                    <input
                                        type='checkbox'
                                        id={feature}
                                        checked={formData[feature]}
                                        onChange={handleInputChange}
                                        className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500'
                                    />
                                    <label htmlFor={feature} className='capitalize text-gray-700'>
                                        {feature}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Property Details Section */}
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <h2 className='text-lg font-semibold mb-4 text-gray-800'>Property Details</h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
                            {propertyDetails.map((field) => (
                                <div key={field.id} className='flex flex-col'>
                                    <label htmlFor={field.id} className='text-sm font-medium text-gray-700 mb-1'>
                                        {field.label}
                                    </label>
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type='number'
                                            id={field.id}
                                            value={formData[field.id]}
                                            onChange={handleInputChange}
                                            min={field.min}
                                            max={field.max}
                                            required={field.id === 'bedrooms' || field.id === 'bathrooms' || field.id === 'regularPrice'}
                                            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        />
                                        {field.suffix && (
                                            <span className='text-xs text-gray-500 whitespace-nowrap'>
                                                {field.suffix}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {formData.offer && (
                                <div className='flex flex-col'>
                                    <label htmlFor='discountPrice' className='text-sm font-medium text-gray-700 mb-1'>
                                        Discount Price
                                    </label>
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type='number'
                                            id='discountPrice'
                                            value={formData.discountPrice}
                                            onChange={handleInputChange}
                                            min={1}
                                            max={formData.regularPrice - 1}
                                            required={formData.offer}
                                            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        />
                                        <span className='text-xs text-gray-500 whitespace-nowrap'>#/month</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <h2 className='text-lg font-semibold mb-2 text-gray-800'>Images</h2>
                        <p className='text-sm text-gray-600 mb-4'>
                            The first image will be the cover (max 6 images allowed)
                        </p>

                        <div className='flex flex-col sm:flex-row gap-4 items-start'>
                            <div className='flex-1'>
                                <input
                                    type='file'
                                    onChange={handleImageChange}
                                    className='w-full p-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    multiple
                                    accept='image/*'
                                    disabled={isUploading || formData.imageUrls.length >= 6}
                                />
                                <p className='text-xs text-gray-500 mt-1'>
                                    {formData.imageUrls.length}/6 images uploaded
                                </p>
                            </div>
                            <button
                                onClick={handleImageSubmit}
                                disabled={isUploading || files.length === 0 || formData.imageUrls.length >= 6}
                                className={`px-6 py-3 text-white font-medium rounded-lg uppercase transition-colors ${isUploading || files.length === 0 || formData.imageUrls.length >= 6
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                type='button'
                            >
                                {isUploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>

                        {formData.imageUrls.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">
                                    Uploaded Images ({formData.imageUrls.length}/6):
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {formData.imageUrls.map((ur, index) => (
                                        <div key={index} className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                                            <img
                                                src={getImageUrl(ur)}
                                                alt={`Uploaded ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-0 right-0 m-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                                            >
                                                <span className="text-sm">X</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        disabled={isUploading || !currentUser}
                        className={`bg-blue-600 text-white p-3 rounded-lg font-medium uppercase hover:bg-blue-700 ${isUploading || !currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isUploading ? 'Creating...' : 'Create Listing'}
                    </button>
                </form>
            ) : (
                <div className="text-center text-red-500">
                    You must be signed in to create a listing.
                </div>
            )}
        </main>
    );
}
