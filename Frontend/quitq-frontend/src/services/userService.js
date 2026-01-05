import api from '../api/api'; 

const userService = {
 
  getUser: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },


  updateUser: async (id, data) => {
    
    const payload = {
      name: data.name,
      email: data.email,
      role: data.role || 'USER', 
      contactNumber: data.contactNumber || '',
      gender: data.gender || '',
      address: data.address || '',
    };

    if (data.password && data.password.trim() !== '') {
      payload.password = data.password;
    }

    try {
      const response = await api.put(`/users/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
};

export default userService;
