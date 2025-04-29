import React, { useState } from "react";
import Valkyrie from '../assets/Valkyrie.svg';
import {Link, useNavigate} from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';


const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null); // Reset error before new request

    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        return;
      }

      setAccountCreated(true);
      setError(null);
      alert("Account successfully created!");
      navigate('/signin');

    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Company Logo */}
        <div className="flex justify-center mb-4">
          <img src={Valkyrie} alt="Company Logo" className="h-12" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-700">Sign Up</h2>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {accountCreated && (
          <p className="text-green-500 text-center mt-2">Account has been created successfully!</p>
        )}

        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-200"
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition disabled:bg-gray-400"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <a href="/signin" className="text-purple-600 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
