import api from '../api/api';

export const getProductsByCategory = async (categoryId, filters = {}) => {
  let queryParams = new URLSearchParams();

  if (categoryId) queryParams.append('categoryId', categoryId);
  if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice);
  if (filters.searchTerm) queryParams.append('name', filters.searchTerm);


  const response = await api.get(`/products/filter?${queryParams.toString()}`);
  return response.data;
};

