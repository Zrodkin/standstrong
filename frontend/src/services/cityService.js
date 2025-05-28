import api from './api';

// GET all cities (e.g., for dropdowns and homepage)
export const getAllCityRecords = async () => {
  const response = await api.get('/cities'); // Fetches { _id, name }
  return response.data;
};

// POST a new city name (e.g., from a simplified AdminCityFormPage if it were to exist)
// cityData should be an object like { name: "New City Name" }
export const addCity = async (cityData) => {
  const response = await api.post('/cities', cityData, {
    // No longer multipart/form-data, axios will default to application/json
    // headers: { 'Content-Type': 'application/json' } // This is usually default
  });
  return response.data;
};

export const deleteCityById = async (id) => {
    const response = await api.delete(`/cities/${id}`);
    return response.data;
  };

// If you had an editCity function, it would also change from FormData to JSON:
// export const updateCityName = async (id, cityNameData) => { // cityNameData = { name: "Updated Name" }
//   const response = await api.put(`/cities/${id}`, cityNameData);
//   return response.data;
// };