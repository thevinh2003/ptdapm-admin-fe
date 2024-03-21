import instance from "../configs/axios.config";

const reviewAPI = {
    // GET: /api/v1/reviews
    getAllReviews: async () => {
        try {
            const response = await instance.get("/api/v1/reviews");
            return response?.data;
        } catch (error) {
            return error?.response?.data;
        }
    },

    // POST: /api/v1/reviews/edit/:id
    updateFeedback: async ({ id, feedback, feedbackDate }) => {
        try {
            const response = await instance.post(`/api/v1/reviews/edit/${id}`, { feedback, feedbackDate });
            return response?.data;
        } catch (error) {
            return error?.response?.data;
        }
    },

    // DELETE: /api/v1/reviews/delete/:id
    deleteFeedback: async (id) => {
        try {
            const response = await instance.delete(`/api/v1/reviews/delete/${id}`);
            return response?.data;
        } catch (error) {
            return error?.response?.data;
        }
    },
};

export default reviewAPI;
