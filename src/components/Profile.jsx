import { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess } from "../redux/user/userSlice";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getUserListings } from '../../my-project/api/controllers/user.controller';
import { Link } from 'react-router-dom';

const Profile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userListings, setUserListings]=useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showListingsError, setShowListingsError] =useState(false)

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        password: '',
      });
      setPreviewUrl(currentUser.avatar || '/default-avatar.png');
    }
  }, [currentUser]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Profile.jsx
const getImageUrl = (url) => {
  if (!url) return '/default-avatar.png';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${window.location.origin}/uploads/${url}?${Date.now()}`;
};


  const resetEditMode = useCallback(() => {
    setIsEditing(false);
    setFile(null);
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        password: '',
      });
      setPreviewUrl(currentUser.avatar || '/default-avatar.png');
    }
    setErrors({});
  }, [currentUser]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, WEBP)');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));

    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please sign in again.');
      }

      const formPayload = new FormData();
      formPayload.append('username', formData.username);
      formPayload.append('email', formData.email);
      if (formData.password) formPayload.append('password', formData.password);
      if (file) formPayload.append('avatar', file);

      const response = await fetch(`/api/users/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formPayload,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Profile update failed');
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      dispatch(updateUserSuccess(data));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setFile(null);
      setFormData(prev => ({ ...prev, password: '' }));

      if (data.avatar) {
        setPreviewUrl(data.avatar.includes('http') ? data.avatar : `${data.avatar}?${Date.now()}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      if (error.message.includes('token') || error.message.includes('Token')) {
        localStorage.removeItem('token');
        navigate('/signin');
        toast.error('Session expired. Please sign in again.');
      } else {
        toast.error(error.message || 'Failed to update profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirmation) {
      setShowDeleteConfirmation(true);
      return;
    }

    setIsDeleting(true);
    try {
      dispatch(deleteUserStart());
      const token = localStorage.getItem('token');

      const response = await fetch(`/api/users/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Account deletion failed');
      }

      dispatch(deleteUserSuccess());
      localStorage.removeItem('token');
      toast.success('Account deleted successfully');
      navigate('/signin');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error(error.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  const handleShowListings = async ()=>{
    try{
      setShowListingsError(false);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/listings/${currentUser._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
        if(data.success===false){
          setShowListingsError(true);
          return;
        }
      setUserListings(data);

    }catch(error){
      setShowListingsError(true)

    }
  }

  const handleListingDelete= async(listingId)=>{
    try{
      const res = await fetch(`/api/listing/delete/${listingId}`,{
        method: 'DELETE',
      });
     const data = await res.json();
     if(data.success === false){
      console.log(data.message);
      return;
     }
    setUserListings((prev)=>prev.filter((listing)=>listing._id !== listingId));
    }catch(error){
      console.log(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 mt-[110px]">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-indigo-600 py-8 px-6 sm:py-12 sm:px-10 text-center">
            <div className="relative mx-auto w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
              <img
                onClick={() => isEditing && fileRef.current.click()}
                src={getImageUrl(previewUrl)}
                alt="Profile"
                className={`w-full h-full object-cover ${isEditing ? 'cursor-pointer hover:opacity-90' : ''}`}
                aria-hidden={!isEditing}
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                }}
              />
              {isEditing && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
                  onClick={() => fileRef.current.click()}
                  role="button"
                  aria-label="Change profile picture"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && fileRef.current.click()}
                >
                  <input
                    type="file"
                    ref={fileRef}
                    className="hidden"
                    accept="image/jpg,image/jpeg, image/png, image/webp"
                    onChange={handleFileChange}
                  />
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              )}
            </div>
            <h1 className="mt-6 text-2xl font-bold text-white">{currentUser?.username || 'User'}</h1>
            <p className="text-indigo-200">{currentUser?.email}</p>
          </div>

          <div className="py-8 px-6 sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    }`}
                  aria-disabled={!isEditing}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    }`}
                  aria-disabled={!isEditing}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {isEditing && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Leave blank to keep current"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    autoComplete="new-password"
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
              )}

              <div className="mt-8 flex flex-wrap justify-between gap-3">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={resetEditMode}
                      className="px-4 py-2 rounded-md text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 rounded-md text-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 rounded-md text-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit Profile
                  </button>
                )}

                {showDeleteConfirmation ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700">Are you sure?</span>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirmation(false)}
                      className="px-3 py-1 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="px-3 py-1 rounded-md text-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-75"
                    >
                      {isDeleting ? 'Deleting...' : 'Confirm'}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirmation(true)}
                    className="px-4 py-2 rounded-md text-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete Account
                  </button>
                )}
              </div>
            </form>
            <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
            <p className='text-red-700 mt-5'>{showListingsError? 'Error showing listings':''}</p>
            {userListings && userListings.length>0 && 
            <div className='flex flex-col gap-4'>
              <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
            {userListings.map((listing)=>(
             <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
              <Link to = {`/listing/ ${listing._id}`}>
              <img src={`http://localhost:3000${listing.imageUrls[0]}`} alt="listing" className='h-16 w-16 object-contain rounded-lg'/>
                </Link>
                <Link className='text-slate-700 font-semibold flex-1 hover:underline truncate' to = {`/listing/ ${listing._id}`}>
               <p>{listing.name}</p>
                </Link>
               <div className='flex flex-col item-center'>
               <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
              <Link to={`/update-listing/${listing._id}`} >
               <button className='text-green-700 uppercase'>edit</button>
              </Link>

              </div>                
               
              </div> 
            ))}
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
