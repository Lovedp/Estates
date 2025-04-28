import { useState } from "react";
import Valkyrie from '../assets/Valkyrie.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInFailure, signInSuccess } from "../redux/user/userSlice";
import Oauth from "./Oauth";
import { toast } from 'react-toastify';
import { Shield } from 'lucide-react'; // Import an admin icon

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
  
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      
      if (!res.ok) {
        dispatch(signInFailure(data.message || 'Invalid credentials'));
        toast.error(data.message || 'Sign in failed');
        return;
      }
  
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
      }
  
      dispatch(signInSuccess(data));
      toast.success("Signed in successfully!");
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error(error.message || 'Connection error');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg">
        <div className="flex justify-center mb-4">
          <img src={Valkyrie} alt="Company Logo" className="h-12" />
        </div>
        <h2 className="text-center text-2xl font-semibold text-gray-700">Sign In</h2>

        {error && <p className="text-center text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-purple-600 uppercase px-4 py-2 text-white font-medium transition-all hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <Oauth/>
        </form>

        <div className="flex flex-col space-y-3">
          <p className="text-center text-sm text-gray-500">
            Don't have an account? <Link to="/signup" className="text-purple-600 hover:underline">Sign Up</Link>
          </p>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 flex-shrink text-sm text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <Link 
            to="/admin/login" 
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-all hover:bg-gray-200"
          >
            <Shield size={18} />
            <span>Admin Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;