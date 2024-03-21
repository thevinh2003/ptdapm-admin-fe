import instance from "../configs/axios.config";

const paymentAPI = {
  // GET: /api/v1/reports/order
  getAllOrders: async ({ startDate, endDate }) => {
    try {
      const response = await instance.get(
        `/api/v1/reports/order?startDate=${startDate}&endDate=${endDate}`
      );
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
  // GET: /api/v1/payment/:orderId
  getPaymentByOrderId: async (orderId) => {
    try {
      const response = await instance.get(`/api/v1/payment/${orderId}`);
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
  // PUT /api/v1/payment/update/:orderId
  updatePaymentStatus: async (orderId, status) => {
    try {
      const response = await instance.put(`/api/v1/payment/update/${orderId}`, {
        status,
      });
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },

  // DELETE /api/v1/payment/delete/:orderId
  deletePayment: async (orderId) => {
    try {
      const response = await instance.delete(
        `/api/v1/payment/delete/${orderId}`
      );
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
};

export default paymentAPI;
