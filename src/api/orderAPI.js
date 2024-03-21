import instance from "../configs/axios.config";

const orderAPI = {
    // GET: /api/v1/orders/detail
    getAllOrdersDetail: async () => {
        try {
            const response = await instance.get("/api/v1/orders/detail");
            return response?.data;
        } catch (error) {
            return error?.response?.data;
        }
    },
};

export default orderAPI;
