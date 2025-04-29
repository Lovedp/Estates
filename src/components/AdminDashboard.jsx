import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import UserTable from './UserTable';
import ListingsTable from './ListingsTable';
import MessageModal from './MessageModal';
import ListingForm from './ListingForm';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isListingFormOpen, setIsListingFormOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user?.isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await fetch(`${API}/api/admin/users`);
        const usersData = await usersRes.json();
        setUsers(usersData.data || usersData || []);
        
        const listingsRes = await fetch(`${API}/api/admin/listings`);
        const listingsData = await listingsRes.json();
        setListings(listingsData.data || listingsData || []);
      } catch (error) {
        console.error('Fetch error:', error);
        setUsers([]);
        setListings([]);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`${API}/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const response = await fetch(`${API}/api/admin/listings/${listingId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setListings(listings.filter((listing) => listing._id !== listingId));
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const handleListingCreated = (newListing) => {
    setListings([...listings, newListing]);
    setIsListingFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 pt-[140px]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Admin Dashboard
        </h1>

        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab className="tab-button">Users</Tab>
            <Tab className="tab-button">Listings</Tab>
          </Tab.List>

          <Tab.Panels className="mt-4">
            <Tab.Panel>
              <UserTable
                users={users}
                onDelete={handleDeleteUser}
                onMessage={(user) => {
                  setSelectedUser(user);
                  setIsMessageOpen(true);
                }}
              />
            </Tab.Panel>
            <Tab.Panel>
              <ListingsTable
                listings={listings}
                onDelete={handleDeleteListing}
                onAddListing={() => setIsListingFormOpen(true)}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Modals */}
      <MessageModal
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        user={selectedUser}
      />
      <ListingForm
        isOpen={isListingFormOpen}
        onClose={() => setIsListingFormOpen(false)}
        onListingCreated={handleListingCreated}
      />
    </div>
  );
}
