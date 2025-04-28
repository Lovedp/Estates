import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Signin from './components/Signin';
import Signup from './components/Signup';
import About from './components/About';
import Profile from './components/Profile.jsx';
import ListingForm from './components/ListingForm';
import Listings from './components/Listings.jsx';
import PrivateRoutes from './components/PrivateRoutes.jsx';
import ListingsPage from './components/ListingsPage.jsx';
import { ToastContainer } from 'react-toastify';
import SearchResultsPage from './components/SearchResultsPage.jsx';
import 'react-toastify/dist/ReactToastify.css';
import UpdateListing from './components/UpdateListing.jsx';
import Layout from './components/Layout';
import TestimonialsPage from './components/TestimonialsPage.jsx';
import ArticleDetails from './components/ArticleDetails.jsx';
import AllProjectsPage from './components/AllProjectsPage.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import AdminRoutes from './components/AdminRoutes.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import AdminPage from './components/AdminPage.jsx';

const App = () => {
  return (
    <BrowserRouter>
  <Routes>
    {/* Public routes */}
    <Route path="/signup" element={<Signup />} />
    <Route path="/signin" element={<Signin />} />
    <Route path="/" element={<Home />} />
    <Route path="/admin/login" element={<AdminLogin />} /> {/* <-- move AdminLogin OUT of AdminRoutes */}

    {/* Routes with layout */}
    <Route element={<Layout />}>

      <Route path="/about" element={<About />} />
      <Route path="/testimonials" element={<TestimonialsPage />} />
      <Route path="/search-results" element={<SearchResultsPage />} />
      <Route path="/listings/:listingId" element={<Listings />} />
      <Route path="/:id" element={<ArticleDetails />} />
      <Route path="/all-listings" element={<AllProjectsPage />} />

      {/* Private Admin Routes */}
      <Route element={<AdminRoutes />}>
  <Route
    path='/admin'
    element={
      <>
       <AdminPage />
        <AdminDashboard />
       
      </>
    }
  />
</Route>

      {/* Private User Routes */}
      <Route element={<PrivateRoutes />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/listing-form" element={<ListingForm />} />
        <Route path="/update-listing/:listingId" element={<UpdateListing />} />
        <Route path="/listin" element={<ListingsPage />} />
      </Route>

    </Route>
  </Routes>

  <ToastContainer 
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    pauseOnHover
    draggable
    theme="colored"
  />
</BrowserRouter>

  );
};

export default App;