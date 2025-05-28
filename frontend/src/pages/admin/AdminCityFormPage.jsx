import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import addCity from your service
import { addCity } from '../../services/cityService';
// Removed unused imports: axios, useAuth, useClasses (unless cities needed for refresh logic)

const AdminCityFormPage = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true); // Set loading to true

    if (!name.trim()) { // Updated validation
      setError('City name is required.');
      setLoading(false); // Reset loading
      return;
    }

    try {
      // Call the addCity service function with the city name
      // The addCity service now handles sending JSON and auth token via the api instance
      await addCity({ name: name.trim() });

      setSuccess(true);
      setName(''); // Clear the input field
      
      // Navigate back to the cities list page or a success page after a short delay
      setTimeout(() => {
        navigate('/admin/cities', { state: { message: 'City added successfully!' } });
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add city. Please try again.');
    } finally {
      setLoading(false); // Reset loading
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add a New Branch Location</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded" role="alert">
          <p className="font-bold">Success</p>
          <p>City added successfully! Redirecting...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-lg shadow">
        <div>
          <label htmlFor="cityName" className="block text-sm font-medium text-gray-700">
            Branch Name *
          </label>
          <input
            type="text"
            id="cityName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter branch name (e.g., New York)"
          />
        </div>

        {/* Image input removed */}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/cities')} // Navigate back to the list
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={loading || success} // Disable button while loading or on success before redirect
          >
            {loading ? 'Saving...' : 'Add Branch'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCityFormPage;