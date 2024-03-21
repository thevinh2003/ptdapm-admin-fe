import instance from "../configs/axios.config";

const reportAPI = {
    // GET: /api/v1/reports/product
    getProductReport: async () => {
        try {
            const response = await instance.get("/api/v1/reports/product");
            return response?.data;
        } catch (error) {
            return error?.response?.data;
        }
    },

    // GET: /api/v1/reports/revenue
    getRevenueReport: async (startDate, endDate) => {
        try {
            // const response = await instance.get(`/api/v1/reports/revenue?startDate=2024-03-07&endDate=2024-03-14`);
            const response = await instance.get(`/api/v1/reports/revenue`);
            return response?.data;
        } catch (error) {
            return error?.response?.data;
        }
    },

    // GET: /api/v1/reports/revenue/today
    getRevenueReportToday: async () => {
        try {
            const response = await instance.get(`/api/v1/reports/revenue/today`);
            return response?.data;
        } catch (error) {
            return error?.response?.data;
        }
    },
};

export default reportAPI;
