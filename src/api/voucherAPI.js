import instance from "../configs/axios.config";

const voucherAPI = {
    // GET: /api/v1/vouchers
    getAllVouchers: async () => {
        try {
            const response = await instance.get("/api/v1/vouchers");
            return response?.data;
        } catch (error) {
            return error?.response?.data;
        }
    },

    // POST: /api/v1/vouchers/create
    createVoucher: async ({ voucherName, voucherValue, quantity }) => {
        try {
            const response = await instance.post("/api/v1/vouchers/create", { voucherName, voucherValue, quantity });
            return response?.data;
        } catch (error) {
            return error?.response?.data;
        }
    },

    // POST: /api/v1/vouchers/edit
    updateVoucher: async ({ id, voucherName, voucherValue, quantity }) => {
        try {
            const response = await instance.post(`/api/v1/vouchers/edit/${id}`, { voucherName, voucherValue, quantity });
            return response?.data;
        } catch (error) {
            return error?.response?.data;
        }
    },

    // GET: /api/v1/vouchers/:id
    getVoucherById: async (id) => {
        try {
            const response = await instance.get(`/api/v1/vouchers/${id}`);
            return response?.data;
        } catch (error) {
            return error?.response?.data;
        }
    },

    // DELETE: /api/v1/vouchers/create
    deleteVoucher: async (id) => {
        try {
            const response = await instance.delete(`/api/v1/vouchers/delete/${id}`);
            return response?.data;
        } catch (error) {
            return error?.response?.data;
        }
    },
};

export default voucherAPI;
