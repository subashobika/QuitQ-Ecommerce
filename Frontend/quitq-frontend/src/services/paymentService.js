import api from '../api/api'; 

const paymentService = {
  processPayment: async (paymentDTO) => {
    const response = await api.post('/payments', paymentDTO);
    return response.data;
  }
};

export default paymentService;
